import React, { useState } from 'react';
import Navbar from './Navbar';
import {
  MdThumbUp, MdThumbDown, MdComment, MdPerson,
  MdArrowBack, MdCheckCircle, MdAccessTime, MdStar,
  MdRssFeed, MdAccountCircle, MdCreate
} from 'react-icons/md';
import { FaLeaf } from 'react-icons/fa';

// Static data for posts (Feed Section) - Enhanced with more realistic data
const postsData = [
  {
    id: 1,
    userName: 'John Doe',
    challenge: 'Plant 5 Trees in Local Park',
    description: 'Just completed my tree planting challenge! Spent the morning planting 5 native oak trees with my community group. The feeling of giving back to nature is incredible! 🌳',
    upvotes: 15,
    downvotes: 2,
    comments: 8,
    timeAgo: '2 hours ago',
    challengeCategory: 'Reforestation',
    difficulty: 'Easy',
    greenPoints: 50,
    status: 'Completed'
  },
  {
    id: 2,
    userName: 'Jane Smith',
    challenge: 'Zero Plastic Week Challenge',
    description: 'Week 2 of my plastic-free journey! Replaced all single-use plastics with eco-friendly alternatives. Saved 47 plastic items this week alone! 🌍',
    upvotes: 23,
    downvotes: 1,
    comments: 12,
    timeAgo: '4 hours ago',
    challengeCategory: 'Waste Reduction',
    difficulty: 'Medium',
    greenPoints: 75,
    status: 'Ongoing'
  },
  {
    id: 3,
    userName: 'Alice Green',
    challenge: 'Organize Neighborhood Clean-Up',
    description: 'Amazing turnout today! 25 volunteers joined us to clean our neighborhood park. Collected 15 bags of trash and recyclables. Together we made a difference! 💚',
    upvotes: 31,
    downvotes: 0,
    comments: 15,
    timeAgo: '1 day ago',
    challengeCategory: 'Community Action',
    difficulty: 'Hard',
    greenPoints: 100,
    status: 'Completed'
  },
  {
    id: 4,
    userName: 'Mike Johnson',
    challenge: 'Bike to Work Month',
    description: 'Day 15 of cycling to work! Not only am I reducing my carbon footprint, but I feel more energized and focused throughout the day. Win-win! 🚴‍♂️',
    upvotes: 18,
    downvotes: 1,
    comments: 6,
    timeAgo: '3 hours ago',
    challengeCategory: 'Transportation',
    difficulty: 'Medium',
    greenPoints: 80,
    status: 'Ongoing'
  },
  {
    id: 5,
    userName: 'Sarah Wilson',
    challenge: 'Start a Compost Bin',
    description: 'Finally started my home composting system! Already seeing reduced food waste and rich soil being created. The cycle of life in my backyard! 🌱',
    upvotes: 27,
    downvotes: 0,
    comments: 9,
    timeAgo: '6 hours ago',
    challengeCategory: 'Sustainability',
    difficulty: 'Easy',
    greenPoints: 60,
    status: 'Completed'
  }
];

// Static data for challenges selection
const challengesList = [
  'Plant 5 Trees in Local Park',
  'Zero Plastic Week Challenge',
  'Organize Neighborhood Clean-Up',
  'Bike to Work Month',
  'Start a Compost Bin',
  'Reduce Energy Consumption',
  'Support Local Farmers',
  'Eco-Friendly Shopping Challenge'
];

// Static data for My Posts
const myPostsData = [
  {
    id: 1,
    userName: 'John Doe',
    userAvatar: '🌱',
    challenge: 'Bike to Work Week',
    description: 'Challenge completed! Biked to work all week and felt amazing. Saved 35kg of CO2 emissions and got great exercise! 🚴‍♂️',
    upvotes: 22,
    downvotes: 1,
    comments: 5,
    timeAgo: '2 days ago',
    challengeCategory: 'Transportation',
    difficulty: 'Medium',
    greenPoints: 70,
    status: 'Completed'
  },
  {
    id: 2,
    userName: 'John Doe',
    userAvatar: '🌱',
    challenge: 'Support Local Farmers',
    description: 'Week 3 of buying only locally grown produce. The food tastes amazing and I love supporting our local farming community! 🥕',
    upvotes: 16,
    downvotes: 0,
    comments: 7,
    timeAgo: '1 week ago',
    challengeCategory: 'Local Economy',
    difficulty: 'Easy',
    greenPoints: 45,
    status: 'Completed'
  }
];

