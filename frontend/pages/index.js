import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductDisplay from '../components/ProductDisplay';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    imageUrl: '',
    imageFile: null,
    imageSource: 'url',
    price: '',
    quantity: '',
    unit: 'pcs',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [previewProduct, setPreviewProduct] = useState(null);

  const apiUrl = 'http://localhost:5000/api/products';

  const fetchProducts = async () => {
    const res = await axios.get(apiUrl);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = e => {
    if (e.target.name === 'imageFile') {
      setForm({ ...form, imageFile: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setPreviewProduct({
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
      imageUrl: form.imageSource === 'file' && form.imageFile 
        ? URL.createObjectURL(form.imageFile) 
        : form.imageUrl
    });
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', Number(form.price));
    formData.append('quantity', Number(form.quantity));
    formData.append('unit', form.unit);
    formData.append('description', form.description);
    
    if (form.imageSource === 'file' && form.imageFile) {
      formData.append('image', form.imageFile);
    } else {
      formData.append('imageUrl', form.imageUrl);
    }

    try {
      if (editingId) {
        await axios.put(`${apiUrl}/${editingId}`, formData);
        setEditingId(null);
      } else {
        await axios.post(apiUrl, formData);
      }
      setForm({ name: '', imageUrl: '', imageFile: null, imageSource: 'url', price: '', quantity: '', unit: 'pcs', description: '' });
      setShowConfirm(false);
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = product => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      imageUrl: product.imageUrl,
      imageFile: null,
      imageSource: 'url',
      price: product.price,
      quantity: product.quantity,
      unit: product.unit,
      description: product.description,
    });
  };

  const handleDelete = async id => {
    await axios.delete(`${apiUrl}/${id}`);
    fetchProducts();
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-extrabold text-center text-blue-800 mb-8">
        Product Management
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Add New Product Form */}
        <div className="form-container bg-white p-6 rounded-xl shadow-lg">
          <form onSubmit={handleSubmit} className="product-form space-y-6">
            <h2 className="text-2xl font-bold text-blue-700">
              {editingId ? 'Edit Product' : 'Add New Product'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="form-label" htmlFor="name">Product Name</label>
                <input
                  type="text"
                  name="name"
                  id="name"
                  placeholder="Product Name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label" htmlFor="imageSource">Image Source</label>
                <select
                  name="imageSource"
                  id="imageSource"
                  value={form.imageSource}
                  onChange={handleChange}
                  className="form-dropdown"
                >
                  <option value="url">URL</option>
                  <option value="file">Upload File</option>
                </select>
              </div>
              {form.imageSource === 'url' ? (
                <div>
                  <label className="form-label" htmlFor="imageUrl">Image URL</label>
                  <input
                    type="url"
                    name="imageUrl"
                    id="imageUrl"
                    placeholder="Image URL"
                    value={form.imageUrl}
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              ) : (
                <div>
                  <label className="form-label" htmlFor="imageFile">Upload Image</label>
                  <input
                    type="file"
                    name="imageFile"
                    id="imageFile"
                    accept="image/*"
                    onChange={handleChange}
                    className="form-input"
                  />
                </div>
              )}
              <div>
                <label className="form-label" htmlFor="price">Price (Rs.)</label>
                <input
                  type="number"
                  name="price"
                  id="price"
                  placeholder="Price in Rs."
                  value={form.price}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label" htmlFor="quantity">Quantity</label>
                <input
                  type="number"
                  name="quantity"
                  id="quantity"
                  placeholder="Quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
              <div>
                <label className="form-label" htmlFor="unit">Unit</label>
                <select
                  name="unit"
                  id="unit"
                  value={form.unit}
                  onChange={handleChange}
                  className="form-dropdown"
                >
                  <option value="pcs">pcs</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>
            <div>
              <label className="form-label" htmlFor="description">Description</label>
              <textarea
                name="description"
                id="description"
                placeholder="Description"
                value={form.description}
                onChange={handleChange}
                className="form-input"
                rows={3}
              />
            </div>
            <div className="flex space-x-4">
              <button
                type="submit"
                className="form-button bg-blue-600 hover:bg-blue-700"
              >
                {editingId ? 'Update Product' : 'Create Product'}
              </button>
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setForm({ name: '', imageUrl: '', imageFile: null, imageSource: 'url', price: '', quantity: '', unit: 'pcs', description: '' });
                  }}
                  className="form-cancel bg-gray-600 hover:bg-gray-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Right Column: Product List Container */}
        <div className="product-list-container bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-blue-700 mb-4">Product List</h2>
          <ProductDisplay
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {showConfirm && previewProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl max-w-md w-full transform transition-all duration-300 scale-100 hover:scale-105">
            <h2 className="text-xl font-bold text-blue-700 mb-4">Confirm Product</h2>
            <ProductCard product={previewProduct} />
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setShowConfirm(false)}
                className="form-button bg-gray-600 hover:bg-gray-700"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setForm({ name: '', imageUrl: '', imageFile: null, imageSource: 'url', price: '', quantity: '', unit: 'pcs', description: '' });
                  setShowConfirm(false);
                }}
                className="form-button bg-red-600 hover:bg-red-700"
              >
                Reset
              </button>
              <button
                onClick={handleConfirm}
                className="form-button bg-green-600 hover:bg-green-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}