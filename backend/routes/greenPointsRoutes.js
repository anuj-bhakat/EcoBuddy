import express from 'express';
import {
  insertGreenPoints,
  deleteGreenPoints,
  deleteTransaction,
  adjustGreenPoints,
  fetchGreenPoints,
  fetchGreenPointTransactions,
  fetchUserProfileAndPoints,
  getAllUsersAndPoints
} from '../controllers/greenPointsController.js';

const router = express.Router();

router.post('/user/add', insertGreenPoints);
router.delete('/user/delete', deleteGreenPoints);
router.put('/user/adjust', adjustGreenPoints);
router.get('/user/:user_id', fetchGreenPoints);
router.get('/user-profile/:user_id', fetchUserProfileAndPoints);

router.get('/users/all', getAllUsersAndPoints);

router.get('/transactions/:user_id', fetchGreenPointTransactions);
router.delete('/transaction/delete', deleteTransaction);

export default router;
