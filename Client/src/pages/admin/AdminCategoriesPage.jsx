import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { 
  FolderTree, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Upload, 
  X, 
  Image as ImageIcon 
} from 'lucide-react';
import {
  fetchCategoriesAPI,
  createCategoryAPI,
  updateCategoryAPI,
  deleteCategoryAPI,
} from '../../services/api';
import { uploadToCloudinary } from '../../utils/cloudinary';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Cloudinary Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await fetchCategoriesAPI();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error('Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // Image File selection live preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleCloudinaryUpload = async () => {
    if (!selectedFile) return;
    try {
      setUploadingImage(true);
      const uploadedUrl = await uploadToCloudinary(selectedFile);
      setFormData((prev) => ({ ...prev, image: uploadedUrl }));
      setPreviewUrl('');
      setSelectedFile(null);
      toast.success('Category image uploaded!');
    } catch (err) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name || '',
      description: cat.description || '',
      image: cat.image || '',
    });
    setPreviewUrl('');
    setSelectedFile(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', description: '', image: '' });
    setPreviewUrl('');
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (editingId) {
        await updateCategoryAPI(editingId, formData);
        toast.success('Category updated successfully!');
      } else {
        await createCategoryAPI(formData);
        toast.success('Category created successfully!');
      }
      handleCancelEdit();
      await loadCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await deleteCategoryAPI(id);
      toast.success('Category deleted successfully.');
      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      toast.error('Failed to delete category.');
    }
  };

  const filteredCategories = categories.filter((c) =>
    (c.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
              <FolderTree className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Categories Management
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Create, edit, and organize product categories.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" />
              {editingId ? 'Edit Category' : 'Add Category'}
            </h2>
            {editingId && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-semibold">
                Editing Mode
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 transition"
                placeholder="e.g. Cold Brews"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 transition resize-none"
                placeholder="Brief category summary..."
              />
            </div>

            {/* Image Selector */}
            <div className="space-y-2">
              <label className="block font-semibold text-slate-700">Category Image</label>

              {!previewUrl && !formData.image ? (
                <label className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-600">Select Image</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : previewUrl ? (
                <div className="space-y-2">
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl('');
                        setSelectedFile(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-slate-900/70 text-white rounded-full"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={handleCloudinaryUpload}
                    disabled={uploadingImage}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload Image'}
                  </button>
                </div>
              ) : (
                <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200">
                  <img src={formData.image} alt="Uploaded" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, image: '' }))}
                    className="absolute top-2 right-2 p-1 bg-rose-600 text-white rounded-full"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editingId ? 'Update Category' : 'Create Category'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3.5 py-2.5 bg-slate-100 text-slate-700 font-semibold rounded-xl"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Categories Table */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading categories...</div>
          ) : filteredCategories.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">No categories found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Category</th>
                    <th className="p-4">Slug</th>
                    <th className="p-4">Description</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredCategories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-slate-50 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {cat.image ? (
                            <img src={cat.image} alt={cat.name} className="w-9 h-9 rounded-lg object-cover border border-slate-200" />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                              <ImageIcon className="w-4 h-4" />
                            </div>
                          )}
                          <span className="font-bold text-slate-900">{cat.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-500 font-mono text-[11px]">{cat.slug}</td>
                      <td className="p-4 text-slate-500 max-w-xs truncate">{cat.description || '—'}</td>
                      <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => handleEdit(cat)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg transition inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(cat._id)}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-lg transition inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}