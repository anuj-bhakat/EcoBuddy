import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { FaLeaf, FaBox, FaTruck, FaCheckCircle, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

const baseUrl = import.meta.env.VITE_API_BASE_URL;

export default function MyActivity() {
  const [activeSection, setActiveSection] = useState('Challenges');
  const [challenges, setChallenges] = useState([]);
  const [challengesLoading, setChallengesLoading] = useState(false);
  const [challengesError, setChallengesError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Fetch challenges when component mounts
  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          setChallengesError("User not authenticated");
          return;
        }

        setChallengesLoading(true);
        setChallengesError(null);

        const response = await fetch(`${baseUrl}/api/challenges/user/${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch challenges: ${response.status}`);
        }

        const data = await response.json();
        setChallenges(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching challenges:", error);
        setChallengesError(error.message);
        setChallenges([]);
      } finally {
        setChallengesLoading(false);
      }
    };

    fetchChallenges();
  }, []);

  // Fetch orders when component mounts
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          setOrdersError("User not authenticated");
          return;
        }

        setOrdersLoading(true);
        setOrdersError(null);

        const response = await fetch(`${baseUrl}/orders/user/${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch orders: ${response.status}`);
        }

        const data = await response.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrdersError(error.message);
        setOrders([]);
      } finally {
        setOrdersLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to get a colored tag for challenge status
  const getChallengeStatusTag = (status) => {
    // Map API status to UI status
    const normalizedStatus = status === 'completed' ? 'Completed' :
                           status === 'ongoing' ? 'Ongoing' : status;

    if (normalizedStatus === 'Completed') {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-white bg-green-600 py-1 px-3 rounded-full font-medium">
          <FaCheckCircle className="w-3 h-3" />
          Completed
        </span>
      );
    }
    if (normalizedStatus === 'Ongoing') {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-white bg-yellow-500 py-1 px-3 rounded-full font-medium">
          <FaClock className="w-3 h-3" />
          Ongoing
        </span>
      );
    }
    return null;
  };

  // Function to get a colored tag for order status
  const getOrderStatusTag = (status) => {
    const statusConfig = {
      'Processing': { color: 'bg-blue-100 text-blue-800 border-blue-200', icon: FaClock },
      'Shipped': { color: 'bg-orange-100 text-orange-800 border-orange-200', icon: FaTruck },
      'Delivered': { color: 'bg-green-100 text-green-800 border-green-200', icon: FaCheckCircle }
    };

    const config = statusConfig[status] || statusConfig['Processing'];
    const IconComponent = config.icon;

    return (
      <span className={`inline-flex items-center gap-1 text-xs font-semibold py-1 px-3 rounded-full border ${config.color}`}>
        <IconComponent className="w-3 h-3" />
        {status}
      </span>
    );
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-green-50 py-6 sm:py-10">

        {/* Navigation between sections */}
        <div className="max-w-4xl mx-auto px-4 mb-8">
          <div className="flex justify-center">
            <div className="bg-white rounded-xl shadow-sm border border-green-200 p-1 flex">
              <button
                onClick={() => handleSectionChange('Challenges')}
                className={`px-6 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
                  activeSection === 'Challenges'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-green-700 hover:bg-green-50'
                }`}
              >
                Challenges
              </button>
              <button
                onClick={() => handleSectionChange('Orders')}
                className={`px-6 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all duration-200 ${
                  activeSection === 'Orders'
                    ? 'bg-green-600 text-white shadow-md'
                    : 'text-green-700 hover:bg-green-50'
                }`}
              >
                Orders
              </button>
            </div>
          </div>
        </div>

        {/* Challenges Section */}
        {activeSection === 'Challenges' && (
          <div className="max-w-5xl mx-auto px-4 space-y-8">
            {challengesLoading ? (
              // Loading state for challenges
              <>
                <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-green-100">
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="p-6 space-y-4">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div key={index} className="bg-green-50 rounded-xl p-4 border border-green-200 animate-pulse">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex-1">
                            <div className="h-6 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          </div>
                          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-yellow-100">
                    <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                  </div>
                  <div className="p-6 space-y-4">
                    {Array.from({ length: 2 }).map((_, index) => (
                      <div key={index} className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 animate-pulse">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex-1">
                            <div className="h-6 bg-gray-200 rounded mb-2"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          </div>
                          <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : challengesError ? (
              // Error state for challenges
              <div className="text-center py-12">
                <div className="text-red-500 text-4xl mb-4">⚠️</div>
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Failed to load challenges</h3>
                <p className="text-gray-500 mb-4">{challengesError}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : (
              <>
                {/* Completed Challenges */}
                <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-green-100">
                    <h2 className="text-xl sm:text-2xl font-bold text-green-800">
                      ✓ Completed Challenges
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {challenges.filter(challenge => challenge.submission?.status === 'completed').map((challenge) => (
                      <div key={challenge.submission_id} className="bg-green-50 rounded-xl p-4 border border-green-200 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-green-800 mb-1">{challenge.title}</h3>
                            <p className="text-green-600 text-sm">by {challenge.creator?.full_name || 'Unknown'}</p>
                            {challenge.submission?.green_points_awarded && (
                              <p className="text-green-700 text-sm font-medium mt-1">
                                +{challenge.submission.green_points_awarded} points earned
                              </p>
                            )}
                          </div>
                          <div className="flex items-center">
                            {getChallengeStatusTag(challenge.submission?.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {challenges.filter(challenge => challenge.submission?.status === 'completed').length === 0 && (
                      <div className="text-center py-8 text-green-600">
                        <FaCheckCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No completed challenges yet. Start participating!</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ongoing Challenges */}
                <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-yellow-100">
                    <h2 className="text-xl sm:text-2xl font-bold text-yellow-800">
                      🕐 Ongoing Challenges
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    {challenges.filter(challenge => challenge.submission?.status === 'ongoing').map((challenge) => (
                      <div key={challenge.submission_id} className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 hover:shadow-md transition-shadow">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-yellow-800 mb-1">{challenge.title}</h3>
                            <p className="text-yellow-600 text-sm">by {challenge.creator?.full_name || 'Unknown'}</p>
                            <p className="text-yellow-700 text-sm mt-1">
                              {challenge.green_points} points available
                            </p>
                          </div>
                          <div className="flex items-center">
                            {getChallengeStatusTag(challenge.submission?.status)}
                          </div>
                        </div>
                      </div>
                    ))}
                    {challenges.filter(challenge => challenge.submission?.status === 'ongoing').length === 0 && (
                      <div className="text-center py-8 text-yellow-600">
                        <FaClock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                        <p>No ongoing challenges. Join one to get started!</p>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Orders Section */}
        {activeSection === 'Orders' && (
          <div className="max-w-5xl mx-auto px-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
              <div className="p-6 space-y-4">
                {ordersLoading ? (
                  // Loading state
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 border border-green-200 animate-pulse">
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="w-20 h-6 bg-gray-200 rounded-full"></div>
                          <div className="w-16 h-8 bg-gray-200 rounded-lg"></div>
                        </div>
                      </div>
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-3 w-3/4"></div>
                      <div className="flex items-center justify-between">
                        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))
                ) : ordersError ? (
                  // Error state
                  <div className="text-center py-12">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Failed to load orders</h3>
                    <p className="text-gray-500 mb-4">{ordersError}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : orders.length === 0 ? (
                  // No orders state
                  <div className="text-center py-12">
                    <FaBox className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No orders yet</h3>
                    <p className="text-gray-500 mb-4">Start shopping to see your orders here!</p>
                    <button
                      onClick={() => window.location.href = '/eco-products'}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Browse Products
                    </button>
                  </div>
                ) : (
                  // Orders data - flatten products from each order
                  orders.flatMap((order) =>
                    order.products.map((product, productIndex) => (
                      <div key={`${order.id}-${productIndex}`} className="bg-white rounded-xl p-4 border border-green-200 hover:shadow-lg transition-all duration-200">
                        {/* Row 1: Image on left, Status and Points on right */}
                        <div className="flex items-start justify-between mb-3">
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={product.images?.[0] || '/placeholder-product.jpg'}
                              alt={product.name}
                              className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm"
                            />
                          </div>

                          {/* Status and Points stacked on right */}
                          <div className="flex flex-col items-end gap-2">
                            {getOrderStatusTag(order.status)}
                            <div className="bg-green-100 px-3 py-2 rounded-lg border border-green-300">
                              <div className="text-lg font-bold text-green-700 text-center">{product.green_points} pts</div>
                            </div>
                          </div>
                        </div>

                        {/* Row 2: Product Name - Full Width */}
                        <div className="mb-2">
                          <h3 className="text-lg font-bold text-green-800">{product.name}</h3>
                        </div>

                        {/* Row 3: Order ID - Full Width */}
                        <div className="mb-3">
                          <p className="text-sm text-gray-600">Order #{order.order_id}</p>
                        </div>

                        {/* Row 4: Ordered Date (left) and Expected/Delivered Date (right) */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-1 text-gray-600">
                            <FaMapMarkerAlt className="w-4 h-4 text-green-600" />
                            <span>Ordered: {new Date(order.order_date).toLocaleDateString()}</span>
                          </div>
                          <div className="text-green-600 font-medium">
                            {order.delivery_date ? new Date(order.delivery_date).toLocaleDateString() : 'Processing'}
                          </div>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
