import { autoUpdateChallengeStatus } from '../services/challengeService.js';

export const challengeStatusMiddleware = async (req, res, next) => {
  await autoUpdateChallengeStatus();
  next();
};
