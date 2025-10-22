import { supabase } from '../config/supabaseClient.js';

// Insert new green points entry
export const insertUserGreenPoints = async (user_id, green_points = 0) => {
  const { data, error } = await supabase
    .from('user_green_points')
    .insert([{ user_id, green_points }])
    .select('*')
    .single();
  if (error) throw error;
  return data;
};

// Delete user green points entry
export const deleteUserGreenPoints = async (user_id) => {
  const { error } = await supabase
    .from('user_green_points')
    .delete()
    .eq('user_id', user_id);
  if (error) throw error;
  return true;
};

// Delete green points transaction
export const deleteGreenPointTransaction = async (transaction_id) => {
  const { error } = await supabase
    .from('green_point_transactions')
    .delete()
    .eq('id', transaction_id);
  if (error) throw error;
  return true;
};

// Adjust green points by change_amount and log transaction
export const adjustUserGreenPoints = async (user_id, change_amount, reason) => {
  // Get current balance or default 0 if not found
  let { data: userPoints, error: fetchError } = await supabase
    .from('user_green_points')
    .select('green_points')
    .eq('user_id', user_id)
    .single();

  if (fetchError && fetchError.code !== 'PGRST116') throw fetchError;

  const currentPoints = userPoints ? userPoints.green_points : 0;
  const new_balance = currentPoints + change_amount;

  if (userPoints) {
    // Update existing balance
    const { error: updateError } = await supabase
      .from('user_green_points')
      .update({ green_points: new_balance, updated_at: new Date().toISOString() })
      .eq('user_id', user_id);
    if (updateError) throw updateError;
  } else {
    // Insert new balance record
    const { error: insertError } = await supabase
      .from('user_green_points')
      .insert([{ user_id, green_points: new_balance, updated_at: new Date().toISOString() }]);
    if (insertError) throw insertError;
  }

  // Insert transaction
  const { data: txn, error: txnError } = await supabase
    .from('green_point_transactions')
    .insert([{ user_id, change_amount, new_balance, reason }])
    .select('*')
    .single();
  if (txnError) throw txnError;

  return { new_balance, transaction: txn };
};

export const getUserGreenPoints = async (user_id) => {
  const { data, error } = await supabase
    .from('user_green_points')
    .select('green_points')
    .eq('user_id', user_id)
    .single();

  if (error && error.code !== 'PGRST116') {
    throw error;
  }

  if (!data) throw new Error('User green points record not found');

  return data.green_points;
};



export const getUserGreenPointTransactions = async (user_id) => {
  const { data, error } = await supabase
    .from('green_point_transactions')
    .select('*')
    .eq('user_id', user_id)
    .order('created_at', { ascending: false });

  if (error) throw error;

  return data;
};


export const getUserProfileAndPoints = async (user_id) => {
  // Fetch user profile info
  const userRes = await supabase
    .from('users')
    .select('full_name, email')
    .eq('id', user_id)
    .single();

  if (userRes.error || !userRes.data) throw new Error('User not found');

  // Fetch current green points
  const pointsRes = await supabase
    .from('user_green_points')
    .select('green_points')
    .eq('user_id', user_id)
    .single();

  const green_points = pointsRes.data ? pointsRes.data.green_points : 0;

  return {
    full_name: userRes.data.full_name,
    email: userRes.data.email,
    green_points: green_points
  };
};



export const fetchAllUsersAndPoints = async () => {
  const { data, error } = await supabase
    .from('user_green_points')
    .select('user_id, green_points, users(full_name)')
    .order('green_points', { ascending: false });

  if (error) throw error;

  // Map for clean format
  return (data || []).map(e => ({
    user_id: e.user_id,
    name: e.users?.full_name || '',
    green_points: e.green_points
  }));
};