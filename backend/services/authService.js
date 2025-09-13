import { supabase } from '../config/supabaseClient.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function generateToken(user, role = 'user') {
  return jwt.sign({ id: user.id, role }, JWT_SECRET, { expiresIn: '7d' });
}

export const signupUserService = async ({ full_name, email, password }) => {
  const { data: existingUser } = await supabase.from('users').select('id').eq('email', email).single();
  if (existingUser) throw new Error('Email already registered');

  const password_hash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from('users')
    .insert([{ full_name, email, password_hash }])
    .select('id, full_name, email')
    .single();
  if (error) throw error;

  const token = generateToken(data);
  return { user: data, token };
};

export const loginUserService = async ({ email, password }) => {
  const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
  if (!user || error) throw new Error('Invalid email or password');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Invalid email or password');

  const token = generateToken(user);
  return { user: { id: user.id, full_name: user.full_name, email: user.email }, token };
};

export const signupAdminService = async ({ full_name, email, password }) => {
  const { data: existingAdmin } = await supabase.from('admins').select('id').eq('email', email).single();
  if (existingAdmin) throw new Error('Email already registered');

  const password_hash = await bcrypt.hash(password, 10);
  const { data, error } = await supabase
    .from('admins')
    .insert([{ full_name, email, password_hash }])
    .select('id, full_name, email')
    .single();
  if (error) throw error;

  const token = generateToken(data, 'admin');
  return { admin: data, token };
};

export const loginAdminService = async ({ email, password }) => {
  const { data: admin, error } = await supabase.from('admins').select('*').eq('email', email).single();
  if (!admin || error) throw new Error('Invalid email or password');

  const valid = await bcrypt.compare(password, admin.password_hash);
  if (!valid) throw new Error('Invalid email or password');

  const token = generateToken(admin, 'admin');
  return { admin: { id: admin.id, full_name: admin.full_name, email: admin.email }, token };
};


export const loginCreatorService = async ({ email, password }) => {
  const { data: user, error } = await supabase.from('users').select('*').eq('email', email).single();
  if (!user || error) throw new Error('Invalid email or password');

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw new Error('Invalid email or password');

  const { data: creator, error: creatorError } = await supabase
    .from('creators')
    .select('user_id')
    .eq('user_id', user.id)
    .single();

  if (!creator || creatorError) throw new Error('User is not a creator');

  const token = generateToken(user, 'creator');
  return { user: { id: user.id, full_name: user.full_name, email: user.email }, token };
};




const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtp = async (email) => {
  // Find user by email
  const { data: user } = await supabase.from('users').select('id, email').eq('email', email).single();
  if (!user) throw new Error('User not found');

  const nowISOString = new Date().toISOString();

  // Check for existing valid OTP (not used, not expired)
  const { data: existingOtp } = await supabase
    .from('password_resets')
    .select('*')
    .eq('user_id', user.id)
    .eq('used', false)
    .gte('expires_at', nowISOString)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  let otp_code;

  if (existingOtp) {
    // Reuse existing OTP
    otp_code = existingOtp.otp_code;
  } else {
    // Generate new OTP
    otp_code = crypto.randomInt(100000, 999999).toString();

    const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // Store new OTP record
    const { error } = await supabase.from('password_resets').insert([{
      user_id: user.id,
      otp_code,
      expires_at,
    }]);
    if (error) throw error;
  }

  // Send OTP via email (same for new or existing)
//   await transporter.sendMail({
//     from: `"EcoBuddy Support" <${process.env.SMTP_USER}>`,
//     to: user.email,
//     subject: 'Your EcoBuddy Password Reset OTP',
//     text: `Your OTP code is ${otp_code}. It expires in 10 minutes.`,
//   });
    await transporter.sendMail({
    from: `"EcoBuddy Support" <${process.env.SMTP_USER}>`,
    to: user.email,
    subject: 'Your EcoBuddy Password Reset OTP',
    html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 15px; background-color: #f4f6f9; border-radius: 10px;">
            <div style="text-align: center; margin-bottom: 15px;">
                <h1 style="color: #4CAF50; font-size: 2.2em; font-weight: bold;">EcoBuddy Support</h1>
                <p style="font-size: 1.1em; color: #333; line-height: 1.5;">We've received a request to reset your password. Please use the OTP below to proceed.</p>
            </div>
            <div style="padding: 12px 18px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin-bottom: 15px;">
                <h2 style="text-align: center; color: #4CAF50; font-size: 1.7em; font-weight: bold; margin-bottom: 8px;">Your OTP Code</h2>
                <div style="text-align: center;">
                    <p style="font-size: 2.1em; font-weight: bold; color: #2C6A4F; background-color: #f1f9f4; padding: 8px 18px; border-radius: 5px; display: inline-block;">
                        ${otp_code}
                    </p>
                </div>
                <p style="font-size: 1.1em; text-align: center; color: #333; margin-top: 8px;">It expires in 10 minutes.</p>
            </div>
            <div style="text-align: center; font-size: 1em; color: #555; margin-top: 15px;">
                <p>If you did not request a password reset, please ignore this email.</p>
                <p>Thank you for being part of EcoBuddy!</p>
            </div>
        </div>
    `,
});

  return true;
};


export const verifyOtpAndResetPassword = async (email, otp_code, new_password) => {
  // Find user
  const { data: user } = await supabase.from('users').select('id').eq('email', email).single();
  if (!user) throw new Error('User not found');

  // Find matching OTP record unused and not expired
  const { data: otpRecord, error } = await supabase
    .from('password_resets')
    .select('*')
    .eq('user_id', user.id)
    .eq('otp_code', otp_code)
    .eq('used', false)
    .gte('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (!otpRecord) throw new Error('Invalid or expired OTP');

  // Hash new password
  const password_hash = await bcrypt.hash(new_password, 10);

  // Update user's password
  const { error: updateError } = await supabase
    .from('users')
    .update({ password_hash })
    .eq('id', user.id);

  if (updateError) throw updateError;

  // Mark OTP as used
  const { error: usedError } = await supabase
    .from('password_resets')
    .update({ used: true })
    .eq('id', otpRecord.id);

  if (usedError) throw usedError;

  return true;
};