import { supabase } from '../config/supabaseClient.js';

// Insert a post
export const addPost = async (post) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([post])
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// Update a post
export const updatePost = async (id, updates) => {
  const { data, error } = await supabase
    .from('posts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data;
};

// Delete a post
export const deletePost = async (id) => {
  const { error } = await supabase
    .from('posts')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
  return true;
};

// Get all posts
export const getAllPosts = async () => {
  const { data, error } = await supabase.from('posts').select('*');
  if (error) throw new Error(error.message);
  return data;
};

// Get posts by user id (via challenge_submissions)
export const getPostsByUserId = async (user_id) => {
  // Directly fetch by user_id now:
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('user_id', user_id);
  if (error) throw new Error(error.message);
  return data;
};

// Get single post
export const getPostById = async (id) => {
  const { data, error } = await supabase.from('posts').select('*').eq('id', id).single();
  if (error) throw new Error(error.message);
  return data;
};

// Like/Dislike logic
export const likeDislikePost = async (post_id, user_id, action) => {
  const post = await getPostById(post_id);
  let likes = post.likes || [];
  let dislikes = post.dislikes || [];

  if (action === 'like') {
    if (likes.includes(user_id)) {
      // If already liked, remove from likes
      likes = likes.filter(uuid => uuid !== user_id);
    } else {
      // Remove from dislikes if present, add to likes
      dislikes = dislikes.filter(uuid => uuid !== user_id);
      likes = [...likes, user_id];
    }
  } else if (action === 'dislike') {
    if (dislikes.includes(user_id)) {
      // If already disliked, remove from dislikes
      dislikes = dislikes.filter(uuid => uuid !== user_id);
    } else {
      // Remove from likes if present, add to dislikes
      likes = likes.filter(uuid => uuid !== user_id);
      dislikes = [...dislikes, user_id];
    }
  }
  // Uniqueness guaranteed
  const { data, error } = await supabase
    .from('posts')
    .update({ likes, dislikes, updated_at: new Date().toISOString() })
    .eq('id', post_id)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data;
};
