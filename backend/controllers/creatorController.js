import { promoteToCreatorService } from '../services/creatorService.js';
import { demoteCreatorService } from '../services/creatorService.js';

export const promoteToCreator = async (req, res) => {
  try {
    const { user_id } = req.body;
    const data = await promoteToCreatorService(user_id);
    res.json({ message: 'User promoted to creator', creator: data });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const demoteCreator = async (req, res) => {
  try {
    const { user_id } = req.body;
    await demoteCreatorService(user_id);
    res.json({ message: 'User demoted from creator' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};