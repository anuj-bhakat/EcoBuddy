import * as challengeService from '../services/challengeService.js';

export const createChallenge = async (req, res) => {
  try {
    const challengeData = req.body;
    const imageFiles = req.files;
    const challenge = await challengeService.createChallenge(challengeData, imageFiles);
    res.status(201).json(challenge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const newImageFiles = req.files.images || [];
    const existingImageUrls = req.body.existingImageUrls ? JSON.parse(req.body.existingImageUrls) : [];

    const updatedChallenge = await challengeService.updateChallenge(
      id,
      updateData,
      newImageFiles,
      existingImageUrls
    );

    res.json(updatedChallenge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const deleteChallenge = async (req, res) => {
  try {
    const { id } = req.params;
    await challengeService.deleteChallenge(id);
    res.json({ message: 'Challenge deleted' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const registerUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    await challengeService.registerUser(id, user_id);
    res.json({ message: 'User registered for challenge' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const unregisterUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    await challengeService.unregisterUser(id, user_id);
    res.json({ message: 'User unregistered from challenge' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const addParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    await challengeService.addParticipant(id, user_id);
    res.json({ message: 'User added as participant' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const removeParticipant = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id } = req.body;
    await challengeService.removeParticipant(id, user_id);
    res.json({ message: 'Participant removed from challenge' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getChallengeUsers = async (req, res) => {
  try {
    const { id } = req.params;
    const users = await challengeService.getChallengeUsers(id);
    res.json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAllChallenges = async (req, res) => {
  try {
    const challenges = await challengeService.fetchAllChallenges();
    res.json(challenges);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getChallengeDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const challenge = await challengeService.fetchChallengeDetail(id);
    res.json(challenge);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getChallengesByCreator = async (req, res) => {
  try {
    const { creator_id } = req.params;
    const challenges = await challengeService.fetchChallengesByCreator(creator_id);
    res.json(challenges);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
