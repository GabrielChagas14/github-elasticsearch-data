import issueController from './controllers/issueController.js';
import commentController from './controllers/commentController.js';
import labelController from './controllers/labelController.js';
import geminiService from './services/geminiService.js';

const main = async () => {
 /*  seedDatabase(); */

  
 const prompt = await issueController.createPrompt("2742896629");
 const response = await geminiService.generateResponse(prompt);
 await issueController.updadeClassification("2742896629", response);
 console.log(response);

};

const seedDatabase = async () => {
  await labelController.fetchLabels();
  await issueController.fetchIssues(1, '>refactoring');
  await issueController.fetchIssues(1, '>test');
  await issueController.fetchIssues(2, '>test');
  await issueController.fetchIssues(3, '>test');
};

main();
