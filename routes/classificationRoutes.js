import express from 'express';
import  GithubContributorsClassificationController  from '../controllers/GithubContributorsClassificationController.js';

const router = express.Router();

router.get('/classification', GithubContributorsClassificationController.getAllClassification);

export default router;
