import issueController from './controllers/issueController.js';
import commentController from './controllers/commentController.js';
import labelController from './controllers/labelController.js';
import geminiService from './services/geminiService.js';

const main = async () => {
 /*  seedDatabase(); */

 const prompts = await issueController.createPrompts();
 await updateIssuesClassification(prompts);
 
};

const updateIssuesClassification = async (prompts) => {
  for (let i = 0; i < prompts.length; i += 15) {
      const batch = prompts.slice(i, i + 15);
      await Promise.all(batch.map(async (promptData) => {
          const response = await geminiService.generateResponse(promptData.prompt);
          await issueController.updateClassification(promptData.issue_id, response);
      }));
      

      if (i + 15 < prompts.length) {
          console.log("Waiting for 1 minute...");
          await new Promise(resolve => setTimeout(resolve, 60000)); 
      }
  }
};

const seedDatabase = async () => {
  await labelController.fetchLabels();
  await issueController.fetchIssues(1, '>refactoring');
  await issueController.fetchIssues(1, '>test');
  await issueController.fetchIssues(2, '>test');
  await issueController.fetchIssues(3, '>test');
};

main();
