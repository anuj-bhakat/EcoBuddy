import { supabase } from '../config/supabaseClient.js';
import cloudinary from '../config/cloudinaryConfig.js';
import { Readable } from 'stream';

// Upload an image buffer stream to Cloudinary
export const uploadImageFromBuffer = (buffer) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.v2.uploader.upload_stream(
      { folder: 'challenges' },
      (error, result) => {
        if (error) reject(error);
        else resolve(result.secure_url);
      }
    );
    const readable = new Readable();
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });
};

// Upload multiple images from buffers
export const uploadImages = async (imageFiles) => {
  if (!imageFiles || imageFiles.length === 0) return [];
  if (imageFiles.length > 10) throw new Error('Maximum 10 images allowed');

  const uploadedUrls = [];
  for (const file of imageFiles) {
    const url = await uploadImageFromBuffer(file.buffer);
    uploadedUrls.push(url);
  }
  return uploadedUrls;
};

export const createChallenge = async (challengeData, imageFiles) => {
  const {
    title, description, creator_id, start_date, end_date,
    category, difficulty, green_points, status, max_participants
  } = challengeData;

  const imageUrls = await uploadImages(imageFiles);

  const { data: challenge, error } = await supabase
    .from('challenges')
    .insert([{
      title, description, creator_id, start_date, end_date,
      category, difficulty, green_points, status, max_participants,
      total_registered: 0,
      total_participated: 0
    }])
    .select('*')
    .single();

  if (error) throw error;

  for (const url of imageUrls) {
    const { error: imgError } = await supabase
      .from('challenge_images')
      .insert([{ challenge_id: challenge.id, image_url: url }]);
    if (imgError) throw imgError;
  }

  return challenge;
};

// export const updateChallenge = async (id, updateData, newImageFiles, existingImageUrls) => {
//   const newImageUrls = await uploadImages(newImageFiles);

//   const allImageUrls = [...existingImageUrls, ...newImageUrls];

//   updateData.updated_at = new Date().toISOString();

//   const { data: updatedChallenge, error } = await supabase
//     .from('challenges')
//     .update(updateData)
//     .eq('id', id)
//     .select('*')
//     .single();

//   if (error) throw error;

//   // Optionally, clear existing challenge_images records first if needed:
//   // await supabase.from('challenge_images').delete().eq('challenge_id', id);

//   // Reinsert all image URLs
//   for (const url of allImageUrls) {
//     const { error: imgError } = await supabase
//       .from('challenge_images')
//       .insert([{ challenge_id: id, image_url: url }]);
//     if (imgError) throw imgError;
//   }

//   return updatedChallenge;
// };
export const updateChallenge = async (id, updateData, imageFiles, existingImageUrlsJson) => {
  const existingImageUrls = existingImageUrlsJson || [];

  if ('existingImageUrls' in updateData) {
    delete updateData.existingImageUrls;
  }

  // Update the challenge data itself
  updateData.updated_at = new Date().toISOString();
  const { data: updatedChallenge, error } = await supabase
    .from('challenges')
    .update(updateData)
    .eq('id', id)
    .select('*')
    .single();

  if (error) throw error;

  // Get all current images URLs from DB
  const { data: currentImages, error: currentImagesError } = await supabase
    .from('challenge_images')
    .select('id, image_url')
    .eq('challenge_id', id);

  if (currentImagesError) throw currentImagesError;

  // Determine images to delete: those in DB but not in existingImageUrls from frontend
  const imagesToDelete = currentImages.filter(img => !existingImageUrls.includes(img.image_url));

  // Delete removed images
  for (const img of imagesToDelete) {
    const { error: delErr } = await supabase
      .from('challenge_images')
      .delete()
      .eq('id', img.id);
    if (delErr) throw delErr;
  }

  // Upload new image files and add to DB
  const newImageUrls = await uploadImages(imageFiles);

  for (const url of newImageUrls) {
    const { error: insertErr } = await supabase
      .from('challenge_images')
      .insert([{ challenge_id: id, image_url: url }]);
    if (insertErr) throw insertErr;
  }

  return updatedChallenge;
};

export const deleteChallenge = async (id) => {
  const { error } = await supabase
    .from('challenges')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return true;
};

export const registerUser = async (challenge_id, user_id) => {

  const { data: existingUser } = await supabase
    .from('challenge_registrations')
    .select('*')
    .eq('challenge_id', challenge_id)
    .eq('user_id', user_id)
    .maybeSingle();

  if (existingUser) {
    throw new Error('User is already registered for this challenge');
  }

  const { data: challenge, error: fetchError } = await supabase
    .from('challenges')
    .select('total_registered, max_participants')
    .eq('id', challenge_id)
    .single();

  if (fetchError) throw fetchError;

  const currentCount = challenge.total_registered || 0;
  const maxCount = challenge.max_participants || 0;

  if (currentCount >= maxCount) {
    throw new Error('Challenge has reached the maximum number of participants');
  }

  const { error: insertError } = await supabase
    .from('challenge_registrations')
    .insert([{ challenge_id, user_id }]);
  if (insertError) throw insertError;

  const { error: updateError } = await supabase
    .from('challenges')
    .update({ total_registered: currentCount + 1 })
    .eq('id', challenge_id);
  if (updateError) throw updateError;

  return true;
};

