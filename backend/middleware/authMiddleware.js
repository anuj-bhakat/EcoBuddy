import jwt from 'jsonwebtoken';
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
