import express from 'express';
import * as postController from '../controllers/postController.js';

const router = express.Router();

router.post('/', postController.addPost);
router.put('/:id', postController.updatePost);
router.delete('/:id', postController.deletePost);
router.get('/', postController.getAllPosts);
router.get('/user/:user_id', postController.getPostsByUserId);

// Like/Dislike
router.post('/:post_id/like', postController.likeDislike); 
router.post('/:post_id/dislike', postController.likeDislike);

export default router;