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

      {/* Enhanced background with eco-themed decorations */}
      <div className="min-h-screen bg-gradient-to-br from-white via-green-50 to-green-100 relative overflow-hidden">

        <div className="relative z-10 py-2 sm:py-4 md:py-6">
          {/* Enhanced Header */}
          <div className="max-w-6xl mx-auto px-2 sm:px-4 mb-2 sm:mb-4">
            <div className="text-center">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-green-800 mb-1 sm:mb-2 tracking-tight">
                Community Hub 🌱
              </h1>
              <p className="text-green-600 text-xs sm:text-sm md:text-base font-medium max-w-2xl mx-auto px-2">
                Connect with eco-warriors, share your green journey, and inspire others!
              </p>
            </div>
          </div>

          {/* Enhanced Navigation */}
          <div className="max-w-6xl mx-auto px-2 sm:px-4 mb-2 sm:mb-4">
            <div className="flex justify-center">
              <div className="bg-white rounded-xl shadow-md border border-green-100 p-1 inline-flex flex-wrap sm:flex-nowrap">
                {[
                  { key: 'Feed', label: 'Community Feed', icon: <MdRssFeed className="w-3 h-3 sm:w-4 sm:h-4" /> },
                  { key: 'My Post', label: 'My Posts', icon: <MdAccountCircle className="w-3 h-3 sm:w-4 sm:h-4" /> },
                  { key: 'New Post', label: 'Create Post', icon: <MdCreate className="w-3 h-3 sm:w-4 sm:h-4" /> }
                ].map(({ key, label, icon }) => (
                  <button
                    key={key}
                    onClick={() => handleSectionChange(key)}
                    className={`flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg font-semibold text-xs sm:text-sm transition-all duration-200 ${
                      activeSection === key
                        ? 'bg-green-600 text-white shadow-md transform scale-105'
                        : 'text-green-600 hover:bg-green-50 hover:text-green-700'
                    }`}
                  >
                    {icon}
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Sections */}
          <div className="max-w-4xl mx-auto px-2 sm:px-4">
            {/* Feed Section */}
            {activeSection === 'Feed' && (
              <div className="space-y-3">
                {postsData.map((post) => (
                  <article
                    key={post.id}
                    className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-transparent hover:border-green-200 overflow-hidden group"
                  >
                    {/* Post Header */}
                    <div className="p-3 sm:p-4 pb-2 sm:pb-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-full flex items-center justify-center text-base sm:text-lg border border-green-100">
                            <MdPerson className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-bold text-green-800 text-xs sm:text-sm truncate">{post.userName}</h3>
                            <p className="text-green-500 text-xs flex items-center gap-1">
                              <MdAccessTime className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                              <span className="truncate">{post.timeAgo}</span>
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Challenge Info */}
                      <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2">
                        <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
                          <FaLeaf className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                          <span className="truncate">{post.challengeCategory}</span>
                        </span>
                        <span className={`px-1.5 sm:px-2 py-0.5 text-xs font-medium rounded-full ${getDifficultyColor(post.difficulty)}`}>
                          {post.difficulty}
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                          <MdStar className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                          +{post.greenPoints} pts
                        </span>
                      </div>

                      {/* Challenge Title */}
                      <h2 className="text-sm sm:text-base font-bold text-green-800 mb-1 sm:mb-2 group-hover:text-green-600 transition-colors leading-tight">
                        {post.challenge}
                      </h2>

                      {/* Post Description */}
                      <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-2 line-clamp-3">
                        {post.description}
                      </p>
                    </div>

                    {/* Post Actions */}
                    <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-green-25 border-t border-green-50">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2 sm:space-x-4">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center space-x-1 px-1.5 sm:px-2 py-1 rounded transition-all duration-200 ${
                              likedPosts.has(post.id)
                                ? 'bg-green-100 text-green-700'
                                : 'hover:bg-green-50 text-green-600'
                            }`}
                          >
                            <MdThumbUp className={`w-3 h-3 sm:w-4 sm:h-4 ${likedPosts.has(post.id) ? 'fill-current' : ''}`} />
                            <span className="text-xs font-medium">{post.upvotes + (likedPosts.has(post.id) ? 1 : 0)}</span>
                          </button>

                          <button
                            onClick={() => handleDislike(post.id)}
                            className={`flex items-center space-x-1 px-1.5 sm:px-2 py-1 rounded transition-all duration-200 ${
                              dislikedPosts.has(post.id)
                                ? 'bg-red-100 text-red-700'
                                : 'hover:bg-red-50 text-red-600'
                            }`}
                          >
                            <MdThumbDown className={`w-3 h-3 sm:w-4 sm:h-4 ${dislikedPosts.has(post.id) ? 'fill-current' : ''}`} />
                            <span className="text-xs font-medium">{post.downvotes + (dislikedPosts.has(post.id) ? 1 : 0)}</span>
                          </button>

                          <button className="flex items-center space-x-1 px-1.5 sm:px-2 py-1 rounded hover:bg-blue-50 text-blue-600 transition-colors">
                            <MdComment className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span className="text-xs font-medium">{post.comments}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}

            {/* My Posts Section */}
            {activeSection === 'My Post' && (
              <div className="space-y-2 sm:space-y-3">
                <div className="text-center mb-2 sm:mb-4">
                  <h2 className="text-lg sm:text-2xl font-bold text-green-800 mb-1">My Green Journey 🌱</h2>
                  <p className="text-green-600 text-xs sm:text-sm">Your eco-friendly achievements and experiences</p>
                </div>

                {myPostsData.length === 0 ? (
                  <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 text-center">
                    <div className="text-2xl sm:text-4xl mb-3">🌱</div>
                    <h3 className="text-base sm:text-lg font-semibold text-green-800 mb-2">No posts yet</h3>
                    <p className="text-gray-600 mb-3 text-xs sm:text-sm">Start sharing your eco-journey with the community!</p>
                    <button
                      onClick={() => handleSectionChange('New Post')}
                      className="px-3 sm:px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors text-xs sm:text-sm"
                    >
                      Create Your First Post
                    </button>
                  </div>
                ) : (
                  myPostsData.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-green-100 overflow-hidden group"
                    >
                      <div className="p-3 sm:p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-full flex items-center justify-center text-base sm:text-lg border border-green-100">
                              {post.userAvatar}
                            </div>
                            <div className="min-w-0 flex-1">
                              <h3 className="font-bold text-green-800 text-xs sm:text-sm truncate">{post.userName}</h3>
                              <p className="text-green-500 text-xs flex items-center gap-1">
                                <MdAccessTime className="w-2.5 h-2.5 sm:w-3 sm:h-3 flex-shrink-0" />
                                <span className="truncate">{post.timeAgo}</span>
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Challenge Info */}
                        <div className="flex flex-wrap gap-1 sm:gap-1.5 mb-2">
                          <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-teal-50 text-teal-700 text-xs font-medium rounded-full">
                            <FaLeaf className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                            <span className="truncate">{post.challengeCategory}</span>
                          </span>
                          <span className={`px-1.5 sm:px-2 py-0.5 text-xs font-medium rounded-full ${getDifficultyColor(post.difficulty)}`}>
                            {post.difficulty}
                          </span>
                          <span className="inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                            <MdStar className="w-2 h-2 sm:w-2.5 sm:h-2.5" />
                            +{post.greenPoints} pts
                          </span>
                        </div>

                        <h2 className="text-sm sm:text-base font-bold text-green-800 mb-1 sm:mb-2 leading-tight">{post.challenge}</h2>
                        <p className="text-gray-700 text-xs sm:text-sm leading-relaxed mb-2 line-clamp-3">{post.description}</p>
                      </div>

                      <div className="px-3 sm:px-4 py-2 sm:py-2.5 bg-green-25 border-t border-green-50">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 sm:space-x-4">
                            <button className="flex items-center space-x-1 px-1.5 sm:px-2 py-1 rounded hover:bg-green-50 text-green-600 transition-colors">
                              <MdThumbUp className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="text-xs font-medium">{post.upvotes}</span>
                            </button>
                            <button className="flex items-center space-x-1 px-1.5 sm:px-2 py-1 rounded hover:bg-blue-50 text-blue-600 transition-colors">
                              <MdComment className="w-3 h-3 sm:w-4 sm:h-4" />
                              <span className="text-xs font-medium">{post.comments}</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}

            {/* New Post Section */}
            {activeSection === 'New Post' && (
              <div className="space-y-3 sm:space-y-4">
                <div className="text-center mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-2xl font-bold text-green-800 mb-1 sm:mb-2">Share Your Green Journey 🌱</h2>
                  <p className="text-green-600 text-xs sm:text-sm">Choose a challenge and inspire others with your eco-friendly experiences!</p>
                </div>

                <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-4 sm:p-6 border border-green-100">
                  <div className="flex items-center gap-2 mb-3 sm:mb-4">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-green-50 rounded-full flex items-center justify-center text-base sm:text-lg border border-green-100">
                      🌱
                    </div>
                    <div>
                      <h3 className="font-bold text-green-800 text-xs sm:text-sm">Share your story</h3>
                      <p className="text-green-500 text-xs">Tell the community about your eco-journey</p>
                    </div>
                  </div>

                  <div className="space-y-3 sm:space-y-4">
                    <div>
                      <label className="block text-green-800 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">
                        Select a Challenge
                      </label>
                      <select
                        value={selectedChallenge}
                        onChange={(e) => setSelectedChallenge(e.target.value)}
                        className="w-full p-2 sm:p-3 rounded-lg border border-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white text-gray-700 text-xs sm:text-sm"
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
                      <label className="block text-green-800 font-semibold mb-1 sm:mb-2 text-xs sm:text-sm">
                        Share Your Experience
                      </label>
                      <textarea
                        value={newPost}
                        onChange={(e) => setNewPost(e.target.value)}
                        rows="4"
                        placeholder="Tell us about your eco-friendly journey! Share what you've done, how it felt, and inspire others to join the movement. 🌱✨"
                        className="w-full p-2 sm:p-3 rounded-lg border border-green-100 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 placeholder-green-300 text-gray-700 text-xs sm:text-sm leading-relaxed resize-none"
                      />
                      <p className="text-xs text-green-500 mt-1">
                        💡 Tip: Be specific about your actions and their impact to inspire others!
                      </p>
                    </div>

                    <div className="bg-green-25 rounded-lg p-3 sm:p-4 border border-green-100">
                      <h4 className="font-semibold text-green-800 mb-1 sm:mb-2 text-xs sm:text-sm">Community Guidelines 🌿</h4>
                      <ul className="text-xs text-green-600 space-y-1">
                        <li>• Select a challenge you're participating in</li>
                        <li>• Share authentic eco-friendly experiences</li>
                        <li>• Be encouraging and supportive to other members</li>
                        <li>• Focus on positive environmental impact</li>
                        <li>• Use emojis to make your post more engaging!</li>
                      </ul>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={handlePostSubmit}
                        disabled={!selectedChallenge || !newPost.trim()}
                        className={`px-4 sm:px-6 py-2 rounded-lg font-bold text-xs sm:text-sm transition-all duration-200 flex items-center gap-2 ${
                          selectedChallenge && newPost.trim()
                            ? 'bg-green-500 text-white hover:bg-green-600 shadow-md hover:shadow-lg transform hover:scale-105'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        <MdCreate className="w-3 h-3 sm:w-4 sm:h-4" />
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
