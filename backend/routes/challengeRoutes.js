import express from 'express';
import * as challengeController from '../controllers/challengeController.js';
import multer from 'multer';
import { challengeStatusMiddleware } from '../middlewares/autoChallengeStatus.js';

const storage = multer.memoryStorage();
const upload = multer({ storage });

const router = express.Router();

router.use(challengeStatusMiddleware);

router.post('/', upload.array('images', 10), challengeController.createChallenge);
router.put('/:id', upload.fields([{ name: 'images', maxCount: 10 }]), challengeController.updateChallenge);

router.delete('/:id', challengeController.deleteChallenge);

router.post('/:id/register', challengeController.registerUser);
router.post('/:id/unregister', challengeController.unregisterUser);

router.post('/:id/participate', challengeController.addParticipant);
router.post('/:id/remove-participant', challengeController.removeParticipant);

router.get('/:id/users', challengeController.getChallengeUsers);
router.get('/', challengeController.getAllChallenges);
router.get('/:id/detail', challengeController.getChallengeDetail);
router.get('/creator/:creator_id', challengeController.getChallengesByCreator);


// GET: View all user's ongoing & completed challenges with details
router.get('/user/:user_id', challengeController.getUserChallenges);


export default router;