export default function Community() {
  const [activeSection, setActiveSection] = useState('Feed');
  const [newPost, setNewPost] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [dislikedPosts, setDislikedPosts] = useState(new Set());

  const handleSectionChange = (section) => {
    setActiveSection(section);
  };

  const handlePostSubmit = () => {
    if (selectedChallenge && newPost.trim()) {
      alert(`Post about "${selectedChallenge}" submitted successfully! 🌱`);
      setNewPost('');
      setSelectedChallenge('');
    } else {
      alert('Please select a challenge and write your post.');
    }
  };

  const handleLike = (postId) => {
    setLikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
        // Remove from dislikes if present
        setDislikedPosts(prevDislikes => {
          const newDislikes = new Set(prevDislikes);
          newDislikes.delete(postId);
          return newDislikes;
        });
      }
      return newSet;
    });
  };

  const handleDislike = (postId) => {
    setDislikedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
        // Remove from likes if present
        setLikedPosts(prevLikes => {
          const newLikes = new Set(prevLikes);
          newLikes.delete(postId);
          return newLikes;
        });
      }
      return newSet;
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'completed': return <MdCheckCircle className="w-4 h-4 text-green-500" />;
      case 'ongoing': return <MdAccessTime className="w-4 h-4 text-blue-500" />;
      default: return <MdAccessTime className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100">
        <div className="max-w-4xl mx-auto px-4 py-6">

          {/* Simple Navigation */}
          <div className="mb-6">
            <div className="flex justify-center">
              <div className="bg-white rounded-lg shadow-sm border border-green-200 p-1 flex w-full max-w-md">
                {[
                  { key: 'Feed', label: 'Community Feed', icon: <MdRssFeed className="w-4 h-4" /> },
                  { key: 'My Post', label: 'My Posts', icon: <MdAccountCircle className="w-4 h-4" /> },
                  { key: 'New Post', label: 'Create Post', icon: <MdCreate className="w-4 h-4" /> }
                ].map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => handleSectionChange(key)}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-md font-medium text-sm transition-colors flex-1 ${
                      activeSection === key
                        ? 'bg-green-600 text-white shadow-sm'
                        : 'text-green-700 hover:bg-green-50'
                    }`}
                  >
                    {icon}
                    <span className="hidden sm:inline">{label}</span>
                    <span className="sm:hidden">{key === 'My Post' ? 'My Posts' : key === 'New Post' ? 'Create' : 'Feed'}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div>
            {/* Feed Section */}
            {activeSection === 'Feed' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-green-900 mb-4">Community Feed</h2>

                {postsData.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-lg shadow-sm border border-green-200 overflow-hidden"
                  >
                    {/* Post Header */}
                    <div className="p-4">
                      {/* User Info Row */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <MdPerson className="w-5 h-5 text-green-700" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-green-900 truncate">{post.userName}</h3>
                          <p className="text-green-600 text-sm flex items-center gap-1">
                            <MdAccessTime className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{post.timeAgo}</span>
                          </p>
                        </div>
                      </div>

                      {/* Challenge Badges Row */}
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                          {post.challengeCategory}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full font-medium ${getDifficultyColor(post.difficulty)}`}>
                          {post.difficulty}
                        </span>
                        <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full font-semibold ml-auto">
                          +{post.greenPoints} pts
                        </span>
                      </div>

                      {/* Challenge Title */}
                      <h2 className="text-lg font-bold text-green-900 mb-2">
                        {post.challenge}
                      </h2>

                      {/* Post Description */}
                      <p className="text-gray-700 leading-relaxed mb-3">
                        {post.description}
                      </p>

                      {/* Status */}
                      <div className="flex items-center gap-2">
                        {getStatusIcon(post.status)}
                        <span className="text-sm text-green-700 capitalize">{post.status}</span>
                      </div>
                    </div>

                    {/* Post Actions */}
                    <div className="px-4 py-3 bg-gray-50 border-t border-green-100">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => handleLike(post.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                            likedPosts.has(post.id)
                              ? 'bg-green-100 text-green-800'
                              : 'hover:bg-green-50 text-green-700'
                          }`}
                        >
                          <MdThumbUp className={`w-5 h-5 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                          <span>{post.upvotes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                        </button>

                        <button
                          onClick={() => handleDislike(post.id)}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                            dislikedPosts.has(post.id)
                              ? 'bg-red-100 text-red-800'
                              : 'hover:bg-red-50 text-red-700'
                          }`}
                        >
                          <MdThumbDown className={`w-5 h-5 ${dislikedPosts.has(post.id) ? 'fill-current' : ''}`} />
                          <span>{post.downvotes + (dislikedPosts.has(post.id) ? 1 : 0)}</span>
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* My Posts Section */}
            {activeSection === 'My Post' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-green-900 mb-4">My Posts</h2>

                {myPostsData.length === 0 ? (
                  <div className="bg-white rounded-lg shadow-sm border border-green-200 p-8 text-center">
                    <div className="text-4xl mb-4">🌱</div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">No posts yet</h3>
                    <p className="text-gray-600 mb-4">Start sharing your eco-journey with the community!</p>
                    <button
                      onClick={() => handleSectionChange('New Post')}
                      className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Create Your First Post
                    </button>
                  </div>
                ) : (
                  myPostsData.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-lg shadow-sm border border-green-200 overflow-hidden"
                    >
                      <div className="p-4">
                        {/* User Info Row */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <MdPerson className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-green-900 truncate">{post.userName}</h3>
                            <p className="text-green-600 text-sm flex items-center gap-1">
                              <MdAccessTime className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{post.timeAgo}</span>
                            </p>
                          </div>
                        </div>

                        {/* Challenge Badges Row */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            {post.challengeCategory}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getDifficultyColor(post.difficulty)}`}>
                            {post.difficulty}
                          </span>
                          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full font-semibold ml-auto">
                            +{post.greenPoints} pts
                          </span>
                        </div>

                        {/* Challenge Title */}
                        <h2 className="text-lg font-bold text-green-900 mb-2">{post.challenge}</h2>

                        {/* Post Description */}
                        <p className="text-gray-700 leading-relaxed mb-3">{post.description}</p>

                        {/* Status */}
                        <div className="flex items-center gap-2">
                          {getStatusIcon(post.status)}
                          <span className="text-sm text-green-700 capitalize">{post.status}</span>
                        </div>
                      </div>

                      <div className="px-4 py-3 bg-gray-50 border-t border-green-100">
                        <div className="flex items-center gap-4">
                          <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 text-green-700">
                            <MdThumbUp className="w-5 h-5" />
                            <span>{post.upvotes}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}

            {/* New Post Section */}
            {activeSection === 'New Post' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-green-900 mb-4">Create New Post</h2>

                <div className="bg-white rounded-lg shadow-sm border border-green-200 p-6">
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-green-900 mb-2">Share Your Eco-Journey</h3>
                    <p className="text-green-700">Tell the community about your environmental actions and inspire others!</p>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <label className="block font-medium text-green-900 mb-2">
                        Which challenge are you sharing about?
                      </label>
                      <select
                        value={selectedChallenge}
                        onChange={(e) => setSelectedChallenge(e.target.value)}
                        className="w-full border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-green-900"
                      >
                        <option value="">Choose a challenge...</option>
                        {challengesList.map((challenge, idx) => (
                          <option key={idx} value={challenge}>
                            {challenge}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block font-medium text-green-900 mb-2">
                        Share your experience
                      </label>
                      <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        rows="6"
                        placeholder="Tell us what you did, how it felt, and what impact it had..."
                        className="w-full border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 text-green-900 resize-none"
                      />
                      <p className="text-sm text-green-600 mt-2">
                        💡 Tip: Be specific about your actions to inspire others!
                      </p>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                      <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                        <FaLeaf className="w-4 h-4" />
                        Community Guidelines
                      </h4>
                      <ul className="text-sm text-green-700 space-y-1">
                        <li>• Share authentic eco-friendly experiences</li>
                        <li>• Be encouraging and supportive</li>
                        <li>• Focus on positive environmental impact</li>
                        <li>• Use emojis to make your post engaging!</li>
                      </ul>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handlePostSubmit}
                        disabled={!selectedChallenge || !newPost.trim()}
                        className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                          selectedChallenge && newPost.trim()
                            ? 'bg-green-600 text-white hover:bg-green-700'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <MdCreate className="w-5 h-5" />
                        Share My Story
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
