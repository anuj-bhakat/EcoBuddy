import express from 'express';
import { authenticateRole, authenticateCreator } from '../middlewares/authMiddleware.js';
import { promoteToCreator, demoteCreator } from '../controllers/creatorController.js';

const router = express.Router();

// Promote user to creator - restrict to admin role
router.post('/promote', authenticateRole(['admin']), promoteToCreator);

// Demote creator to user - admin only
router.post('/demote', authenticateRole(['admin']), demoteCreator);

// Example creator-only route
router.post('/create-challenge', authenticateRole(['creator']), authenticateCreator, (req, res) => {
  res.json({ message: 'Challenge created by creator' });
});

export default router;
