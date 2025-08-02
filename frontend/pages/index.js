import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    imageUrl: '',
    price: '',
    quantity: '',
    unit: 'pcs',
    description: ''
  });
  const [editingId, setEditingId] = useState(null);

  const apiUrl = 'http://localhost:5000/api/products';

  const fetchProducts = async () => {
    const res = await axios.get(apiUrl);
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      quantity: Number(form.quantity),
    };
    if (editingId) {
      await axios.put(`${apiUrl}/${editingId}`, payload);
      setEditingId(null);
    } else {
      await axios.post(apiUrl, payload);
    }
    setForm({ name: '', imageUrl: '', price: '', quantity: '', unit: 'pcs', description: '' });
    fetchProducts();
  };

  const handleEdit = product => {
    setEditingId(product._id);
    setForm({
      name: product.name,
      imageUrl: product.imageUrl,
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
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Product Management</h1>

      <div className="space-y-4">
        {products.map(product => (
          <ProductCard
            key={product._id}
            product={product}
            onEdit={() => handleEdit(product)}
            onDelete={() => handleDelete(product._id)}
          />
        ))}
      </div>

      <form onSubmit={handleSubmit} className="product-form mt-8">
        <h2 className="text-2xl font-bold text-blue-700 mb-4">
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
        <div className="mt-4">
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
        <div className="flex space-x-4 mt-6">
          <button
            type="submit"
            className="form-button"
          >
            {editingId ? 'Update Product' : 'Create Product'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                setForm({ name: '', imageUrl: '', price: '', quantity: '', unit: 'pcs', description: '' });
              }}
              className="form-cancel"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
