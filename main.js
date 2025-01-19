const issueController = require('./issueController');

const main = async () => {
    await issueController.fetchIssues(1);
    await issueController.fetchIssues(2);
    await issueController.fetchIssues(3);
};

main();
