import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { 
  Package, 
  Search, 
  Upload, 
  X, 
  Check, 
  Edit3, 
  Trash2, 
  Plus, 
  Image as ImageIcon,
  Tag
} from 'lucide-react';
import {
  fetchAdminProductsAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI,
} from '../../services/api';
import { uploadToCloudinary } from '../../utils/cloudinary';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    category: 'Coffee', 
    description: '', 
    image: '' 
  });
  const [submitting, setSubmitting] = useState(false);

  // Cloudinary Frontend Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await fetchAdminProductsAPI();
      setProducts(Array.isArray(data) ? data : data?.products || []);
    } catch (err) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const getCategoryName = (category) => {
    if (!category) return 'Uncategorized';
    if (typeof category === 'object') {
      return category.name || 'Uncategorized';
    }
    return String(category);
  };

  // Live image preview handler
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // Upload image file directly to Cloudinary
  const handleCloudinaryUpload = async () => {
    if (!selectedFile) return;
    try {
      setUploadingImage(true);
      const uploadedUrl = await uploadToCloudinary(selectedFile);
      setFormData((prev) => ({ ...prev, image: uploadedUrl }));
      toast.success('Image uploaded to Cloudinary successfully!');
    } catch (err) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleEdit = (prod) => {
    setEditingId(prod._id);
    setFormData({
      name: prod.name || '',
      price: prod.price || '',
      category: typeof prod.category === 'object' ? prod.category.name : (prod.category || 'Coffee'),
      description: prod.description || '',
      image: prod.image || '',
    });
    setPreviewUrl(prod.image || '');
    setSelectedFile(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ name: '', price: '', category: 'Coffee', description: '', image: '' });
    setPreviewUrl('');
    setSelectedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = { ...formData, price: Number(formData.price) };
      if (editingId) {
        await updateProductAPI(editingId, payload);
        toast.success('Product updated successfully!');
      } else {
        await createProductAPI(payload);
        toast.success('Product created successfully!');
      }
      handleCancelEdit();
      await loadProducts();
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      await deleteProductAPI(id);
      toast.success('Product deleted.');
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      toast.error('Failed to delete product.');
    }
  };

  const filteredProducts = products.filter((p) => {
    const catName = getCategoryName(p.category).toLowerCase();
    const prodName = (p.name || '').toLowerCase();
    const query = searchTerm.toLowerCase();
    return prodName.includes(query) || catName.includes(query);
  });

  return (
    <div className="space-y-6">
      {/* Top Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-600">
              <Package className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Inventory & Products
            </h1>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Manage your store menu items, pricing, images, and category assignments.
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
          />
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Create / Edit Form Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Plus className="w-4 h-4 text-indigo-600" /> {editingId ? 'Edit Product' : 'Add New Item'}
            </h2>
            {editingId && (
              <span className="text-[10px] bg-amber-100 text-amber-800 px-2 py-0.5 rounded-md font-semibold border border-amber-200">
                Editing Mode
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Product Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 transition"
                placeholder="e.g. Spanish Latte"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Price (PKR)</label>
                <input
                  type="number"
                  required
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="850"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                >
                  <option value="Coffee">Coffee</option>
                  <option value="Tea">Tea</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Snacks">Snacks</option>
                </select>
              </div>
            </div>

            {/* Cloudinary Image Picker with JS Preview */}
            <div className="space-y-2">
              <label className="block font-semibold text-slate-700">Product Image (Cloudinary)</label>
              
              {!previewUrl ? (
                <label className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50 hover:bg-indigo-50/20 text-center">
                  <Upload className="w-6 h-6 text-slate-400 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-600">Select image file</span>
                  <span className="text-[9px] text-slate-400">PNG, JPG, WEBP up to 5MB</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="space-y-2">
                  <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl('');
                        setSelectedFile(null);
                        setFormData({ ...formData, image: '' });
                      }}
                      className="absolute top-2 right-2 p-1 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-slate-900/80 backdrop-blur-md rounded text-[9px] text-white font-medium">
                      Live Preview Active
                    </div>
                  </div>

                  {selectedFile && !formData.image.includes('cloudinary.com') && (
                    <button
                      type="button"
                      onClick={handleCloudinaryUpload}
                      disabled={uploadingImage}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
                    >
                      {uploadingImage ? 'Uploading to Cloudinary...' : 'Upload Selected File'}
                    </button>
                  )}
                </div>
              )}

              {/* Direct Image URL input backup */}
              <input
                type="text"
                value={formData.image}
                onChange={(e) => {
                  setFormData({ ...formData, image: e.target.value });
                  setPreviewUrl(e.target.value);
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-[11px] text-slate-800 focus:outline-none focus:border-indigo-500 transition"
                placeholder="Or paste image URL (Cloudinary / Unsplash)..."
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 transition resize-none"
                placeholder="Short item description..."
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl transition shadow-xs disabled:opacity-50"
              >
                {submitting ? 'Saving...' : editingId ? 'Update Product' : 'Add Product'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Product Table Panel */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading products database...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">No products found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Item Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Price</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => (
                    <tr key={p._id} className="hover:bg-slate-50/80 transition">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          {p.image ? (
                            <img 
                              src={p.image} 
                              alt={p.name} 
                              className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 flex-shrink-0" 
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 text-[10px]">
                              <ImageIcon className="w-4 h-4 text-slate-400" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 truncate">{p.name}</p>
                            <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                              {p.description || 'No description added'}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {getCategoryName(p.category)}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-indigo-600 whitespace-nowrap">
                        PKR {p.price}
                      </td>
                      <td className="p-4 text-right whitespace-nowrap space-x-1.5">
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg text-xs transition inline-flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(p._id)}
                          className="px-2.5 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-semibold rounded-lg text-xs transition inline-flex items-center gap-1"
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