import React, { useState } from 'react';
import Navbar from './Navbar';

// Static data for posts (Feed Section)
const postsData = [
  {
    id: 1,
    userName: 'John Doe',
    challenge: 'Plant 5 Trees',
    upvotes: 15,
  },
  {
    id: 2,
    userName: 'Jane Smith',
    challenge: 'Reduce Plastic Use',
    upvotes: 8,
  },
  {
    id: 3,
    userName: 'Alice Green',
    challenge: 'Organize Neighborhood Clean-Up',
    upvotes: 21,
  },
];

// Static data for My Post (Example User Posts)
const myPostsData = [
  {
    id: 1,
    userName: 'John Doe',
    challenge: 'Bike to Work',
    upvotes: 10,
  },
  {
    id: 2,
    userName: 'John Doe',
    challenge: 'Support Local Farmers',
    upvotes: 5,
  },
];

export default function Community() {
  const [activeSection, setActiveSection] = useState('Feed');
  const [newPost, setNewPost] = useState('');

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handlePostSubmit = () => {
    // Add a new post (static data for now)
    if (newPost.trim()) {
      alert('Post submitted!');
      setNewPost('');
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
              onClick={() => handleSectionChange('Feed')}
              className={`text-lg sm:text-xl font-semibold px-4 py-2 rounded-md ${activeSection === 'Feed' ? 'bg-green-700 text-white' : 'bg-white text-green-700 border'}`}
            >
              Feed
            </button>
            <button
              onClick={() => handleSectionChange('My Post')}
              className={`text-lg sm:text-xl font-semibold px-4 py-2 rounded-md ${activeSection === 'My Post' ? 'bg-green-700 text-white' : 'bg-white text-green-700 border'}`}
            >
              My Post
            </button>
            <button
              onClick={() => handleSectionChange('New Post')}
              className={`text-lg sm:text-xl font-semibold px-4 py-2 rounded-md ${activeSection === 'New Post' ? 'bg-green-700 text-white' : 'bg-white text-green-700 border'}`}
            >
              New Post
            </button>
          </div>
        </div>

        {/* Feed Section */}
        {activeSection === 'Feed' && (
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            {postsData.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-transparent hover:border-green-700">
                <div className="flex justify-between items-center mb-3 sm:mb-4">
                  <h2 className="text-md sm:text-lg font-semibold text-green-900">{post.userName}</h2>
                  <div className="text-sm text-gray-600">{post.challenge}</div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <button className="text-green-600 hover:text-green-800">👍 {post.upvotes}</button>
                  </div>
                  <span className="text-sm text-gray-500">Completed</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* My Post Section */}
        {activeSection === 'My Post' && (
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <h2 className="text-xl sm:text-2xl font-semibold text-green-900">My Posts</h2>
            {myPostsData.length === 0 ? (
              <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
                <p className="text-gray-600">You have no posts yet.</p>
              </div>
            ) : (
              myPostsData.map((post) => (
                <div key={post.id} className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border border-transparent hover:border-green-700">
                  <div className="flex justify-between items-center mb-3 sm:mb-4">
                    <h2 className="text-md sm:text-lg font-semibold text-green-900">{post.userName}</h2>
                    <div className="text-sm text-gray-600">{post.challenge}</div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <button className="text-green-600 hover:text-green-800">👍 {post.upvotes}</button>
                    </div>
                    <span className="text-sm text-gray-500">Completed</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* New Post Section */}
        {activeSection === 'New Post' && (
          <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6">
              <h2 className="text-xl sm:text-2xl font-semibold text-green-900">Create New Post</h2>
              <div className="mt-4">
                <textarea
                  value={newPost}
                  onChange={(e) => setNewPost(e.target.value)}
                  rows="4"
                  placeholder="Share your eco-friendly experience..."
                  className="w-full p-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600"
                />
              </div>
              <div className="mt-4 text-right">
                <button
                  onClick={handlePostSubmit}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                >
                  Submit Post
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
