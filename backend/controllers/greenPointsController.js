import {
  insertUserGreenPoints,
  deleteUserGreenPoints,
  deleteGreenPointTransaction,
  adjustUserGreenPoints,
  getUserGreenPoints,
  getUserGreenPointTransactions,
  getUserProfileAndPoints,
  fetchAllUsersAndPoints
} from '../services/greenPointsService.js';

// Create green points for user
export const insertGreenPoints = async (req, res) => {
  try {
    const { user_id, green_points } = req.body;
    const data = await insertUserGreenPoints(user_id, green_points);
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete green points for user
export const deleteGreenPoints = async (req, res) => {
  try {
    const { user_id } = req.body;
    await deleteUserGreenPoints(user_id);
    res.json({ message: 'Deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a green point transaction
export const deleteTransaction = async (req, res) => {
  try {
    const { transaction_id } = req.body;
    await deleteGreenPointTransaction(transaction_id);
    res.json({ message: 'Transaction deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const adjustGreenPoints = async (req, res) => {
  try {
    const { user_id, change_amount, reason } = req.body;

    if (typeof change_amount !== 'number' || !reason) {
      throw new Error('Invalid input: change_amount must be number and reason is required');
    }

    const result = await adjustUserGreenPoints(user_id, change_amount, reason);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const fetchGreenPoints = async (req, res) => {
  try {
    const { user_id } = req.params;
    if (!user_id) return res.status(400).json({ error: 'user_id is required' });
    const green_points = await getUserGreenPoints(user_id);
    res.json({ user_id, green_points });
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};


export const fetchGreenPointTransactions = async (req, res) => {
  try {
    const { user_id } = req.params;
    const transactions = await getUserGreenPointTransactions(user_id);
    res.json({ user_id, transactions });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const fetchUserProfileAndPoints = async (req, res) => {
  try {
    const { user_id } = req.params; // Get user_id from URL params
    if (!user_id) return res.status(400).json({ error: 'user_id is required' });
    
    const data = await getUserProfileAndPoints(user_id);
    res.json(data);
  } catch (error) {
    // Better to specify 404 if user-specific data missing
    res.status(404).json({ error: error.message });
  }
};


export const getAllUsersAndPoints = async (req, res) => {
  try {
    const users = await fetchAllUsersAndPoints();
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};