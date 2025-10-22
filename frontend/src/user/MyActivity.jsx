import React, { useState } from 'react';
import Navbar from './Navbar';

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

// Static data for products (User's purchased products)
const productsData = [
  {
    id: 1,
    productName: 'Eco-Friendly Water Bottle',
    price: 15,
    rating: 4.5,
    purchased: true,
  },
  {
    id: 2,
    productName: 'Compostable Phone Case',
    price: 20,
    rating: 4.7,
    purchased: true,
  },
  {
    id: 3,
    productName: 'Organic Cotton T-Shirt',
    price: 25,
    rating: 4.8,
    purchased: false,
  },
  {
    id: 4,
    productName: 'Recycled Paper Notebook',
    price: 10,
    rating: 4.3,
    purchased: true,
  },
  {
    id: 5,
    productName: 'Solar Powered Charger',
    price: 40,
    rating: 4.9,
    purchased: true,
  },
];

export default function MyActivity() {
  const [activeSection, setActiveSection] = useState('Challenges');

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  // Function to convert dollars to Green Points
  const convertToGreenPoints = (dollars) => {
    return dollars * 10; // 1 dollar = 10 Green Points
  };

  // Function to get a colored tag for challenge status
  const getStatusTag = (status) => {
    if (status === 'Completed') {
      return (
        <span className="text-xs text-white bg-green-600 py-1 px-2 rounded-full">
          Completed
        </span>
      );
    }
    if (status === 'Ongoing') {
      return (
        <span className="text-xs text-white bg-yellow-500 py-1 px-2 rounded-full">
          Ongoing
        </span>
      );
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-green-50 py-4 sm:py-8">
        {/* Navigation between sections */}
        <div className="max-w-4xl mx-auto text-center mb-6 sm:mb-8">
          <div className="space-x-4 sm:space-x-6">
            <button
              onClick={() => handleSectionChange('Challenges')}
              className={`text-lg sm:text-xl font-semibold px-4 py-2 rounded-md ${activeSection === 'Challenges' ? 'bg-green-700 text-white' : 'bg-white text-green-700 border'}`}
            >
              Challenges
            </button>
            <button
              onClick={() => handleSectionChange('Products')}
              className={`text-lg sm:text-xl font-semibold px-4 py-2 rounded-md ${activeSection === 'Products' ? 'bg-green-700 text-white' : 'bg-white text-green-700 border'}`}
            >
              Products
            </button>
          </div>
        </div>

        {/* Challenges Section */}
        {activeSection === 'Challenges' && (
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {/* Completed Challenges */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-green-900 mb-4">Completed Challenges</h2>
              {challengesData.filter(challenge => challenge.status === 'Completed').map((challenge) => (
                <div key={challenge.id} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-transparent hover:border-green-700 mb-4">
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <h2 className="text-md sm:text-lg font-semibold text-green-900">{challenge.userName}</h2>
                    <div className="text-sm text-gray-600">{challenge.challenge}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <button className="text-green-600 hover:text-green-800">👍 {challenge.upvotes}</button>
                    </div>
                    {getStatusTag(challenge.status)}
                  </div>
                </div>
              ))}
            </div>

            {/* Ongoing Challenges */}
            <div>
              <h2 className="text-xl sm:text-2xl font-semibold text-green-900 mb-4">Ongoing Challenges</h2>
              {challengesData.filter(challenge => challenge.status === 'Ongoing').map((challenge) => (
                <div key={challenge.id} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-transparent hover:border-green-700 mb-4">
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <h2 className="text-md sm:text-lg font-semibold text-green-900">{challenge.userName}</h2>
                    <div className="text-sm text-gray-600">{challenge.challenge}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <button className="text-green-600 hover:text-green-800">👍 {challenge.upvotes}</button>
                    </div>
                    {getStatusTag(challenge.status)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Products Section */}
        {activeSection === 'Products' && (
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-900 mb-4">My Products</h2>
            {productsData.filter(product => product.purchased).map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-transparent hover:border-green-700 mb-4">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h2 className="text-md sm:text-lg font-semibold text-green-900">{product.productName}</h2>
                  <div className="text-sm text-gray-600">{convertToGreenPoints(product.price)} Green Points</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <button className="text-green-600 hover:text-green-800">⭐ {product.rating}</button>
                  </div>
                  <span className="text-sm text-gray-500">Purchased</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
