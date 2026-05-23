import React, { useState, useEffect, useCallback } from 'react';
import {
  Store, Plus, Edit2, Trash2, Eye, Search, Filter, X,
  CheckCircle, AlertCircle, ShoppingBag, Tag, User,
  Phone, Package, DollarSign, TrendingUp, Clock, Download,
  Upload, RefreshCw, ChevronDown, ChevronRight, Image as ImageIcon
} from 'lucide-react';
import CoreService from '@/app/hooks/core-service';

const service = new CoreService();

// Product schema based on your requirement
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  sellerName: string;
  sellerPhone: string;
  stock: number;
  image?: string;
  category?: string;
  createdAt: string;
  updatedAt: string;
  status: 'published' | 'draft' | 'out_of_stock';
  soldCount?: number;
  rating?: number;
}


const categories = ['All', 'Footwear', 'Bags', 'Electronics', 'Clothing', 'Accessories', 'Books'];

const ManageMarketplace:React.FC = () =>  {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'out_of_stock'>('all');
  const [toast, setToast] = useState<{ show: boolean; message: string; type: 'success' | 'error' }>({ show: false, message: '', type: 'success' });
  const [isLoading, setIsLoading] = useState(false);
  const [fetchAmount, setFetchAmount] = useState({
    take: 10,
    skip: 0
  });

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    sellerName: '',
    sellerPhone: '',
    stock: 0,
    category: '',
    status: 'published' as 'published' | 'draft'
  });
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const fetchProducts = useCallback(async (take: number, skip: number) => {
    setIsLoading(true);
    try {
      const res = await service.get(`marketplace/find-all-products?take=${take}&skip=${skip}`);
      if (res.success) {
        if (skip === 0) {
          setProducts(res.data || []);
        } else {
          setProducts(prev => [...prev, ...(res.data || [])]);
        }
      }
    } catch (error) {
      showToast('Failed to fetch products', 'error');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { fetchProducts(fetchAmount.take, fetchAmount.skip); }, [fetchAmount, fetchProducts]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', minimumFractionDigits: 0 }).format(price);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        sellerName: product.sellerName,
        sellerPhone: product.sellerPhone,
        stock: product.stock,
        category: product.category || '',
        status: product.status === 'published' ? 'published' : 'draft'
      });
      setImagePreview(product.image || '');
      setSelectedImage(null);
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        sellerName: '',
        sellerPhone: '',
        stock: 0,
        category: '',
        status: 'published'
      });
      setImagePreview('');
      setSelectedImage(null);
    }
    setIsModalOpen(true);
  };

  const findOneProduct = async (id: string) => {
    setIsLoading(true);
    try {
      const res = await service.get(`marketplace/find-one-product/${id}`);
      if (res.success && res.data) {
        // If product exists, update or add to list
        setProducts(prev => {
          const exists = prev.find(p => p.id === res.data.id);
          if (exists) return prev.map(p => p.id === res.data.id ? res.data : p);
          return [res.data, ...prev];
        });
      }
    } catch (error) {
      showToast('Product not found', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.description || !formData.price || !formData.sellerName || !formData.sellerPhone) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    const numericPrice = Number(formData.price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      showToast('Price must be a valid number greater than 0', 'error');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: Math.floor(numericPrice),
        sellerName: formData.sellerName,
        sellerPhone: formData.sellerPhone,
        stock: Number(formData.stock),
      };

      if (editingProduct) {
        const updateRes = await service.patch(`marketplace/update-product/${editingProduct.id}`, payload);

        if (updateRes.success) {
          if (selectedImage) {
            const uploadResult = await service.upload(
              `marketplace/update-product/${editingProduct.id}`,
              { file: selectedImage },
              "PATCH"
            );
            if (!uploadResult.success) {
              showToast(`Product updated but image upload failed: ${uploadResult.message}`, 'error');
            } else {
              showToast('Product and image updated successfully', 'success');
            }
          } else {
            showToast('Product updated successfully', 'success');
          }

          setProducts(products.map(p => p.id === editingProduct.id ? {
            ...p,
            ...payload,
            image: imagePreview || p.image,
            updatedAt: new Date().toISOString()
          } : p));
          handleCloseModal();
        } else {
          showToast(updateRes.message || 'Failed to update product', 'error');
        }
      } else {
        const createRes = await service.send('marketplace/create-product', payload);

        if (createRes.success) {
          if (selectedImage) {
            const productId = createRes.data.id;
            const uploadRes = await service.upload(`marketplace/update-product/${productId}`, { file: selectedImage },"PATCH");
            if (!uploadRes.success) {
              showToast('Product created but image upload failed', 'error');
            }
          }

          // Refresh local state (Mocking the new item based on API response structure)
          const newProduct: Product = {
            id: createRes.data.id.toString(),
            name: createRes.data.name,
            description: createRes.data.description,
            price: Math.floor(createRes.data.price),
            sellerName: createRes.data.sellerName,
            sellerPhone: createRes.data.sellerPhone,
            stock: createRes.data.stock,
            image: imagePreview || '',
            createdAt: createRes.data.createdAt,
            updatedAt: createRes.data.createdAt,
            status: 'published'
          };
          setProducts([newProduct, ...products]);
          showToast('Product added successfully', 'success');
          handleCloseModal();
        } else {
          showToast(createRes.message || 'Failed to create product', 'error');
        }
      }
    } catch (error) {
      showToast('An error occurred while saving', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (confirm('Are you sure you want to delete this product?')) {
      try {
        const res = await service.delete(`marketplace/delete-product/${id}`);
        if (res.success) {
          setProducts(products.filter(product => product.id !== id));
          showToast('Product deleted successfully', 'success');
        } else {
          showToast(res.message || 'Failed to delete product', 'error');
        }
      } catch (error) {
        showToast('An error occurred while deleting', 'error');
      }
    }
  };

  const handleUpdateStock = (id: string, newStock: number) => {
    setProducts(products.map(product =>
      product.id === id
        ? {
            ...product,
            stock: newStock,
            status: newStock === 0 ? 'out_of_stock' : product.status,
            updatedAt: new Date().toISOString()
          }
        : product
    ));
    showToast(`Stock updated to ${newStock}`, 'success');
  };

  const getStatusBadge = (status: string, stock: number) => {
    if (stock === 0) {
      return <span className="px-2.5 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-medium">Out of Stock</span>;
    }
    switch (status) {
      case 'published':
        return <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-medium">Published</span>;
      case 'draft':
        return <span className="px-2.5 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-medium">Draft</span>;
      default:
        return <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg text-xs font-medium">Unknown</span>;
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sellerName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesStatus = statusFilter === 'all' || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalProducts = products.length;
  const totalValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const totalSold = products.reduce((sum, p) => sum + (p.soldCount || 0), 0);
  const lowStockItems = products.filter(p => p.stock > 0 && p.stock <= 3).length;

  return (
    <div className="min-h-screen bg-linear-to-br from-emerald-50 via-white to-teal-50">
      {/* Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-right-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-lg ${
            toast.type === 'success' ? 'bg-emerald-900 text-white' : 'bg-red-600 text-white'
          }`}>
            {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
            <span className="text-sm font-medium">{toast.message}</span>
          </div>
        </div>
      )}

      {/* View Product Modal */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <Eye size="18" className="text-emerald-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-emerald-900">{viewingProduct.name}</h2>
                  <p className="text-sm text-gray-500">Product Details</p>
                </div>
              </div>
              <button onClick={() => setViewingProduct(null)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size="20" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Product Image */}
              {viewingProduct.image && (
                <div className="flex justify-center">
                  <img src={viewingProduct.image} alt={viewingProduct.name} className="w-48 h-48 object-cover rounded-xl shadow-md" />
                </div>
              )}
              
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Price</p>
                  <p className="text-2xl font-bold text-emerald-600">{formatPrice(viewingProduct.price)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Stock</p>
                  <p className={`text-xl font-semibold ${viewingProduct.stock === 0 ? 'text-red-600' : viewingProduct.stock <= 3 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {viewingProduct.stock} units
                  </p>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">Description</p>
                <p className="text-gray-700 leading-relaxed">{viewingProduct.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Seller</p>
                  <div className="flex items-center gap-2">
                    <User size="14" className="text-gray-400" />
                    <span className="text-gray-800">{viewingProduct.sellerName}</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Contact</p>
                  <div className="flex items-center gap-2">
                    <Phone size="14" className="text-gray-400" />
                    <span className="text-gray-800">{viewingProduct.sellerPhone}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Category</p>
                  <span className="px-2.5 py-1 bg-gray-100 rounded-lg text-xs">{viewingProduct.category || 'Uncategorized'}</span>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Status</p>
                  {getStatusBadge(viewingProduct.status, viewingProduct.stock)}
                </div>
              </div>

              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-xs text-gray-500">Total Sold</p>
                    <p className="text-lg font-semibold text-emerald-600">{viewingProduct.soldCount || 0}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Rating</p>
                    <p className="text-lg font-semibold text-amber-600">{viewingProduct.rating || 0} ★</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                <button
                  onClick={() => {
                    setViewingProduct(null);
                    handleOpenModal(viewingProduct);
                  }}
                  className="px-5 py-2.5 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-700 transition-colors"
                >
                  Edit Product
                </button>
                <button
                  onClick={() => setViewingProduct(null)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-emerald-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <div className="w-11 h-11 bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] rounded-xl flex items-center justify-center shadow-lg">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-linear-to-r from-emerald-900 to-emerald-600 bg-clip-text text-transparent">
                  Marketplace Management
                </h1>
                <p className="text-sm text-emerald-600/70 mt-0.5">Manage products, inventory, and sellers</p>
              </div>
            </div>
            <button
              onClick={() => handleOpenModal()}
              className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white rounded-xl font-medium transition-all shadow-md hover:shadow-lg"
            >
              <Plus size="18" />
              Add Product
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-8">
          <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Total Products</p>
                <p className="text-3xl font-bold text-emerald-900 mt-1">{totalProducts}</p>
              </div>
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Package className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Inventory Value</p>
                <p className="text-2xl font-bold text-emerald-900 mt-1">{formatPrice(totalValue)}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Total Sold</p>
                <p className="text-3xl font-bold text-emerald-900 mt-1">{totalSold}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-emerald-100 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-emerald-600 font-medium">Low Stock Items</p>
                <p className={`text-3xl font-bold mt-1 ${lowStockItems > 0 ? 'text-amber-600' : 'text-emerald-900'}`}>{lowStockItems}</p>
              </div>
              <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl border border-emerald-100 p-5 mb-8 shadow-sm">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-50">
              <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1.5 block">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-400" />
                <input
                  type="text"
                  placeholder="Search by product or seller..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    if (e.target.value.length > 20) { // Assuming long string might be an ID
                      findOneProduct(e.target.value);
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent text-sm"
                />
              </div>
            </div>
            <div className="w-48">
              <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1.5 block">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div className="w-36">
              <label className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mb-1.5 block">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as any)}
                className="w-full px-4 py-2.5 bg-emerald-50/50 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 text-sm"
              >
                <option value="all">All</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
            {(selectedCategory !== 'All' || statusFilter !== 'all' || searchTerm) && (
              <button
                onClick={() => { setSelectedCategory('All'); setStatusFilter('all'); setSearchTerm(''); }}
                className="px-4 py-2.5 text-emerald-600 hover:text-emerald-700 text-sm font-medium"
              >
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Products Grid */}
        {isLoading && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin" />
            <p className="text-emerald-600 font-medium animate-pulse">
              Fetching marketplace inventory...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="group bg-white rounded-2xl border border-emerald-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Product Image */}
              <div className="relative h-48 bg-linear-to-br from-emerald-50 to-teal-50 overflow-hidden">
                {product.image ? (
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag size="48" className="text-emerald-300" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  {getStatusBadge(product.status, product.stock)}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-emerald-900 line-clamp-1">{product.name}</h3>
                    <p className="text-xs text-gray-500 mt-0.5">{product.category || 'Uncategorized'}</p>
                  </div>
                  <p className="text-lg font-bold text-emerald-600">{formatPrice(product.price)}</p>
                </div>

                <p className="text-sm text-gray-600 mt-2 line-clamp-2">{product.description}</p>

                {/* Seller Info */}
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-gray-500">
                      <User size="12" />
                      <span className="truncate max-w-25">{product.sellerName}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-500">
                      <Package size="12" />
                      <span className={product.stock === 0 ? 'text-red-600' : product.stock <= 3 ? 'text-amber-600' : 'text-emerald-600'}>
                        Stock: {product.stock}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => setViewingProduct(product)}
                    className="flex-1 py-2 text-emerald-600 bg-emerald-50 rounded-lg text-sm font-medium hover:bg-emerald-100 transition-colors flex items-center justify-center gap-1"
                  >
                    <Eye size="14" /> View
                  </button>
                  <button
                    onClick={() => handleOpenModal(product)}
                    className="p-2 text-amber-600 bg-amber-50 rounded-lg hover:bg-amber-100 transition-colors"
                  >
                    <Edit2 size="14" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(product.id)}
                    className="p-2 text-red-500 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                  >
                    <Trash2 size="14" />
                  </button>
                </div>

                {/* Quick Stock Update */}
                <div className="mt-2 flex items-center gap-2">
                  <button
                    onClick={() => handleUpdateStock(product.id, Math.max(0, product.stock - 1))}
                    className="w-7 h-7 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                    disabled={product.stock === 0}
                  >
                    -
                  </button>
                  <span className="text-sm font-medium text-gray-700 w-8 text-center">{product.stock}</span>
                  <button
                    onClick={() => handleUpdateStock(product.id, product.stock + 1)}
                    className="w-7 h-7 bg-gray-100 rounded-lg text-gray-600 hover:bg-gray-200 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {products.length > 0 && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setFetchAmount(prev => ({ ...prev, skip: prev.skip + prev.take }))}
              disabled={isLoading}
              className="flex items-center gap-2 px-8 py-3 bg-white border border-emerald-200 text-emerald-700 rounded-xl font-bold hover:bg-emerald-50 transition-all shadow-sm disabled:opacity-50"
            >
              {isLoading ? <RefreshCw size={18} className="animate-spin" /> : <RefreshCw size={18} />}
              Load More Products
            </button>
          </div>
        )}

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <Store className="w-16 h-16 text-emerald-200 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-500">No products found</h3>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search or add a new product</p>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="sticky top-0 bg-white border-b border-emerald-100 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-emerald-100 rounded-xl flex items-center justify-center">
                  {editingProduct ? <Edit2 size="18" className="text-emerald-600" /> : <Plus size="18" className="text-emerald-600" />}
                </div>
                <h2 className="text-xl font-bold text-emerald-900">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
              </div>
              <button onClick={handleCloseModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size="20" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Product Name */}
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Retro Canvas Sneakers"
                  className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  placeholder="Detailed product description..."
                  className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400 resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Price */}
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
                    Price (₦) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Stock */}
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
                    Stock Quantity <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Seller Name */}
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
                    Seller Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.sellerName}
                    onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                    placeholder="e.g., Nicholas Johnson"
                    className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>

                {/* Seller Phone */}
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-1.5">
                    Seller Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.sellerPhone}
                    onChange={(e) => setFormData({ ...formData, sellerPhone: e.target.value })}
                    placeholder="+234XXXXXXXXXX"
                    className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-1.5">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="">Select Category</option>
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-semibold text-emerald-800 mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'published' | 'draft' })}
                    className="w-full px-4 py-2.5 bg-emerald-50/40 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>
              </div>

              {/* Product Image Upload */}
              <div>
                <label className="block text-sm font-semibold text-emerald-800 mb-1.5">Product Image</label>
                <div className="border-2 border-dashed border-emerald-200 rounded-xl p-5 text-center hover:border-emerald-400 transition-colors cursor-pointer bg-emerald-50/20"
                  onClick={() => document.getElementById('imageInput')?.click()}
                >
                  <input
                    id="imageInput"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  {imagePreview ? (
                    <div className="flex flex-col items-center gap-3">
                      <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-lg shadow-md" />
                      <button
                        onClick={(e) => { e.stopPropagation(); setImagePreview(''); setSelectedImage(null); }}
                        className="text-sm text-red-500 hover:text-red-600"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <ImageIcon size="32" className="text-emerald-400" />
                      <span className="text-sm text-gray-500">Click or drag to upload product image</span>
                      <span className="text-xs text-gray-400">PNG, JPG, JPEG up to 2MB</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white border-t border-emerald-100 px-6 py-4 flex justify-end gap-3">
              <button
                onClick={handleCloseModal}
                className="px-5 py-2.5 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="px-6 py-2.5 bg-linear-to-br from-[#000000f7] via-[#0e2d3d] to-[#041414] text-white rounded-xl font-medium transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isLoading ? (
                  <>
                    <RefreshCw size="16" className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle size="16" />
                    {editingProduct ? 'Save Changes' : 'Add Product'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .animate-in {
          animation: fadeIn 0.2s ease-out;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .slide-in-from-right-5 {
          animation: slideInRight 0.3s ease-out;
        }
        .line-clamp-1 {
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}

export default ManageMarketplace;