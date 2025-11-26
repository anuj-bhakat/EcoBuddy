import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import {
  MdThumbUp, MdThumbDown, MdComment, MdPerson,
  MdArrowBack, MdCheckCircle, MdAccessTime, MdStar,
  MdRssFeed, MdAccountCircle, MdCreate, MdDelete
} from 'react-icons/md';
import { FaLeaf } from 'react-icons/fa';

const baseUrl = import.meta.env.VITE_API_BASE_URL;


export default function Community() {
  const [activeSection, setActiveSection] = useState('Feed');
  const [newPost, setNewPost] = useState('');
  const [selectedChallenge, setSelectedChallenge] = useState('');
  const [likedPosts, setLikedPosts] = useState(new Set());
  const [dislikedPosts, setDislikedPosts] = useState(new Set());
  const [challenges, setChallenges] = useState([]);
  const [challengesLoading, setChallengesLoading] = useState(false);
  const [challengesError, setChallengesError] = useState(null);
  const [posts, setPosts] = useState([]);
  const [postsLoading, setPostsLoading] = useState(false);
  const [postsError, setPostsError] = useState(null);
  const [myPosts, setMyPosts] = useState([]);
  const [myPostsLoading, setMyPostsLoading] = useState(false);
  const [myPostsError, setMyPostsError] = useState(null);
  const [postSubmitMessage, setPostSubmitMessage] = useState(null);
  const [postSubmitError, setPostSubmitError] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [postCreated, setPostCreated] = useState(false);
  const [postSubmitting, setPostSubmitting] = useState(false);

  const handleSectionChange = (section) => {
    setActiveSection(section);
    // Clear messages when switching sections
    setPostSubmitMessage(null);
    setPostSubmitError(null);
    setDeleteMessage(null);
    setDeleteError(null);
    setPostCreated(false);
    setPostSubmitting(false);
  };

  const handlePostAnother = () => {
    setPostCreated(false);
    setNewPost('');
    setSelectedChallenge('');
    setPostSubmitMessage(null);
    setPostSubmitError(null);
    setPostSubmitting(false);
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

  // Fetch all posts for community feed
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setPostsLoading(true);
        setPostsError(null);

        const response = await fetch(`${baseUrl}/posts`);
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status}`);
        }

        const data = await response.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPostsError(error.message);
        setPosts([]);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  // Fetch user's posts
  useEffect(() => {
    const fetchMyPosts = async () => {
      try {
        const userId = localStorage.getItem("user_id");
        if (!userId) {
          setMyPostsError("User not authenticated");
          return;
        }

        setMyPostsLoading(true);
        setMyPostsError(null);

        const response = await fetch(`${baseUrl}/posts/user/${userId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch my posts: ${response.status}`);
        }

        const data = await response.json();
        setMyPosts(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching my posts:", error);
        setMyPostsError(error.message);
        setMyPosts([]);
      } finally {
        setMyPostsLoading(false);
      }
    };

    fetchMyPosts();
  }, []);

  const handlePostSubmit = async () => {
    if (!selectedChallenge || !newPost.trim()) {
      setPostSubmitError('Please select a challenge and write your post.');
      setPostSubmitMessage(null);
      return;
    }

    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        setPostSubmitError("User not authenticated. Please log in again.");
        setPostSubmitMessage(null);
        return;
      }

      // Find the selected challenge to get its ID
      const selectedChallengeObj = challenges.find(c => c.title === selectedChallenge);
      if (!selectedChallengeObj) {
        setPostSubmitError("Selected challenge not found.");
        setPostSubmitMessage(null);
        return;
      }

      setPostSubmitError(null);
      setPostSubmitMessage(null);
      setPostSubmitting(true);

      const response = await fetch(`${baseUrl}/posts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          challenge_id: selectedChallengeObj.challenge_id,
          experience: newPost.trim()
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to create post: ${response.status}`);
      }

      const newPostData = await response.json();
      console.log('Post created successfully:', newPostData);

      // Refresh posts and my posts
      // Re-fetch posts
      const postsResponse = await fetch(`${baseUrl}/posts`);
      if (postsResponse.ok) {
        const postsData = await postsResponse.json();
        setPosts(Array.isArray(postsData) ? postsData : []);
      }

      // Re-fetch my posts
      const myPostsResponse = await fetch(`${baseUrl}/posts/user/${userId}`);
      if (myPostsResponse.ok) {
        const myPostsData = await myPostsResponse.json();
        setMyPosts(Array.isArray(myPostsData) ? myPostsData : []);
      }

      // Reset form and show success state
      setNewPost('');
      setSelectedChallenge('');
      setPostSubmitMessage(null);
      setPostSubmitError(null);
      setPostCreated(true);
    } catch (error) {
      console.error('Error creating post:', error);
      setPostSubmitError(`Failed to create post: ${error.message}`);
      setPostSubmitMessage(null);
    } finally {
      setPostSubmitting(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        alert("User not authenticated. Please log in again.");
        return;
      }

      const response = await fetch(`${baseUrl}/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          action: "like"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to like post: ${response.status}`);
      }

      const updatedPost = await response.json();

      // Update local state to reflect the change
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.post_id === postId
            ? { ...post, likes_count: updatedPost.likes.length, likes: updatedPost.likes, dislikes_count: updatedPost.dislikes.length, dislikes: updatedPost.dislikes }
            : post
        )
      );

      setMyPosts(prevPosts =>
        prevPosts.map(post =>
          post.post_id === postId
            ? { ...post, likes_count: updatedPost.likes.length, likes: updatedPost.likes, dislikes_count: updatedPost.dislikes.length, dislikes: updatedPost.dislikes }
            : post
        )
      );

    } catch (error) {
      console.error('Error liking post:', error);
      alert(`Failed to like post: ${error.message}`);
    }
  };

  const handleDislike = async (postId) => {
    try {
      const userId = localStorage.getItem("user_id");
      if (!userId) {
        alert("User not authenticated. Please log in again.");
        return;
      }

      const response = await fetch(`${baseUrl}/posts/${postId}/dislike`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          action: "dislike"
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to dislike post: ${response.status}`);
      }

      const updatedPost = await response.json();

      // Update local state to reflect the change
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.post_id === postId
            ? { ...post, likes_count: updatedPost.likes.length, likes: updatedPost.likes, dislikes_count: updatedPost.dislikes.length, dislikes: updatedPost.dislikes }
            : post
        )
      );

      setMyPosts(prevPosts =>
        prevPosts.map(post =>
          post.post_id === postId
            ? { ...post, likes_count: updatedPost.likes.length, likes: updatedPost.likes, dislikes_count: updatedPost.dislikes.length, dislikes: updatedPost.dislikes }
            : post
        )
      );

    } catch (error) {
      console.error('Error disliking post:', error);
      alert(`Failed to dislike post: ${error.message}`);
    }
  };

  const handleDeletePost = async (postId) => {
    // Confirmation dialog
    if (!window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      return;
    }

    try {
      setDeleteError(null);
      setDeleteMessage(null);

      const response = await fetch(`${baseUrl}/posts/${postId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to delete post: ${response.status}`);
      }

      // Remove post from local state
      setPosts(prevPosts => prevPosts.filter(post => post.post_id !== postId));
      setMyPosts(prevPosts => prevPosts.filter(post => post.post_id !== postId));

      setDeleteMessage('Post deleted successfully!');
      setDeleteError(null);
    } catch (error) {
      console.error('Error deleting post:', error);
      setDeleteError(`Failed to delete post: ${error.message}`);
      setDeleteMessage(null);
    }
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

                {postsLoading ? (
                  // Loading state
                  Array.from({ length: 3 }).map((_, index) => (
                    <article key={index} className="bg-white rounded-lg shadow-sm border border-green-200 overflow-hidden animate-pulse">
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                          </div>
                        </div>
                        <div className="flex gap-2 mb-3">
                          <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-16 bg-gray-200 rounded mb-3"></div>
                        <div className="flex items-center gap-2">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 border-t border-green-100">
                        <div className="flex items-center gap-4">
                          <div className="h-8 bg-gray-200 rounded w-16"></div>
                          <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : postsError ? (
                  // Error state
                  <div className="text-center py-12">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Failed to load posts</h3>
                    <p className="text-gray-500 mb-4">{postsError}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : posts.length === 0 ? (
                  // No posts state
                  <div className="text-center py-12">
                    <div className="text-4xl mb-4">🌱</div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No posts yet</h3>
                    <p className="text-gray-500 mb-4">Be the first to share your eco-journey!</p>
                    <button
                      onClick={() => handleSectionChange('New Post')}
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Create First Post
                    </button>
                  </div>
                ) : (
                  posts.map((post) => (
                    <article
                      key={post.post_id}
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
                            <h3 className="font-semibold text-green-900 truncate">{post.user?.full_name || 'Anonymous'}</h3>
                            <p className="text-green-600 text-sm flex items-center gap-1">
                              <MdAccessTime className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{new Date(post.created_at).toLocaleDateString()}</span>
                            </p>
                          </div>
                        </div>

                        {/* Challenge Badges Row */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            {post.challenge?.category || 'General'}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getDifficultyColor(post.challenge?.difficulty || 'Medium')}`}>
                            {post.challenge?.difficulty || 'Medium'}
                          </span>
                          {/* <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full font-semibold ml-auto">
                            +{post.green_points_awarded || 0} pts
                          </span> */}
                        </div>

                        {/* Challenge Title */}
                        <h2 className="text-lg font-bold text-green-900 mb-2">
                          {post.challenge?.title || 'Challenge Post'}
                        </h2>

                        {/* Post Description */}
                        <p className="text-gray-700 leading-relaxed mb-3">
                          {post.experience}
                        </p>

                        {/* Status */}
                        <div className="flex items-center gap-2">
                          {getStatusIcon(post.status)}
                          <span className="text-sm text-green-700 capitalize">{post.status || 'posted'}</span>
                        </div>
                      </div>

                      {/* Post Actions */}
                      <div className="px-4 py-3 bg-gray-50 border-t border-green-100">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => handleLike(post.post_id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                              post.likes?.includes(localStorage.getItem("user_id"))
                                ? 'bg-green-100 text-green-800'
                                : 'hover:bg-green-50 text-green-700'
                            }`}
                          >
                            <MdThumbUp className={`w-5 h-5 ${post.likes?.includes(localStorage.getItem("user_id")) ? 'fill-current' : ''}`} />
                            <span>{post.likes_count || 0}</span>
                          </button>

                          <button
                            onClick={() => handleDislike(post.post_id)}
                            className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                              post.dislikes?.includes(localStorage.getItem("user_id"))
                                ? 'bg-red-100 text-red-800'
                                : 'hover:bg-red-50 text-red-700'
                            }`}
                          >
                            <MdThumbDown className={`w-5 h-5 ${post.dislikes?.includes(localStorage.getItem("user_id")) ? 'fill-current' : ''}`} />
                            <span>{post.dislikes_count || 0}</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}

            {/* My Posts Section */}
            {activeSection === 'My Post' && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-green-900 mb-4">My Posts</h2>

                {/* Delete Messages */}
                {deleteMessage && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-green-600 font-medium">✓</span>
                      <span className="text-green-800">{deleteMessage}</span>
                    </div>
                  </div>
                )}

                {deleteError && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <span className="text-red-600 font-medium">⚠</span>
                      <span className="text-red-800">{deleteError}</span>
                    </div>
                  </div>
                )}

                {myPostsLoading ? (
                  // Loading state
                  Array.from({ length: 2 }).map((_, index) => (
                    <article key={index} className="bg-white rounded-lg shadow-sm border border-green-200 overflow-hidden animate-pulse">
                      <div className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded mb-1"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                          </div>
                        </div>
                        <div className="flex gap-2 mb-3">
                          <div className="h-5 bg-gray-200 rounded-full w-20"></div>
                          <div className="h-5 bg-gray-200 rounded-full w-16"></div>
                        </div>
                        <div className="h-6 bg-gray-200 rounded mb-2"></div>
                        <div className="h-16 bg-gray-200 rounded mb-3"></div>
                        <div className="flex items-center gap-2">
                          <div className="h-4 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                      <div className="px-4 py-3 bg-gray-50 border-t border-green-100">
                        <div className="flex items-center gap-4">
                          <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </div>
                      </div>
                    </article>
                  ))
                ) : myPostsError ? (
                  // Error state
                  <div className="text-center py-12">
                    <div className="text-red-500 text-4xl mb-4">⚠️</div>
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">Failed to load your posts</h3>
                    <p className="text-gray-500 mb-4">{myPostsError}</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : myPosts.length === 0 ? (
                  // No posts state
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
                  myPosts.map((post) => (
                    <article
                      key={post.post_id}
                      className="bg-white rounded-lg shadow-sm border border-green-200 overflow-hidden"
                    >
                      <div className="p-4">
                        {/* User Info Row */}
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                            <MdPerson className="w-4 h-4 text-green-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-semibold text-green-900 truncate">{post.user?.full_name || 'You'}</h3>
                            <p className="text-green-600 text-sm flex items-center gap-1">
                              <MdAccessTime className="w-3 h-3 flex-shrink-0" />
                              <span className="truncate">{new Date(post.created_at).toLocaleDateString()}</span>
                            </p>
                          </div>
                        </div>

                        {/* Challenge Badges Row */}
                        <div className="flex flex-wrap items-center gap-2 mb-3">
                          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                            {post.challenge?.category || 'General'}
                          </span>
                          <span className={`px-2 py-1 text-xs rounded-full font-medium ${getDifficultyColor(post.challenge?.difficulty || 'Medium')}`}>
                            {post.challenge?.difficulty || 'Medium'}
                          </span>
                          <span className="px-2 py-1 bg-green-600 text-white text-xs rounded-full font-semibold ml-auto">
                            +{post.green_points_awarded || 0} pts
                          </span>
                        </div>

                        {/* Challenge Title */}
                        <h2 className="text-lg font-bold text-green-900 mb-2">{post.challenge?.title || 'Challenge Post'}</h2>

                        {/* Post Description */}
                        <p className="text-gray-700 leading-relaxed mb-3">{post.experience}</p>

                        {/* Status */}
                        <div className="flex items-center gap-2">
                          {getStatusIcon(post.status)}
                          <span className="text-sm text-green-700 capitalize">{post.status || 'posted'}</span>
                        </div>
                      </div>

                      <div className="px-4 py-3 bg-gray-50 border-t border-green-100">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 text-green-700">
                              <MdThumbUp className="w-5 h-5" />
                              <span>{post.likes_count || 0}</span>
                            </button>
                            <button className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 text-green-700">
                              <MdThumbDown className="w-5 h-5" />
                              <span>{post.dislikes_count || 0}</span>
                            </button>
                          </div>
                          <button
                            onClick={() => handleDeletePost(post.post_id)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 transition-colors"
                            title="Delete post"
                          >
                            <MdDelete className="w-5 h-5" />
                            <span className="hidden sm:inline">Delete</span>
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
                  {postCreated ? (
                    /* Success State */
                    <div className="text-center py-8">
                      <div className="mb-6">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-3xl">🌱</span>
                        </div>
                        <h3 className="text-2xl font-bold text-green-900 mb-2">Post Created Successfully!</h3>
                        <p className="text-green-700">Your eco-journey story has been shared with the community.</p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                        <button
                          onClick={handlePostAnother}
                          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                        >
                          <MdCreate className="w-5 h-5" />
                          Share Another Story
                        </button>
                        <button
                          onClick={() => handleSectionChange('Feed')}
                          className="px-6 py-3 bg-white border border-green-300 text-green-700 font-semibold rounded-lg hover:bg-green-50 transition-colors"
                        >
                          View Community Feed
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Form State */
                    <>
                      <div className="mb-6">
                        <h3 className="text-lg font-semibold text-green-900 mb-2">Share Your Eco-Journey</h3>
                        <p className="text-green-700">Tell the community about your environmental actions and inspire others!</p>
                      </div>

                      {/* Error Messages */}
                      {postSubmitError && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                          <div className="flex items-center gap-2">
                            <span className="text-red-600 font-medium">⚠</span>
                            <span className="text-red-800">{postSubmitError}</span>
                          </div>
                        </div>
                      )}

                      <div className="space-y-6">
                        <div>
                          <label className="block font-medium text-green-900 mb-2">
                            Which challenge are you sharing about?
                          </label>
                          <select
                             value={selectedChallenge}
                             onChange={(e) => {
                               setSelectedChallenge(e.target.value);
                               setPostSubmitError(null);
                             }}
                             className="w-full border border-green-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white text-green-900"
                             disabled={challengesLoading}
                           >
                             <option value="">
                               {challengesLoading ? "Loading challenges..." : challengesError ? "Failed to load challenges" : "Choose a challenge..."}
                             </option>
                             {challenges.map((challenge) => (
                               <option key={challenge.challenge_id || challenge.submission_id} value={challenge.title}>
                                 {challenge.title}
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
                             onChange={(e) => {
                               setNewPost(e.target.value);
                               setPostSubmitError(null);
                             }}
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
                             disabled={!selectedChallenge || !newPost.trim() || postSubmitting}
                             className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                               selectedChallenge && newPost.trim() && !postSubmitting
                                 ? 'bg-green-600 text-white hover:bg-green-700'
                                 : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                             }`}
                           >
                             {postSubmitting ? (
                               <>
                                 <svg
                                   className="animate-spin h-5 w-5 text-gray-500"
                                   viewBox="0 0 24 24"
                                   fill="none"
                                   xmlns="http://www.w3.org/2000/svg"
                                 >
                                   <circle
                                     className="opacity-25"
                                     cx="12"
                                     cy="12"
                                     r="10"
                                     stroke="currentColor"
                                     strokeWidth="4"
                                   />
                                   <path
                                     className="opacity-75"
                                     fill="currentColor"
                                     d="M4 12a8 8 0 018-8v8z"
                                   />
                                 </svg>
                                 Sharing...
                               </>
                             ) : (
                               <>
                                 <MdCreate className="w-5 h-5" />
                                 Share My Story
                               </>
                             )}
                           </button>
                         </div>
                       </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
