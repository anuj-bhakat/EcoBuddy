import jwt from 'jsonwebtoken';
import { supabase } from '../config/supabaseClient.js';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

export function authenticateRole(roles) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) return res.status(401).json({ error: 'Authorization header missing' });

      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      if (!roles.includes(decoded.role)) return res.status(403).json({ error: 'Permission denied' });

      req.user = decoded;
      next();
    } catch {
      res.status(401).json({ error: 'Invalid or expired token' });
    }
  };
}

// Middleware to check if logged-in user is creator
export async function authenticateCreator(req, res, next) {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const userId = req.user.id;
    const { data: creator } = await supabase
      .from('creators')
      .select('user_id')
      .eq('user_id', userId)
      .single();

    if (!creator) return res.status(403).json({ error: 'Only creators allowed' });

    next();
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
}
