import dotenv from 'dotenv';
import { GoogleGenerativeAI } from "@google/generative-ai";
import issueController from './controllers/issueController.js';
import commentController from './controllers/commentController.js';
import labelController from './controllers/labelController.js';

const main = async () => {
  seedDatabase();

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_TOKEN);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
  const prompt = "qual o último álbum da beyoncé";
  
  const result = await model.generateContent(prompt);
  console.log(result.response.text());

  // Pega as issues e comentários
  /* const issues = await issueController.getIssues();
  const comments = await commentController.getComments(issues.rows[0].issue_id); */

};


const commentsJoin = (comments) => {
  return comments.map(comment => comment.comment_body).join('\n\n\n');
};

const seedDatabase = async () => {
  await labelController.fetchLabels();
  await issueController.fetchIssues(1, '>refactoring');
  await issueController.fetchIssues(1, '>test');
  await issueController.fetchIssues(2, '>test');
  await issueController.fetchIssues(3, '>test');
};

main();
