import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import { FaLeaf, FaMapMarkerAlt, FaCreditCard, FaCheckCircle, FaArrowLeft } from "react-icons/fa";

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems = [], singleProduct = null } = location.state || {};

  const [userGreenPoints, setUserGreenPoints] = useState(0);
  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: ""
  });
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  // Calculate totals
  const items = singleProduct ? [singleProduct] : cartItems;
  const subtotal = items.reduce((sum, item) => sum + (item.green_points * (item.quantity || 1)), 0);
  const deliveryFee = subtotal > 50 ? 0 : 5; // Free delivery over 50 points
  const total = subtotal + deliveryFee;

  // Fetch user green points from API
  useEffect(() => {
    const fetchUserGreenPoints = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          console.error("User ID not found in localStorage");
          return;
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/greenpoints/user/${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch green points: ${response.status}`);
        }

        const data = await response.json();
        setUserGreenPoints(data.green_points || 0);
      } catch (error) {
        console.error("Error fetching user green points:", error);
        setUserGreenPoints(0); // Set to 0 on error
      }
    };

    fetchUserGreenPoints();
  }, []);

  const handleAddressChange = (field, value) => {
    setAddress(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePlaceOrder = async () => {
    // Validate address
    if (!address.street || !address.city || !address.state || !address.zipCode || !address.country) {
      alert("Please fill in all address fields");
      return;
    }

    // Check if user has enough points
    if (userGreenPoints < total) {
      alert("Insufficient green points. Please earn more points or remove some items.");
      return;
    }

    setLoading(true);

    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        alert("User not authenticated. Please log in again.");
        setLoading(false);
        return;
      }

      // Prepare order data
      const orderData = {
        product_ids: items.map(item => item.id),
        user_id: userId,
        total_green_points: total,
        order_date: new Date().toISOString(),
        status: "processing",
        address: {
          line1: address.street,
          city: address.city,
          state: address.state,
          postal_code: address.zipCode,
          country: address.country
        }
      };

      // Make API call to place order
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to place order: ${response.status}`);
      }

      const orderResult = await response.json();
      console.log('Order placed successfully:', orderResult);

      // Deduct green points after successful order placement
      try {
        const adjustResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/greenpoints/user/adjust`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            user_id: userId,
            change_amount: -total, // Negative value to deduct points
            reason: `Placed Order : ${orderResult.order_id}`
          })
        });

        if (!adjustResponse.ok) {
          console.error('Failed to deduct green points, but order was placed');
          // Don't throw error here as order was successful
        } else {
          console.log('Green points deducted successfully');
        }
      } catch (adjustError) {
        console.error('Error deducting green points:', adjustError);
        // Don't fail the order placement if points deduction fails
      }

      setOrderPlaced(true);
    } catch (error) {
      console.error('Error placing order:', error);
      alert(`Failed to place order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const canPlaceOrder = address.street && address.city && address.state && address.zipCode && address.country && userGreenPoints >= total;

  if (orderPlaced) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-8 text-center max-w-md w-full">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaCheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 mb-4">Order Placed Successfully!</h2>
            <p className="text-gray-600 mb-6">
              Your eco-friendly products will be delivered as soon as possible.
              Thank you for supporting sustainable living!
            </p>
            <div className="space-y-3">
              <button
                onClick={() => navigate("/eco-products")}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Continue Shopping
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="w-full border-2 border-green-600 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors"
              >
                View Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-green-700 hover:text-green-800 font-medium"
            >
              <FaArrowLeft className="w-4 h-4" />
              Back
            </button>
            <h1 className="text-3xl font-bold text-green-800">Checkout</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column - Order Summary */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  <FaCreditCard className="w-5 h-5" />
                  Order Summary
                </h2>

                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                      <img
                        src={item.images[0]}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-green-800">{item.name}</h3>
                        <p className="text-sm text-gray-600">Qty: {item.quantity || 1}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-800">
                          {item.green_points * (item.quantity || 1)} pts
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t border-gray-200 mt-6 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>{subtotal} pts</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Delivery Fee</span>
                    <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                      {deliveryFee === 0 ? "Free" : `${deliveryFee} pts`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t border-gray-300 pt-2">
                    <span>Total</span>
                    <span className="text-green-800">{total} pts</span>
                  </div>
                </div>
              </div>

              {/* Green Points Balance */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-bold text-green-800 mb-4 flex items-center gap-2">
                  <FaLeaf className="w-5 h-5" />
                  Your Green Points
                </h3>
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-800 mb-2">
                    {userGreenPoints} pts
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Available Balance
                  </div>
                  {userGreenPoints < total ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <div className="text-red-800 font-semibold mb-2">
                        Insufficient Points
                      </div>
                      <div className="text-red-600 text-sm">
                        You need {total - userGreenPoints} more points to complete this order.
                      </div>
                      <button
                        onClick={() => navigate("/challenges")}
                        className="mt-3 bg-red-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors"
                      >
                        Earn More Points
                      </button>
                    </div>
                  ) : (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="text-green-800 font-semibold mb-2">
                        ✓ Sufficient Points
                      </div>
                      <div className="text-green-600 text-sm">
                        You have enough points to complete this order.
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Column - Shipping Address */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                  <FaMapMarkerAlt className="w-5 h-5" />
                  Shipping Address
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => handleAddressChange("street", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="123 Main Street"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        value={address.city}
                        onChange={(e) => handleAddressChange("city", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="New York"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State *
                      </label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => handleAddressChange("state", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="NY"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP Code *
                      </label>
                      <input
                        type="text"
                        value={address.zipCode}
                        onChange={(e) => handleAddressChange("zipCode", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="10001"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country *
                      </label>
                      <input
                        type="text"
                        value={address.country}
                        onChange={(e) => handleAddressChange("country", e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        placeholder="USA"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Place Order Button */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <button
                  onClick={handlePlaceOrder}
                  disabled={loading || !canPlaceOrder}
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                    canPlaceOrder && !loading
                      ? "bg-green-600 hover:bg-green-700 text-white shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Processing Order...
                    </div>
                  ) : (
                    `Place Order (${total} pts)`
                  )}
                </button>

                {!canPlaceOrder && userGreenPoints >= total && (
                  <p className="text-red-600 text-sm text-center mt-2">
                    Please fill in all required address fields
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;