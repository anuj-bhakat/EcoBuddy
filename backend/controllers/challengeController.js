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



// Maps status from submission to view-style
const parseStatus = (submissionStatus) => {
  if (submissionStatus === 'accepted') return 'completed';
  if (submissionStatus === 'submitted') return 'ongoing';
  return null;
};

export const getUserChallenges = async (req, res) => {
  try {
    const { user_id } = req.params;

    // 1. Get submissions
    const submissions = await challengeService.getUserChallengeSubmissions(user_id);

    // 2. Get all unique challenge ids
    const challengeIds = [...new Set(submissions.map(sub => sub.challenge_id))];

    // 3. Get challenge details for those IDs
    const challenges = await challengeService.getChallengesByIds(challengeIds);

    // 4. Get all unique creator ids
    const creatorIds = [...new Set(challenges.map(c => c.creator_id))];
    const users = await challengeService.getUsersByIds(creatorIds);

    // Build response
    const challengesMap = Object.fromEntries(challenges.map(c => [c.id, c]));
    const usersMap = Object.fromEntries(users.map(u => [u.id, u]));

    // 5. Build list
    const result = submissions
      .filter(sub => sub.status === 'submitted' || sub.status === 'accepted')
      .map(sub => {
        const challenge = challengesMap[sub.challenge_id] || {};
        const creator = challenge.creator_id ? usersMap[challenge.creator_id] : null;
        return {
          submission_id: sub.id,
          challenge_id: challenge.id,
          title: challenge.title,
          description: challenge.description,
          category: challenge.category,
          difficulty: challenge.difficulty,
          green_points: challenge.green_points,
          start_date: challenge.start_date,
          end_date: challenge.end_date,
          challenge_status: challenge.status,
          max_participants: challenge.max_participants,
          total_registered: challenge.total_registered,
          total_participated: challenge.total_participated,
          created_at: challenge.created_at,
          updated_at: challenge.updated_at,
          creator: creator
            ? {
                id: creator.id,
                full_name: creator.full_name,
                email: creator.email,
                created_at: creator.created_at,
                updated_at: creator.updated_at
              } : null,
          submission: {
            submitted_at: sub.submitted_at,
            status: parseStatus(sub.status),
            green_points_awarded: sub.green_points,
            text_submission: sub.text_submission,
            image_urls: sub.image_urls,
            video_url: sub.video_url
          }
        };
      });

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
