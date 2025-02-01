import express from 'express';
import  issueController  from '../controllers/issueController.js';

const router = express.Router();

router.get('/issues', issueController.getIssues);

export default router;
