import express from 'express';
import  commentController  from '../controllers/commentController.js';

const router = express.Router();

router.get('/comments', commentController.getAllComments);

export default router;
