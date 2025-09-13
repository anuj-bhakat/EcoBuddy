import { supabase } from '../config/supabaseClient.js';

export const promoteToCreatorService = async (user_id) => {
  if (!user_id) throw new Error('user_id required');

  const { data: user } = await supabase
    .from('users')
    .select('id')
    .eq('id', user_id)
    .single();

  if (!user) throw new Error('User not found');

  const { data: existingCreator } = await supabase.from('creators').select('id').eq('user_id', user_id).single();
  if (existingCreator) throw new Error('User is already a creator');

  const { data, error } = await supabase.from('creators').insert([{ user_id }]).single();
  if (error) throw error;

  return data;
};

export const demoteCreatorService = async (user_id) => {
  if (!user_id) throw new Error('user_id required');

  const { data: existingCreator } = await supabase
    .from('creators')
    .select('id')
    .eq('user_id', user_id)
    .single();

  if (!existingCreator) throw new Error('User is not a creator');

  // Delete creator record
  const { error } = await supabase.from('creators').delete().eq('user_id', user_id);
  if (error) throw error;

  return true;
};
