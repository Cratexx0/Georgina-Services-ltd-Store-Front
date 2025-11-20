// utils/getImageUrl.ts
export const getImageUrl = (image?: string): string => {
  if (!image || !image.trim()) {
    return "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&h=500&fit=crop";
  }

  const clean = image.trim();

  // ✅ If it's already a Cloudinary URL — keep it
  if (clean.includes("cloudinary.com")) {
    return clean;
  }

  // ✅ If it's from your backend uploads but needs Cloudinary mapping
  if (clean.includes("georgina-server-code.onrender.com/uploads/products/")) {
    const filename = clean.split("/").pop();
    return `https://res.cloudinary.com/dy0lpwemp/image/upload/v1762654150/georgina-products/${filename}`;
  }

  // ✅ If it’s a relative upload (no host yet)
  if (clean.startsWith("uploads/products/")) {
    const filename = clean.split("/").pop();
    return `https://res.cloudinary.com/dy0lpwemp/image/upload/v1762654150/georgina-products/${filename}`;
  }

  // ✅ Otherwise, return as-is
  return clean;
};