export const unregisterUser = async (challenge_id, user_id) => {

  const { error } = await supabase
    .from('challenge_registrations')
    .delete()
    .match({ challenge_id, user_id });
  if (error) throw error;

  const { data: challenge, error: fetchError } = await supabase
    .from('challenges')
    .select('total_registered')
    .eq('id', challenge_id)
    .single();

  if (fetchError) throw fetchError;

  const newCount = Math.max((challenge.total_registered || 1) - 1, 0);

  const { error: updateError } = await supabase
    .from('challenges')
    .update({ total_registered: newCount })
    .eq('id', challenge_id);
  if (updateError) throw updateError;

  return true;
};


export const addParticipant = async (challenge_id, user_id) => {
  const { data: registration } = await supabase
    .from('challenge_registrations')
    .select('*')
    .eq('challenge_id', challenge_id)
    .eq('user_id', user_id)
    .single();

  if (!registration) throw new Error('User must be registered before participating');

  const { data: participant } = await supabase
    .from('challenge_participations')
    .select('*')
    .eq('challenge_id', challenge_id)
    .eq('user_id', user_id)
    .single();

  if (participant) throw new Error('User already participated');

  const { error } = await supabase
    .from('challenge_participations')
    .insert([{ challenge_id, user_id }]);
  if (error) throw error;

  const { data: challenge, error: fetchError } = await supabase
    .from('challenges')
    .select('total_participated')
    .eq('id', challenge_id)
    .single();
  if (fetchError) throw fetchError;

  const newCount = (challenge.total_participated || 0) + 1;

  const { error: updateError } = await supabase
    .from('challenges')
    .update({ total_participated: newCount })
    .eq('id', challenge_id);
  if (updateError) throw updateError;

  return true;
};

export const removeParticipant = async (challenge_id, user_id) => {
  const { error } = await supabase
    .from('challenge_participations')
    .delete()
    .match({ challenge_id, user_id });
  if (error) throw error;

  const { data: challenge, error: fetchError } = await supabase
    .from('challenges')
    .select('total_participated')
    .eq('id', challenge_id)
    .single();
  if (fetchError) throw fetchError;

  const newCount = Math.max((challenge.total_participated || 1) - 1, 0);

  const { error: updateError } = await supabase
    .from('challenges')
    .update({ total_participated: newCount })
    .eq('id', challenge_id);
  if (updateError) throw updateError;

  return true;
};

export const getChallengeUsers = async (challenge_id) => {
  const { data: registered, error: regErr } = await supabase
    .from('challenge_registrations')
    .select('user_id, users(full_name, email)')
    .eq('challenge_id', challenge_id);

  if (regErr) throw regErr;

  const { data: participated, error: partErr } = await supabase
    .from('challenge_participations')
    .select('user_id, users(full_name, email)')
    .eq('challenge_id', challenge_id);

  if (partErr) throw partErr;

  return { registered, participated };
};

export const fetchAllChallenges = async () => {
  const { data, error } = await supabase
    .from('challenges')
    .select('id, title, description, start_date, end_date, category, difficulty, green_points, status, max_participants, total_registered, total_participated')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};

export const fetchChallengeDetail = async (id) => {
  const { data: challenge, error } = await supabase
    .from('challenges')
    .select(`
      *,
      challenge_images(image_url),
      users:creator_id(full_name)
    `)
    .eq('id', id)
    .single();

  if (error) throw error;
  return challenge;
};

export const fetchChallengesByCreator = async (creator_id) => {
  const { data, error } = await supabase
    .from('challenges')
    .select('*')
    .eq('creator_id', creator_id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
};





// --------------- Auto Update Function --------------- 

export const autoUpdateChallengeStatus = async () => {
  const now = new Date();

  // 1. Update "open" to "ongoing"
  const { data: openChallenges, error: openError } = await supabase
    .from('challenges')
    .select('id, start_date, end_date')
    .eq('status', 'open');

  if (openError) {
    console.error("Auto update status (open->ongoing) error:", openError);
    return;
  }

  const toOngoing = (openChallenges || [])
    .filter(c => {
      const start = new Date(c.start_date);
      const end = new Date(c.end_date);
      return start <= now && now < end;
    })
    .map(c => c.id);

  if (toOngoing.length > 0) {
    await supabase
      .from('challenges')
      .update({ status: 'ongoing' })
      .in('id', toOngoing);
  }

  // 2. Update "ongoing" to "closed"
  const { data: ongoingChallenges, error: ongoingError } = await supabase
    .from('challenges')
    .select('id, end_date')
    .eq('status', 'ongoing');

  if (ongoingError) {
    console.error("Auto update status (ongoing->closed) error:", ongoingError);
    return;
  }

  const toClosed = (ongoingChallenges || [])
    .filter(c => {
      const end = new Date(c.end_date);
      return now >= end;
    })
    .map(c => c.id);

  if (toClosed.length > 0) {
    await supabase
      .from('challenges')
      .update({ status: 'closed' })
      .in('id', toClosed);
  }
};

