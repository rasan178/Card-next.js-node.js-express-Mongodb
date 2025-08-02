export default function ProductCard({ product, onEdit, onDelete }) {
  return (
    <div className="product-card flex items-start">
      <div className="w-32 h-24 flex-shrink-0 bg-gray-200 rounded-xl overflow-hidden shadow">
        {product.imageUrl ? (
          <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400">
            No Image
          </div>
        )}
      </div>
      <div className="ml-6 flex-1">
        <h3 className="text-xl font-bold text-blue-700 mb-1">{product.name}</h3>
        <div className="flex gap-4 items-center mb-2">
          <span className="text-lg font-semibold text-green-700">Rs. {product.price}</span>
          <span className="text-sm text-gray-600">Quantity: {product.quantity} {product.unit}</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{product.description || 'No description'}</p>
      </div>
      <div className="flex flex-col space-y-2 ml-6">
        <button onClick={onEdit} className="form-button">Edit</button>
        <button
          onClick={() => confirm('Are you sure you want to delete this?') && onDelete()}
          className="form-cancel"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
