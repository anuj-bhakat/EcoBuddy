import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaLeaf, FaTrash, FaShoppingCart } from "react-icons/fa";

const Cart = ({ cartItems, onClose, onRemoveFromCart, onUpdateQuantity, onClearCart }) => {
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 300);
  };

  const handleCheckout = () => {
    navigate("/checkout", { state: { cartItems } });
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
          <div className="bg-green-600 text-white p-3 sm:p-4 md:p-6 flex flex-col sm:flex-row items-center justify-between gap-2">
            <div className="flex items-center gap-2 sm:gap-3">
              <FaShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Your Cart</h2>
            </div>
            <button
              onClick={handleClose}
              className="text-white hover:text-green-200 text-xl sm:text-2xl font-bold transition-colors"
              aria-label="Close cart"
            >
              ×
            </button>
          </div>

          {/* Empty State */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 lg:p-12 text-center">
            <FaShoppingCart className="w-10 h-10 sm:w-16 sm:h-16 md:w-20 md:h-20 text-gray-300 mb-3 sm:mb-4" />
            <h3 className="text-base sm:text-lg md:text-xl font-semibold text-gray-600 mb-2">Your cart is empty</h3>
            <p className="text-gray-500 text-sm sm:text-base mb-2">Add up to 3 eco-friendly products to get started!</p>
            <p className="text-xs sm:text-sm text-green-600 mb-4 sm:mb-6 font-medium">Maximum 3 products per order</p>
            <button
              onClick={handleClose}
              className="bg-green-600 text-white w-full max-w-xs px-4 py-2.5 sm:px-6 sm:py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-sm sm:text-base"
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
        <div className="bg-green-600 text-white p-3 sm:p-4 md:p-6 flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <FaShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Your Cart</h2>
            <span className="bg-green-700 px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs font-semibold">
              {totalProducts} / 3
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onClearCart}
              className="bg-green-700 hover:bg-green-800 text-white px-3 py-2 rounded-lg font-semibold text-sm transition-colors shadow-sm"
            >
              Clear All
            </button>
            <button
              onClick={handleClose}
              className="bg-red-600 hover:bg-red-700 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg transition-colors shadow-sm"
              aria-label="Close cart"
            >
              ×
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 md:p-6">
          <div className="space-y-4 sm:space-y-6">
            {cartItems.map((item, index) => (
              <div
                key={`${item.id}-${index}`}
                className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-green-300 transition-all duration-200"
              >
                <div className="p-3 sm:p-4 md:p-6">
                  {/* Upper Row: Image, Points, Delete Button */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={item.images[0]}
                          alt={item.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm"
                        />
                      </div>

                      {/* Price Points */}
                      <div className="text-lg font-bold text-green-800">
                        {item.price_points} pts
                      </div>
                    </div>

                    {/* Delete Button - Fixed on right end */}
                    <button
                      onClick={() => onRemoveFromCart(item.id)}
                      className="w-10 h-10 flex items-center justify-center text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200 hover:border-red-300"
                      title="Remove from cart"
                    >
                      <FaTrash className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Lower Row: Product Name */}
                  <div className="text-left">
                    <h3 className="text-base sm:text-lg font-bold text-green-800 leading-tight">
                      {item.name}
                    </h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-t border-gray-200 p-3 sm:p-4 md:p-6 lg:p-8">
          <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                  <FaLeaf className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                </div>
                <div>
                  <span className="text-sm sm:text-base md:text-lg font-bold text-gray-800">Total Points Required</span>
                  <p className="text-xs sm:text-sm text-gray-500">All eco-friendly products</p>
                </div>
              </div>
              <div className="text-center sm:text-right">
                <span className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">{totalPoints}</span>
                <span className="text-sm sm:text-base md:text-lg text-gray-600 ml-1">pts</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <button
              onClick={handleClose}
              className="flex-1 border-2 border-green-600 text-green-600 py-3 sm:py-4 rounded-xl font-bold hover:bg-green-50 transition-all duration-200 text-sm sm:text-base shadow-sm hover:shadow-md"
            >
              Continue Shopping
            </button>
            <button
              onClick={handleCheckout}
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 sm:py-4 rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all duration-200 text-sm sm:text-base shadow-lg hover:shadow-xl"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;