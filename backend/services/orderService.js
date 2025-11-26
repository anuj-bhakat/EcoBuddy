import { supabase } from '../config/supabaseClient.js';

export const addOrder = async (order) => {
  const { data, error } = await supabase
    .from('orders')
    .insert([order])
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const updateOrder = async (id, updates) => {
  const { data, error } = await supabase
    .from('orders')
    .update(updates)
    .eq('id', id)
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const deleteOrder = async (id) => {
  const { error } = await supabase
    .from('orders')
    .delete()
    .eq('id', id);
  if (error) throw new Error(error.message);
  return true;
};

export const getOrderById = async (id) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw new Error(error.message);
  return data;
};

export const getOrdersByUserId = async (user_id) => {
  const { data, error } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user_id);
  if (error) throw new Error(error.message);
  return data;
};
