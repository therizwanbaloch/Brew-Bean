export const uploadToCloudinary = async (file) => {
  const cloudName = 'YOUR_CLOUDINARY_CLOUD_NAME'; // Replace with your cloud name
  const uploadPreset = 'YOUR_UPLOAD_PRESET';      // Replace with your unsigned preset

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    throw new Error('Failed to upload image to Cloudinary');
  }

  const data = await res.json();
  return data.secure_url; // Returns the uploaded image URL from Cloudinary
};