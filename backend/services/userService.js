import { supabase } from '../config/supabaseClient.js';

export const getUserById = async (id) => {
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, email, created_at, updated_at')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const getUsersByIds = async (ids) => {
  if (!ids || !ids.length) return [];
  const { data, error } = await supabase
    .from('users')
    .select('id, full_name, email, created_at, updated_at')
    .in('id', ids);
  if (error) throw new Error(error.message);
  return data;
};