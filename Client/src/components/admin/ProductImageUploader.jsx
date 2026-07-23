import React, { useState } from 'react';
import { Upload, X, Check, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadToCloudinary } from '../../utils/cloudinary';

export default function ProductImageUploader({ onImageUploaded }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState('');

  // 1. Create temporary preview URL using JS FileReader / createObjectURL
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    // Generate instant preview URL from browser memory
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    setUploadedUrl('');
  };

  // 2. Upload to Cloudinary
  const handleUpload = async () => {
    if (!selectedFile) return;
    try {
      setUploading(true);
      const url = await uploadToCloudinary(selectedFile);
      setUploadedUrl(url);
      toast.success('Image uploaded to Cloudinary!');
      
      // Pass uploaded URL to parent component / backend form
      if (onImageUploaded) onImageUploaded(url);
    } catch (err) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPreviewUrl('');
    setUploadedUrl('');
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-4">
      <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
        <ImageIcon className="w-4 h-4 text-indigo-600" /> Product Image Upload
      </h4>

      {/* File Drop / Select Area */}
      {!previewUrl ? (
        <label className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50/50 hover:bg-indigo-50/30">
          <Upload className="w-8 h-8 text-slate-400 mb-2" />
          <span className="text-xs font-semibold text-slate-600">Click to select image</span>
          <span className="text-[10px] text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</span>
          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
        </label>
      ) : (
        <div className="space-y-3">
          {/* Live Preview Container */}
          <div className="relative w-full h-48 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 p-1.5 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition"
              title="Remove"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 px-2.5 py-1 bg-slate-900/80 backdrop-blur-md rounded-md text-[10px] text-white font-medium">
              JS Preview Active
            </div>
          </div>

          {/* Action Button */}
          {!uploadedUrl ? (
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {uploading ? 'Uploading to Cloudinary...' : 'Upload to Cloudinary'}
            </button>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-xs text-emerald-700 font-semibold">
              <Check className="w-4 h-4 text-emerald-600" /> URL Ready for Backend: 
              <span className="font-mono text-[10px] text-emerald-900 truncate">{uploadedUrl}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}