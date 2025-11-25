import * as challengeSubmissionService from '../services/challengeSubmissionService.js';

export const createSubmission = async (req, res) => {
  try {
    const { challenge_id, user_id, text_submission } = req.body;
    // images: req.files.images (array), video: req.files.video (array possibly one file)
    const imageFiles = req.files.images || [];
    const videoFile = req.files.video ? req.files.video[0] : null;
    const submission = await challengeSubmissionService.insertSubmission({
      challenge_id, user_id, text_submission, imageFiles, videoFile
    });
    res.status(201).json(submission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    const { text_submission, status, green_points } = req.body;
    const imageFiles = req.files.images || undefined;
    const videoFile = req.files.video ? req.files.video[0] : undefined;
    const updated = await challengeSubmissionService.updateSubmission(
      id,
      { text_submission, imageFiles, videoFile, status, green_points }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSubmissionById = async (req, res) => {
  try {
    const { id } = req.params;
    const data = await challengeSubmissionService.getSubmissionById(id);
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: error.message || "Not found" });
  }
};

export const getSubmissionsByChallengeId = async (req, res) => {
  try {
    const { challenge_id } = req.params;
    const data = await challengeSubmissionService.getSubmissionsByChallengeId(challenge_id);
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: error.message || "Not found" });
  }
};

export const getSubmissionsByUserId = async (req, res) => {
  try {
    const { user_id } = req.params;
    const data = await challengeSubmissionService.getSubmissionsByUserId(user_id);
    res.json(data);
  } catch (error) {
    res.status(404).json({ error: error.message || "Not found" });
  }
};

export const deleteSubmission = async (req, res) => {
  try {
    const { id } = req.params;
    await challengeSubmissionService.deleteSubmission(id);
    res.json({ message: "Submission deleted" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
