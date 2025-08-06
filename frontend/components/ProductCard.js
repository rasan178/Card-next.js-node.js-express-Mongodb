import Image from 'next/image';

export default function ProductCard({ product }) {
  const baseUrl = 'http://localhost:5000';
  const imageUrl = product.imageUrl && product.imageUrl.startsWith('/uploads')
    ? `${baseUrl}${product.imageUrl}`
    : product.imageUrl || '';

  return (
    <div className="flex items-start p-4 border rounded-lg shadow-sm bg-white transform transition-all duration-200 hover:shadow-md">
      <div className="w-32 h-24 flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden shadow-sm">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            width={128}
            height={96}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
            No Image
          </div>
        )}
      </div>
      <div className="ml-6 flex-1">
        <h3 className="text-xl font-semibold text-blue-800">{product.name}</h3>
        <div className="flex gap-4 items-center mb-2">
          <span className="text-lg font-semibold text-green-600">Rs. {product.price}</span>
          <span className="text-sm text-gray-500">Quantity: {product.quantity} {product.unit}</span>
        </div>
        <p className="text-sm text-gray-600">{product.description || 'No description'}</p>
      </div>
    </div>
  );
}