export async function getCroppedImg(
  imageSrc: string,
  cropPixels: { x: number; y: number; width: number; height: number },
  rotationDegrees: number = 0
): Promise<string> {
  const image: HTMLImageElement = await new Promise((resolve, reject) => {
    const img = new Image();
    img.src = imageSrc;
    img.onload = () => resolve(img);
    img.onerror = (err) => reject(err);
  });

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) throw new Error("Could not get canvas context");

  // Convert rotation to radians
  const rotation = (rotationDegrees * Math.PI) / 180;

  // Create an intermediate canvas to apply rotation, then crop from it
  const safeArea = Math.max(image.width, image.height) * 2;
  const tempCanvas = document.createElement("canvas");
  const tempCtx = tempCanvas.getContext("2d");
  if (!tempCtx) throw new Error("Could not get temp canvas context");

  tempCanvas.width = safeArea;
  tempCanvas.height = safeArea;

  tempCtx.translate(safeArea / 2, safeArea / 2);
  tempCtx.rotate(rotation);
  tempCtx.translate(-image.width / 2, -image.height / 2);
  tempCtx.drawImage(image, 0, 0);

  // Because we centered the image in a larger safeArea, the image's top-left
  // is offset from (0,0) by these values. Apply these offsets so that the
  // pixel crop returned by react-easy-crop maps correctly into the temp canvas.
  const offsetX = Math.floor((safeArea - image.width) / 2);
  const offsetY = Math.floor((safeArea - image.height) / 2);

  const cropX = Math.max(0, Math.floor(cropPixels.x + offsetX));
  const cropY = Math.max(0, Math.floor(cropPixels.y + offsetY));
  const cropWidth = Math.max(1, Math.floor(cropPixels.width));
  const cropHeight = Math.max(1, Math.floor(cropPixels.height));

  canvas.width = cropWidth;
  canvas.height = cropHeight;

  ctx.drawImage(
    tempCanvas,
    cropX,
    cropY,
    cropWidth,
    cropHeight,
    0,
    0,
    cropWidth,
    cropHeight
  );

  return new Promise<string>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return;
      const fileUrl = URL.createObjectURL(blob);
      resolve(fileUrl);
    }, "image/jpeg");
  });
}
