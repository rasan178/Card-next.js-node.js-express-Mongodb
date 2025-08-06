import ProductCard from './ProductCard';

export default function ProductDisplay({ products, onEdit, onDelete }) {
  return (
    <div className="space-y-4">
      {products.map(product => (
        <div
          key={product._id}
          className="flex items-start justify-between p-4 border rounded-lg shadow-sm bg-white transform transition-all duration-200 hover:shadow-md"
        >
          <ProductCard product={product} />
          <div className="flex flex-col space-y-2 ml-6">
            <button
              onClick={() => onEdit(product)}
              className="form-button bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
            >
              Edit
            </button>
            <button
              onClick={() => confirm('Are you sure you want to delete this?') && onDelete(product._id)}
              className="form-button bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors duration-200"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}