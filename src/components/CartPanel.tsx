import React from 'react';
import { useStore } from '../store/useStore';
import { X, Trash2 } from 'lucide-react';
import type { CartItem } from '../types';

export const CartPanel: React.FC = () => {
  const {
    isCartPanelOpen,
    toggleCartPanel,
    cart,
    removeFromCart,
    clearCart,
  } = useStore();

  const totalPrice = cart.reduce(
    (total: number, item: CartItem) => total + item.product.price * item.quantity,
    0
  );

  if (!isCartPanelOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50" onClick={() => toggleCartPanel(false)}>
      <div 
        className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Mi Carrito</h2>
          <button onClick={() => toggleCartPanel(false)} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Cart Items */}
        {cart.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <img src="/empty-cart.svg" alt="Carrito vacío" className="w-48 h-48 mb-6" />
            <h3 className="text-xl font-semibold text-gray-700">Tu carrito está vacío</h3>
            <p className="text-gray-500 mt-2">Parece que aún no has añadido nada. ¡Explora nuestros productos!</p>
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.map((item: CartItem) => (
              <div key={item.product.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <img 
                  src={item.product.imageUrl} 
                  alt={item.product.title} 
                  className="w-20 h-20 rounded-md object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800">{item.product.title}</h4>
                  <p className="text-sm text-gray-500">Cantidad: {item.quantity}</p>
                  <p className="font-bold text-indigo-600 mt-1">${item.product.price.toFixed(2)}</p>
                </div>
                <button onClick={() => removeFromCart(item.product.id)} className="p-2 rounded-full hover:bg-red-50 text-red-500">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        {cart.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg font-semibold text-gray-800">Subtotal:</span>
              <span className="text-2xl font-bold text-indigo-600">${totalPrice.toFixed(2)}</span>
            </div>
            <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors">
              Proceder al Pago
            </button>
            <button 
              onClick={clearCart}
              className="w-full mt-2 text-center text-sm text-red-500 hover:text-red-700 font-medium"
            >
              Vaciar Carrito
            </button>
          </div>
        )}
      </div>
    </div>
  );
};