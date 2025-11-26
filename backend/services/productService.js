import { supabase } from '../config/supabaseClient.js';

export const addProduct = async (product) => {
  const { data, error } = await supabase
    .from('products')
    .insert([product])
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateProduct = async (id, updates) => {
  const { data, error } = await supabase
    .from('products')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteProduct = async (id) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
  return true;
};

export const getAllProducts = async () => {
  const { data, error } = await supabase.from('products').select('*');
  if (error) throw new Error(error.message);
  return data;
};

export const getProductById = async (id) => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const getAvailableProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('is_available', true);
  if (error) throw new Error(error.message);
  return data;
};

// Get product + creator + user info by product ID
export const getProductWithCreatorAndUser = async (product_id) => {
  // Get product
  const { data: product, error: productError } = await supabase
    .from('products')
    .select('*')
    .eq('id', product_id)
    .single();
  if (productError) throw new Error(productError.message);
  if (!product) throw new Error('Product not found');

  // Get creator
  const { data: creator, error: creatorError } = await supabase
    .from('creators')
    .select('*')
    .eq('id', product.listed_by)
    .single();
  if (creatorError) throw new Error('Creator not found');
  if (!creator) throw new Error('Creator not found');

  // Get user
  const { data: user, error: userError } = await supabase
    .from('users')
    .select('id, full_name, email, created_at, updated_at')
    .eq('id', creator.user_id)
    .single();
  if (userError) throw new Error('User not found');
  if (!user) throw new Error('User not found');

  return {
    ...product,
    creator: {
      id: creator.id,
      user_id: creator.user_id,
      created_at: creator.created_at,
      user
    }
  };
};



export const getProductsByIds = async (ids) => {
  if (!ids || !ids.length) return [];
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('id', ids);
  if (error) throw new Error(error.message);
  return data;
};