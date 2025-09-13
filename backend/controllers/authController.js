import { supabase } from '../config/supabaseClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function generateToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
}

export const signup = async (req, res) => {
  const { full_name, email, password, role } = req.body;
  if (!full_name || !email || !password || !role) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  if (!['user', 'creator', 'admin'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', email)
      .single();

    if (existingUser) return res.status(400).json({ error: 'Email already registered' });

    const password_hash = await bcrypt.hash(password, 10);
    const { data, error } = await supabase
      .from('users')
      .insert([{ full_name, email, password_hash, role }])
      .select('id, full_name, email, role')
      .single();

    if (error) throw error;

    const token = generateToken(data);
    res.status(201).json({ user: data, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });

  try {
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (!user || error) return res.status(400).json({ error: 'Invalid email or password' });

    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) return res.status(400).json({ error: 'Invalid email or password' });

    const token = generateToken(user);
    res.json({ user: { id: user.id, full_name: user.full_name, email: user.email, role: user.role }, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
};
