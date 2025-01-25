const issueController = require('./controllers/issueController');
const labelController = require('./controllers/labelController');

const main = async () => {
    await labelController.fetchLabels();
     await issueController.fetchIssues(1);
   await issueController.fetchIssues(2);
    await issueController.fetchIssues(3);
};

main();
