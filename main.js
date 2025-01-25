import LlamaAI from 'llamaai';
import dotenv from 'dotenv';
import issueController from './controllers/issueController.js';
import commentController from './controllers/commentController.js';
import labelController from './controllers/labelController.js';

const main = async () => {
  /* seedDatabase(); */

  // Pega as issues e comentários
  const issues = await issueController.getIssues();
  const comments = await commentController.getComments(issues.rows[0].issue_id);

};


const commentsJoin = (comments) => {
  return comments.map(comment => comment.comment_body).join('\n\n\n');
};

const seedDatabase = async () => {
  await labelController.fetchLabels();
  await issueController.fetchIssues(1);
  await issueController.fetchIssues(2);
  await issueController.fetchIssues(3);
};

main();
