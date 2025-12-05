"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Upload, X, RotateCw, Loader2, Pencil, Trash } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import Cropper from "react-easy-crop";
import { getCroppedImg } from "@/lib/cropImage";

type ImageArea = { x: number; y: number; width: number; height: number };

interface AvatarUploaderProps {
  value?: string;
  onChange: (value: string) => void;
  onError?: (error: string) => void;
  className?: string;
}

export default function AvatarUploader({
  value,
  onChange,
  onError,
  className,
}: AvatarUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(value || null);
  const [isDragging, setIsDragging] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<ImageArea | null>(
    null
  );

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const handleFileSelect = useCallback(
    (file: File) => {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        onError?.("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        onError?.("Image size must be less than 5MB");
        return;
      }

      // Open crop modal
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setIsOpen(true);
      };
      reader.onerror = () => {
        onError?.("Failed to read image file");
      };
      reader.readAsDataURL(file);
    },
    [onError]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
    e.target.value = "";
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setIsDragging(false);

      const file = e.dataTransfer.files?.[0];
      if (file) {
        handleFileSelect(file);
      }
    },
    [handleFileSelect]
  );

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    onChange("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  /** Track crop area */
  const onCropComplete = useCallback(
    (_croppedArea: ImageArea, pixels: ImageArea) => {
      setCroppedAreaPixels(pixels);
    },
    []
  );

  /** Save cropped image */
  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;

    try {
      setIsSaving(true);
      const croppedUrl = await getCroppedImg(
        imageSrc,
        croppedAreaPixels,
        rotation
      );
      setPreview(croppedUrl);
      onChange(croppedUrl);
      setIsOpen(false);
    } catch (error) {
      onError?.("Failed to crop image");
    } finally {
      setIsSaving(false);
    }
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleCancel = () => {
    setImageSrc(null);
    setIsOpen(false);
    setZoom(1);
    setRotation(0);
    setCrop({ x: 0, y: 0 });
    setCroppedAreaPixels(null);
  };

  const getInitials = () => {
    return "U";
  };

  return (
    <>
      <div className={cn("flex items-center gap-4", className)}>
        <div
          className={cn(
            "relative group cursor-pointer",
            isDragging && "opacity-70"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
        >
          <Avatar className="size-32 border-2 border-border">
            {preview ? (
              <>
                <AvatarImage src={preview} alt="Avatar preview" />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </>
            ) : (
              <AvatarFallback className="bg-muted">
                <Upload className="size-8 text-muted-foreground" />
              </AvatarFallback>
            )}
          </Avatar>
          {/* {preview && (
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 size-6 rounded-full"
              onClick={handleRemove}
            >
              <X className="size-3" />
            </Button>
          )} */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
            <Pencil className="size-6 text-white" />
          </div>
        </div>

        <div className="flex flex-col justify-center items-center">
          <div className="flex gap-2 items-center">
            <Button type="button" variant="ghost" onClick={handleClick}>
              <Upload className="size-4" />
              {preview ? "Change Avatar" : "Upload Avatar"}
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleRemove}
              disabled={!preview}
            >
              <Trash className="size-4" />
              Remove Avatar
            </Button>
          </div>
          <p className="text-xs text-muted-foreground text-start self-start mt-2">
            PNG, JPG up to 5MB
          </p>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="Upload avatar"
        />
      </div>

      {/* Crop Modal */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center">
              Crop your image
            </DialogTitle>
            <DialogDescription className="text-center">
              Scale and reposition your image, if needed.
            </DialogDescription>
          </DialogHeader>
          {imageSrc && (
            <div className="relative h-[320px] w-full">
              <Cropper
                image={imageSrc}
                crop={crop}
                zoom={zoom}
                rotation={rotation}
                aspect={1}
                cropShape="round"
                showGrid={false}
                minZoom={1}
                maxZoom={3}
                onCropChange={setCrop}
                onCropComplete={onCropComplete}
                onZoomChange={setZoom}
              />
            </div>
          )}
          <div className="flex w-full items-center gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={handleRotate}
            >
              <RotateCw className="size-4" />
            </Button>
            <Slider
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onValueChange={(val) => setZoom(val)}
              className="flex-1"
            />
          </div>
          <DialogFooter className="flex items-center justify-between gap-4 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !croppedAreaPixels}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                </span>
              ) : (
                "Save Image"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
