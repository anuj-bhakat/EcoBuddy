import * as postService from '../services/postService.js';
import * as challengeService from '../services/challengeService.js';
import * as userService from '../services/userService.js';

// Insert Post
export const addPost = async (req, res) => {
  try {
    const { user_id, challenge_id, experience } = req.body;
    if (!user_id || !challenge_id || !experience) {
      return res.status(400).json({ error: "user_id, challenge_id, and experience required" });
    }
    const post = await postService.addPost({ user_id, challenge_id, experience });
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update Post
export const updatePost = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const post = await postService.updatePost(id, updates);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete Post
export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    await postService.deletePost(id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get All Posts (hydrated)
export const getAllPosts = async (req, res) => {
  try {
    const posts = await postService.getAllPosts();
    res.json(await hydratePosts(posts));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get posts by user (hydrated)
export const getPostsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const posts = await postService.getPostsByUserId(user_id);
    res.json(await hydratePosts(posts, user_id));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Like/Dislike for a post
export const likeDislike = async (req, res) => {
  try {
    const { post_id } = req.params;
    const { user_id, action } = req.body;
    if (!user_id || !post_id || !['like','dislike'].includes(action)) {
      return res.status(400).json({ error: "post_id, user_id, and action ('like'|'dislike') required" });
    }
    const post = await postService.likeDislikePost(post_id, user_id, action);
    res.json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Hydration helper: enrich with challenge title, etc.
// Hydrate helper: You can enrich with the post user info as well
const hydratePosts = async (posts, lookup_user_id) => {
  const userIds = [...new Set(posts.map(p => p.user_id))];
  const users = await userService.getUsersByIds(userIds || []);
  const challengeIds = [...new Set(posts.map(p => p.challenge_id))];
  const challenges = await challengeService.getChallengesByIds(challengeIds);

  return Promise.all(posts.map(async post => {
    const user = users.find(u => u.id === post.user_id) || {};
    const challenge = challenges.find(c => c.id === post.challenge_id) || {};
    let submission = null, submission_status = "registered", green_points_awarded = null;
    if (lookup_user_id) {
      submission = await challengeService.getSubmissionForUserAndChallenge(lookup_user_id, post.challenge_id);
      if (submission) {
        if (submission.status === 'accepted') submission_status = "completed";
        else if (submission.status === 'submitted') submission_status = "ongoing";
        else submission_status = "registered";
        green_points_awarded = submission.green_points || null;
      }
    }
    return {
      post_id: post.id,
      user: {
        id: user.id,
        full_name: user.full_name,
        email: user.email,
        created_at: user.created_at,
        updated_at: user.updated_at
      },
      experience: post.experience,
      created_at: post.created_at,
      updated_at: post.updated_at,
      challenge: {
        id: challenge.id,
        title: challenge.title,
        category: challenge.category,
        difficulty: challenge.difficulty
      },
      status: submission_status,
      green_points_awarded,
      likes_count: post.likes ? post.likes.length : 0,
      likes: post.likes || [],
      dislikes_count: post.dislikes ? post.dislikes.length : 0,
      dislikes: post.dislikes || []
    };
  }));
};