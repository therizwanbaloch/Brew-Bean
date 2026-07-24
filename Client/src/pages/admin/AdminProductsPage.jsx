import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { 
  Package, 
  Search, 
  Upload, 
  X, 
  Edit3, 
  Trash2, 
  Plus, 
  Image as ImageIcon,
  Clock,
  Boxes,
  Star
} from 'lucide-react';
import {
  fetchAdminProductsAPI,
  createProductAPI,
  updateProductAPI,
  deleteProductAPI,
  fetchCategoriesAPI,
} from '../../services/api';
import { uploadToCloudinary } from '../../utils/cloudinary';

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Form State aligned with backend model
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ 
    name: '', 
    category: '', 
    description: '', 
    images: [],
    sizes: [{ name: 'Regular', price: '' }],
    stock: 20,
    preparationTime: 10,
    featured: false,
  });
  const [submitting, setSubmitting] = useState(false);

  // Cloudinary Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [prodData, catData] = await Promise.all([
        fetchAdminProductsAPI(),
        fetchCategoriesAPI()
      ]);
      
      const categoryList = Array.isArray(catData) ? catData : [];
      setCategories(categoryList);
      
      const loadedProducts = Array.isArray(prodData) ? prodData : prodData?.products || [];
      setProducts(loadedProducts);

      if (categoryList.length > 0 && !formData.category) {
        setFormData((prev) => ({ ...prev, category: categoryList[0]._id }));
      }
    } catch (err) {
      toast.error('Failed to load products or categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const getCategoryName = (category) => {
    if (!category) return 'Uncategorized';
    if (typeof category === 'object') return category.name || 'Uncategorized';
    const match = categories.find((c) => c._id === category);
    return match ? match.name : 'Uncategorized';
  };

  // --- SIZE VARIANT HANDLERS ---
  const handleSizeChange = (index, field, value) => {
    const updatedSizes = [...formData.sizes];
    updatedSizes[index][field] = value;
    setFormData((prev) => ({ ...prev, sizes: updatedSizes }));
  };

  const addSizeOption = () => {
    setFormData((prev) => ({
      ...prev,
      sizes: [...prev.sizes, { name: '', price: '' }]
    }));
  };

  const removeSizeOption = (index) => {
    if (formData.sizes.length <= 1) {
      toast.error('Product must have at least one size & price option.');
      return;
    }
    const updatedSizes = formData.sizes.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, sizes: updatedSizes }));
  };

  // --- IMAGE & CLOUDINARY HANDLERS ---
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleCloudinaryUpload = async () => {
    if (!selectedFile) return;
    try {
      setUploadingImage(true);
      const uploadedUrl = await uploadToCloudinary(selectedFile);
      
      setFormData((prev) => ({
        ...prev,
        images: [uploadedUrl, ...prev.images]
      }));
      setPreviewUrl('');
      setSelectedFile(null);
      toast.success('Image uploaded & added!');
    } catch (err) {
      toast.error(err.message || 'Image upload failed');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, idx) => idx !== indexToRemove)
    }));
  };

  // --- EDIT & CANCEL ---
  const handleEdit = (prod) => {
    setEditingId(prod._id);
    const catVal = typeof prod.category === 'object' ? prod.category._id : prod.category;
    
    // Process existing sizes array or build from fallback
    let sizeList = Array.isArray(prod.sizes) && prod.sizes.length > 0 
      ? prod.sizes.map((s) => ({ name: s.name || 'Regular', price: s.price ?? '' }))
      : [{ name: 'Regular', price: prod.price || '' }];

    // Process existing images array or single image fallback
    let imageList = Array.isArray(prod.images) && prod.images.length > 0 
      ? prod.images 
      : (prod.image ? [prod.image] : []);

    setFormData({
      name: prod.name || '',
      category: catVal || (categories[0]?._id || ''),
      description: prod.description || '',
      images: imageList,
      sizes: sizeList,
      stock: prod.stock ?? 20,
      preparationTime: prod.preparationTime ?? 10,
      featured: Boolean(prod.featured),
    });
    setPreviewUrl('');
    setSelectedFile(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ 
      name: '', 
      category: categories[0]?._id || '', 
      description: '', 
      images: [],
      sizes: [{ name: 'Regular', price: '' }],
      stock: 20,
      preparationTime: 10,
      featured: false,
    });
    setPreviewUrl('');
    setSelectedFile(null);
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.name.trim()) return toast.error('Product name is required.');
    if (!formData.category) return toast.error('Please select a category.');

    const formattedSizes = formData.sizes.map((s) => ({
      name: s.name.trim() || 'Standard',
      price: Number(s.price) || 0
    }));

    if (formattedSizes.some((s) => s.price <= 0)) {
      return toast.error('Please enter a valid price for all sizes.');
    }

    setSubmitting(true);

    try {
      const payload = {
        name: formData.name,
        category: formData.category,
        description: formData.description,
        sizes: formattedSizes,
        images: formData.images,
        stock: Number(formData.stock),
        preparationTime: Number(formData.preparationTime),
        featured: formData.featured,
        isAvailable: true
      };

      if (editingId) {
        await updateProductAPI(editingId, payload);
        toast.success('Product updated successfully!');
      } else {
        await createProductAPI(payload);
        toast.success('Product created successfully!');
      }

      handleCancelEdit();
      await loadData();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
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
            Manage your store menu, pricing tiers, size options, and image galleries.
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
        
        {/* Form Panel */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
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
            {/* Name */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Product Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 transition"
                placeholder="e.g. Spanish Latte"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 transition cursor-pointer"
              >
                <option value="" disabled>Select category</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Dynamic Sizes & Prices */}
            <div className="space-y-2 border-t border-b border-slate-100 py-3">
              <div className="flex items-center justify-between">
                <label className="block font-semibold text-slate-700">Size & Pricing Options *</label>
                <button
                  type="button"
                  onClick={addSizeOption}
                  className="text-[11px] text-indigo-600 hover:text-indigo-700 font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Add Size
                </button>
              </div>

              {formData.sizes.map((sizeObj, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    type="text"
                    required
                    placeholder="Size (e.g., Small, 250ml)"
                    value={sizeObj.name}
                    onChange={(e) => handleSizeChange(idx, 'name', e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-indigo-500 transition text-xs"
                  />
                  <input
                    type="number"
                    required
                    placeholder="PKR"
                    value={sizeObj.price}
                    onChange={(e) => handleSizeChange(idx, 'price', e.target.value)}
                    className="w-24 bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-800 focus:outline-none focus:border-indigo-500 transition text-xs"
                  />
                  {formData.sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSizeOption(idx)}
                      className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-lg transition"
                      title="Remove size"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Stock & Prep Time */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Boxes className="w-3.5 h-3.5 text-slate-500" /> Stock Quantity
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="20"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-slate-500" /> Prep Time (mins)
                </label>
                <input
                  type="number"
                  min="1"
                  value={formData.preparationTime}
                  onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 transition"
                  placeholder="10"
                />
              </div>
            </div>

            {/* Featured Checkbox */}
            <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
              <input
                type="checkbox"
                id="featuredToggle"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
              />
              <label htmlFor="featuredToggle" className="font-semibold text-slate-700 cursor-pointer flex items-center gap-1">
                <Star className={`w-3.5 h-3.5 ${formData.featured ? 'text-amber-500 fill-amber-500' : 'text-slate-400'}`} /> Feature on Homepage
              </label>
            </div>

            {/* Image Gallery & Upload */}
            <div className="space-y-2">
              <label className="block font-semibold text-slate-700">Product Images</label>

              {/* Upload Drop Zone / Preview */}
              {!previewUrl ? (
                <label className="border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-xl p-3 flex flex-col items-center justify-center cursor-pointer transition bg-slate-50 hover:bg-indigo-50/20 text-center">
                  <Upload className="w-5 h-5 text-slate-400 mb-1" />
                  <span className="text-[11px] font-semibold text-slate-600">Upload to Cloudinary</span>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                </label>
              ) : (
                <div className="space-y-2">
                  <div className="relative w-full h-32 rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
                    <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl('');
                        setSelectedFile(null);
                      }}
                      className="absolute top-2 right-2 p-1 bg-slate-900/70 hover:bg-slate-900 text-white rounded-full transition"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {selectedFile && (
                    <button
                      type="button"
                      onClick={handleCloudinaryUpload}
                      disabled={uploadingImage}
                      className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold transition disabled:opacity-50"
                    >
                      {uploadingImage ? 'Uploading...' : 'Confirm Cloudinary Upload'}
                    </button>
                  )}
                </div>
              )}

              {/* Render Existing Gallery */}
              {formData.images.length > 0 && (
                <div className="flex flex-wrap gap-2 pt-2">
                  {formData.images.map((imgUrl, i) => (
                    <div key={i} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200 group">
                      <img src={imgUrl} alt={`Product ${i}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description</label>
              <textarea
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-none focus:border-indigo-500 transition resize-none"
                placeholder="Rich taste profile or ingredients..."
              />
            </div>

            {/* Form Actions */}
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
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-xs">Loading inventory database...</div>
          ) : filteredProducts.length === 0 ? (
            <div className="p-12 text-center text-slate-400 text-xs">No products found.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-800">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="p-4">Item Details</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Pricing & Sizes</th>
                    <th className="p-4">Stock / Prep</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProducts.map((p) => {
                    const heroImage = p.images?.[0] || p.image;
                    const displaySizes = p.sizes && p.sizes.length > 0 ? p.sizes : [{ name: 'Standard', price: p.price }];

                    return (
                      <tr key={p._id} className="hover:bg-slate-50/80 transition">
                        {/* Details */}
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            {heroImage ? (
                              <img 
                                src={heroImage} 
                                alt={p.name} 
                                className="w-10 h-10 rounded-lg object-cover bg-slate-100 border border-slate-200 flex-shrink-0" 
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400">
                                <ImageIcon className="w-4 h-4 text-slate-400" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <p className="font-bold text-slate-900 truncate flex items-center gap-1.5">
                                {p.name}
                                {p.featured && (
                                  <Star className="w-3 h-3 text-amber-500 fill-amber-500 flex-shrink-0" title="Featured" />
                                )}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate max-w-xs mt-0.5">
                                {p.description || 'No description added'}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="p-4 whitespace-nowrap">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                            {getCategoryName(p.category)}
                          </span>
                        </td>

                        {/* Prices & Sizes */}
                        <td className="p-4 whitespace-nowrap">
                          <div className="space-y-1">
                            {displaySizes.map((s, idx) => (
                              <div key={idx} className="text-[11px]">
                                <span className="text-slate-500 font-medium">{s.name}:</span>{' '}
                                <span className="font-bold text-indigo-600">PKR {s.price}</span>
                              </div>
                            ))}
                          </div>
                        </td>

                        {/* Stock & Prep */}
                        <td className="p-4 whitespace-nowrap text-slate-600 text-[11px]">
                          <div><span className="font-semibold text-slate-800">{p.stock ?? 0}</span> in stock</div>
                          <div className="text-slate-400">{p.preparationTime ?? 10} mins prep</div>
                        </td>

                        {/* Actions */}
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
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}