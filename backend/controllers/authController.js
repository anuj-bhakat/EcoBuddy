import {
  signupUserService,
  loginUserService,
  signupAdminService,
  loginAdminService,
  loginCreatorService,
} from '../services/authService.js';
import { sendOtp, verifyOtpAndResetPassword } from '../services/authService.js';

export const signupUser = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    const result = await signupUserService({ full_name, email, password });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginUserService({ email, password });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const signupAdmin = async (req, res) => {
  try {
    const { full_name, email, password } = req.body;
    const result = await signupAdminService({ full_name, email, password });
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginAdminService({ email, password });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const loginCreator = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginCreatorService({ email, password });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    await sendOtp(email);
    res.json({ message: 'OTP sent to email' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp_code, new_password } = req.body;
    await verifyOtpAndResetPassword(email, otp_code, new_password);
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
