import { supabase } from '../config/supabaseClient.js';
import cloudinary from '../config/cloudinaryConfig.js';
import { Readable } from 'stream';

const uploadImageToCloudinary = (buffer, filename) =>
  new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { folder: 'challenge_submissions/images', public_id: filename },
      (err, res) => err ? reject(err) : resolve(res.secure_url)
    ).end(buffer);
});

const uploadVideoToCloudinary = (buffer, filename) =>
  new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { folder: 'challenge_submissions/videos', resource_type: 'video', public_id: filename },
      (err, res) => err ? reject(err) : resolve(res.secure_url)
    ).end(buffer);
});

export const insertSubmission = async ({
  challenge_id, user_id, text_submission, imageFiles, videoFile
}) => {
  if (imageFiles && imageFiles.length > 10) throw new Error('Max 10 images allowed');
  if (videoFile && videoFile.size > 90 * 1024 * 1024) throw new Error('Video file exceeded 90MB');

  let image_urls = [];
  if (imageFiles && imageFiles.length) {
    for (const file of imageFiles) {
      const url = await uploadImageToCloudinary(file.buffer, file.originalname);
      image_urls.push(url);
    }
  }

  let video_url = null;
  if (videoFile) {
    video_url = await uploadVideoToCloudinary(videoFile.buffer, videoFile.originalname);
  }

  if ((!text_submission || text_submission.trim() === '') &&
    (!image_urls || image_urls.length === 0) && !video_url) {
    throw new Error('At least one of: text_submission, images, or video is required.');
  }

  const { data, error } = await supabase
    .from('challenge_submissions')
    .insert([{
      challenge_id,
      user_id,
      text_submission,
      image_urls: image_urls.length > 0 ? image_urls : null,
      video_url,
      status: 'submitted',
    }])
    .select('*')
    .single();

  if (error) throw error;
  return data;
};


export const updateSubmission = async (
  id, { text_submission, imageFiles, videoFile, status, green_points }
) => {
  let image_urls = undefined;
  let video_url = undefined;
  if (imageFiles) {
    if (imageFiles.length > 10) throw new Error('Max 10 images allowed');
    image_urls = [];
    for (const file of imageFiles) {
      const url = await uploadImageToCloudinary(file.buffer, file.originalname);
      image_urls.push(url);
    }
  }
  if (videoFile) {
    if (videoFile.size > 90 * 1024 * 1024) throw new Error('Video file exceeded 90MB');
    video_url = await uploadVideoToCloudinary(videoFile.buffer, videoFile.originalname);
  }
  const updateObj = {
    ...(text_submission ? { text_submission } : {}),
    ...(typeof image_urls !== 'undefined' ? { image_urls } : {}),
    ...(typeof video_url !== 'undefined' ? { video_url } : {}),
    ...(status ? { status } : {}),
    ...(typeof green_points !== 'undefined' ? { green_points } : {}),
  };
  const { data, error } = await supabase
    .from('challenge_submissions')
    .update(updateObj)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;
  return data;
};

export const getSubmissionById = async (id) => {
  const { data, error } = await supabase
    .from('challenge_submissions')
    .select('*')
    .eq('id', id)
    .single();
  if (error) throw error;
  return data;
};

export const getSubmissionsByChallengeId = async (challenge_id) => {
  const { data, error } = await supabase
    .from('challenge_submissions')
    .select(`
      *,
      user:users (
        full_name,
        email
      )
    `)
    .eq('challenge_id', challenge_id);

  if (error) throw error;
  return data;
};


export const getSubmissionsByUserId = async (user_id) => {
  const { data, error } = await supabase
    .from('challenge_submissions')
    .select('*')
    .eq('user_id', user_id);
  if (error) throw error;
  return data;
};

export const deleteSubmission = async (id) => {
  const { error } = await supabase
    .from('challenge_submissions')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
};
