import React from 'react';
import { useParams } from 'react-router-dom';

// Vista de marcador de posición para la página de detalles del producto

export const ProductDetailView: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();

  return (
    <div className="p-6 md:p-10">
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Página de Detalle del Producto</h1>
        <p className="text-lg text-gray-600">
          Mostrando detalles para el producto con ID: 
          <span className="font-mono bg-gray-100 text-purple-600 p-1 rounded-md">{productId}</span>
        </p>
        <div className="mt-8 p-6 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-center text-gray-500">
            Este es un componente de marcador de posición (placeholder).
            <br />
            Aquí se construirán los detalles completos del producto, incluyendo descripción, imágenes, y el botón "Añadir al Carrito".
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailView;
