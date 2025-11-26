import React, { useState } from 'react';
import Navbar from './Navbar';
import { FaLeaf, FaBox, FaTruck, FaCheckCircle, FaClock, FaMapMarkerAlt } from 'react-icons/fa';

// Static data for challenges (Completed & Ongoing)
const challengesData = [
  {
    id: 1,
    userName: 'John Doe',
    challenge: 'Plant 5 Trees',
    upvotes: 15,
    status: 'Completed',
  },
  {
    id: 2,
    userName: 'Jane Smith',
    challenge: 'Reduce Plastic Use',
    upvotes: 8,
    status: 'Ongoing',
  },
  {
    id: 3,
    userName: 'Alice Green',
    challenge: 'Organize Neighborhood Clean-Up',
    upvotes: 21,
    status: 'Completed',
  },
  {
    id: 4,
    userName: 'James White',
    challenge: 'Recycle 1000 Plastic Bottles',
    upvotes: 5,
    status: 'Ongoing',
  },
  {
    id: 5,
    userName: 'Emily Black',
    challenge: 'Go Car-Free for a Week',
    upvotes: 12,
    status: 'Completed',
  },
];

// Static data for orders (User's ordered products with status)
const ordersData = [
  {
    id: 1,
    orderId: 'ECO-2024-001',
    productName: 'Eco-Friendly Water Bottle',
    quantity: 1,
    price: 15,
    orderDate: '2024-11-20',
    status: 'Delivered',
    deliveryDate: '2024-11-23',
    image: 'https://i.pinimg.com/564x/c8/03/6a/c8036a4699f53dfc15ec88cafb2dc512.jpg'
  },
  {
    id: 2,
    orderId: 'ECO-2024-002',
    productName: 'Compostable Phone Case',
    quantity: 2,
    price: 40,
    orderDate: '2024-11-18',
    status: 'Shipped',
    deliveryDate: 'Expected: 2024-11-25',
    image: 'https://m.media-amazon.com/images/I/61AGSu9b8jL._UF1000,1000_QL80_.jpg'
  },
  {
    id: 3,
    orderId: 'ECO-2024-003',
    productName: 'Recycled Paper Notebook',
    quantity: 1,
    price: 12,
    orderDate: '2024-11-15',
    status: 'Processing',
    deliveryDate: 'Expected: 2024-11-28',
    image: 'https://www.pack-mate.in/cdn/shop/files/packmate-spiral-notebook-ruled-pack-of-5-made-from-100-recycled-paper.webp?v=1728120906'
  },
  {
    id: 4,
    orderId: 'ECO-2024-004',
    productName: 'Solar Powered Charger',
    quantity: 1,
    price: 100,
    orderDate: '2024-11-10',
    status: 'Delivered',
    deliveryDate: '2024-11-14',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQs0oG7eTGPkleQHunbQp4AQzw6jsdjpENKbA&s'
  },
];

export default function MyActivity() {
  const [activeSection, setActiveSection] = useState('Challenges');

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Function to get a colored tag for challenge status
  const getChallengeStatusTag = (status) => {
    if (status === 'Completed') {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-white bg-green-600 py-1 px-3 rounded-full font-medium">
          <FaCheckCircle className="w-3 h-3" />
          Completed
        </span>
      );
    }
    if (status === 'Ongoing') {
      return (
        <span className="inline-flex items-center gap-1 text-xs text-white bg-yellow-500 py-1 px-3 rounded-full font-medium">
          <FaClock className="w-3 h-3" />
          Ongoing
        </span>
      );
    }
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
            {/* Completed Challenges */}
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-green-100">
                <h2 className="text-xl sm:text-2xl font-bold text-green-800">
                  ✓ Completed Challenges
                </h2>
              </div>
              <div className="p-6 space-y-4">
                {challengesData.filter(challenge => challenge.status === 'Completed').map((challenge) => (
                  <div key={challenge.id} className="bg-green-50 rounded-xl p-4 border border-green-200 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-green-800 mb-1">{challenge.challenge}</h3>
                        <p className="text-green-600 text-sm">by {challenge.userName}</p>
                      </div>
                      <div className="flex items-center">
                        {getChallengeStatusTag(challenge.status)}
                      </div>
                    </div>
                  </div>
                ))}
                {challengesData.filter(challenge => challenge.status === 'Completed').length === 0 && (
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
                {challengesData.filter(challenge => challenge.status === 'Ongoing').map((challenge) => (
                  <div key={challenge.id} className="bg-yellow-50 rounded-xl p-4 border border-yellow-200 hover:shadow-md transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-yellow-800 mb-1">{challenge.challenge}</h3>
                        <p className="text-yellow-600 text-sm">by {challenge.userName}</p>
                      </div>
                      <div className="flex items-center">
                        {getChallengeStatusTag(challenge.status)}
                      </div>
                    </div>
                  </div>
                ))}
                {challengesData.filter(challenge => challenge.status === 'Ongoing').length === 0 && (
                  <div className="text-center py-8 text-yellow-600">
                    <FaClock className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No ongoing challenges. Join one to get started!</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Orders Section */}
        {activeSection === 'Orders' && (
          <div className="max-w-5xl mx-auto px-4 space-y-6">
            <div className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden">
              <div className="p-6 space-y-4">
                {ordersData.map((order) => (
                  <div key={order.id} className="bg-white rounded-xl p-4 border border-green-200 hover:shadow-lg transition-all duration-200">
                    {/* Row 1: Image on left, Status and Points on right */}
                    <div className="flex items-start justify-between mb-3">
                      {/* Product Image */}
                      <div className="flex-shrink-0">
                        <img
                          src={order.image}
                          alt={order.productName}
                          className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg shadow-sm"
                        />
                      </div>

                      {/* Status and Points stacked on right */}
                      <div className="flex flex-col items-end gap-2">
                        {getOrderStatusTag(order.status)}
                        <div className="bg-green-100 px-3 py-2 rounded-lg border border-green-300">
                          <div className="text-lg font-bold text-green-700 text-center">{order.price} pts</div>
                        </div>
                      </div>
                    </div>

                    {/* Row 2: Product Name - Full Width */}
                    <div className="mb-2">
                      <h3 className="text-lg font-bold text-green-800">{order.productName}</h3>
                    </div>

                    {/* Row 3: Order ID - Full Width */}
                    <div className="mb-3">
                      <p className="text-sm text-gray-600">Order #{order.orderId}</p>
                    </div>

                    {/* Row 4: Ordered Date (left) and Expected/Delivered Date (right) */}
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-1 text-gray-600">
                        <FaMapMarkerAlt className="w-4 h-4 text-green-600" />
                        <span>Ordered: {new Date(order.orderDate).toLocaleDateString()}</span>
                      </div>
                      <div className="text-green-600 font-medium">
                        {order.deliveryDate}
                      </div>
                    </div>
                  </div>
                ))}

                {ordersData.length === 0 && (
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
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
