import React, { useState } from "react";
import { FaLeaf, FaTrash, FaShoppingCart } from "react-icons/fa";

const Cart = ({ cartItems, onClose, onRemoveFromCart, onUpdateQuantity, onClearCart }) => {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const totalPoints = cartItems.reduce((sum, item) => sum + (item.price_points * item.quantity), 0);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalProducts = cartItems.length;

  if (cartItems.length === 0) {
    return (
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        style={{ 
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
          backgroundColor: "rgba(0, 0, 0, 0.5)"
        }}
        onClick={handleClose}
      >
        <div
          className={`bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden transition-transform duration-300 ${
            isClosing ? "scale-95" : "scale-100"
          }`}
          style={{ minWidth: "280px", maxWidth: "100vw" }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="bg-green-600 text-white p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <FaShoppingCart className="w-6 h-6" />
              <h2 className="text-xl sm:text-2xl font-bold">Your Cart</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-green-200 text-2xl font-bold transition-colors"
              aria-label="Close cart"
            >
              ×
            </button>
          </div>

          {/* Empty State */}
          <div className="flex-1 flex flex-col items-center justify-center p-6 sm:p-12 text-center">
            <FaShoppingCart className="w-12 h-12 sm:w-20 sm:h-20 text-gray-300 mb-4" />
            <h3 className="text-lg sm:text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-2">Add up to 3 eco-friendly products to get started!</p>
            <p className="text-sm text-green-600 mb-6 font-medium">Maximum 3 products per order</p>
            <button
              onClick={handleClose}
              className="bg-green-600 text-white w-full px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto transition-opacity duration-300 ${
        isClosing ? "opacity-0" : "opacity-100"
      }`}
      style={{ 
        WebkitOverflowScrolling: "touch",
        overscrollBehavior: "contain",
        backgroundColor: "rgba(0, 0, 0, 0.5)"
      }}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-lg shadow-2xl w-full max-w-5xl max-h-[95vh] flex flex-col overflow-hidden transition-transform duration-300 ${
          isClosing ? "scale-95" : "scale-100"
        }`}
        style={{ minWidth: "280px", maxWidth: "100vw" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-green-600 text-white p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3">
            <FaShoppingCart className="w-6 h-6" />
            <h2 className="text-xl sm:text-2xl font-bold">Your Cart</h2>
            <span className="bg-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
              {totalProducts} / 3 product{totalProducts !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
            <button
              onClick={onClearCart}
              className="text-green-200 hover:text-white text-sm font-medium transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={handleClose}
              className="text-white hover:text-green-200 text-2xl font-bold transition-colors"
              aria-label="Close cart"
            >
              ×
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="space-y-6">
            {cartItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all duration-200"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                    {/* Product Image */}
                    <div className="flex-shrink-0 self-center sm:self-start mb-4 sm:mb-0">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-16 h-16 sm:w-24 sm:h-24 object-cover rounded-lg shadow-sm"
                      />
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-green-800 mb-2 leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                        {item.description}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        {/* Quantity Badge */}
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800">
                            Qty: {item.quantity}
                          </span>
                        </div>

                        {/* Price and Remove */}
                        <div className="flex items-center gap-4 sm:gap-6">
                          <div className="text-right">
                            <div className="text-lg sm:text-xl font-bold text-green-800">
                              {item.price_points * item.quantity} pts
                            </div>
                          </div>
                          <button
                            onClick={() => onRemoveFromCart(item.id)}
                            className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                            title="Remove from cart"
                          >
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-gray-200 p-4 sm:p-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FaLeaf className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <span className="text-base sm:text-lg font-bold text-gray-800">Total Points Required</span>
                  <p className="text-sm text-gray-500">All eco-friendly products</p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-2xl sm:text-3xl font-bold text-green-700">{totalPoints}</span>
                <span className="text-base sm:text-lg text-gray-600 ml-1">pts</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handleClose}
              className="flex-1 border-2 border-green-600 text-green-600 py-3 sm:py-4 rounded-xl font-bold hover:bg-green-50 transition-colors text-lg"
            >
              Continue Shopping
            </button>
            <button className="flex-1 bg-gradient-to-r from-green-600 to-green-700 text-white py-3 sm:py-4 rounded-xl font-bold hover:from-green-700 hover:to-green-800 transition-all duration-200 text-lg shadow-lg hover:shadow-xl tracking-wide uppercase">
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;