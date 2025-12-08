import { useState } from "react";
import { apiClientUser } from "@/lib/interceptor";
import { toast } from "sonner";
import { UploadedImage } from "../types";

export const useImageUpload = () => {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadingImage, setUploadingImage] = useState(false);

  const uploadImage = async (file: File) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("fileType", "Profile-pics");
    const res = await apiClientUser.post("/users/upload", fd, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res?.data?.fileUrl || res?.data?.data?.fileUrl;
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    // Defer upload until submit; create preview URLs now
    const staged: UploadedImage[] = [];
    for (const file of Array.from(files)) {
      const preview = URL.createObjectURL(file);
      staged.push({ url: preview, file });
    }
    setUploadedImages((prev) => {
      const merged = [...prev, ...staged];
      if (!merged.some((i) => i.isPrimary) && merged.length > 0)
        merged[0].isPrimary = true;
      return merged;
    });
    toast.success("Image(s) added. They will upload on submit.");
  };

  const setPrimaryImage = (index: number) => {
    setUploadedImages((prev) =>
      prev.map((img, i) => ({ ...img, isPrimary: i === index }))
    );
  };

  const removeImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const updateAltText = (index: number, value: string) => {
    setUploadedImages((prev) =>
      prev.map((img, i) => (i === index ? { ...img, altText: value } : img))
    );
  };

  const uploadAllImages = async () => {
    if (uploadingImage) return;

    const uploadingToastId = toast.loading("Uploading images...");
    setUploadingImage(true);

    try {
      const finalImages: Array<{
        url: string;
        altText?: string;
        isPrimary?: boolean;
      }> = [];

      for (const img of uploadedImages) {
        if (img.file) {
          const realUrl = await uploadImage(img.file);
          finalImages.push({
            url: realUrl,
            altText: img.altText || "",
            isPrimary: Boolean(img.isPrimary),
          });
        } else {
          // If already has a real url (previously uploaded), keep it
          finalImages.push({
            url: img.url,
            altText: img.altText || "",
            isPrimary: Boolean(img.isPrimary),
          });
        }
      }

      // Ensure one primary is set
      if (!finalImages.some((i) => i.isPrimary)) {
        finalImages[0].isPrimary = true;
      }

      return finalImages;
    } finally {
      setUploadingImage(false);
      toast.dismiss(uploadingToastId);
    }
  };

  return {
    uploadedImages,
    uploadingImage,
    handleFilesSelected,
    setPrimaryImage,
    removeImage,
    updateAltText,
    uploadAllImages,
  };
};
