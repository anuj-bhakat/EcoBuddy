import express from 'express';
import multer from 'multer';
import * as challengeSubmissionController from '../controllers/challengeSubmissionController.js';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 95 * 1024 * 1024
  }
});
const router = express.Router();

router.post('/', upload.fields([{ name: 'images', maxCount: 10 }, { name: 'video', maxCount: 1 }]),
  challengeSubmissionController.createSubmission
);

router.put('/:id', upload.fields([{ name: 'images', maxCount: 10 }, { name: 'video', maxCount: 1 }]),
  challengeSubmissionController.updateSubmission
);

router.get('/by-challenge/:challenge_id', challengeSubmissionController.getSubmissionsByChallengeId);
router.get('/by-user/:user_id', challengeSubmissionController.getSubmissionsByUserId);
router.get('/:id', challengeSubmissionController.getSubmissionById);

router.delete('/:id', challengeSubmissionController.deleteSubmission);

export default router;
