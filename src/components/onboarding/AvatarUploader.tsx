"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setPreview(result);
        onChange(result);
      };
      reader.onerror = () => {
        onError?.("Failed to read image file");
      };
      reader.readAsDataURL(file);
    },
    [onChange, onError]
  );

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
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

  useEffect(() => {
    setPreview(value || null);
  }, [value]);

  const getInitials = () => {
    return "U";
  };

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
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
        <Avatar className="size-24 border-2 border-border">
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
        {preview && (
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute -top-2 -right-2 size-6 rounded-full"
            onClick={handleRemove}
          >
            <X className="size-3" />
          </Button>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 rounded-full transition-opacity">
          <Upload className="size-6 text-white" />
        </div>
      </div>

      <div className="flex flex-col items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleClick}
          className="w-full"
        >
          <Upload className="size-4" />
          {preview ? "Change Avatar" : "Upload Avatar"}
        </Button>
        <p className="text-xs text-muted-foreground text-center">
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
  );
}
