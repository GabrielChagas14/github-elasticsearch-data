const axios = require('axios');
const issueModel = require('./IssueModel.js');

class IssueController {
    async fetchIssues(page) {
        try {
            const response = await axios.get('https://api.github.com/repos/elastic/elasticsearch/issues', {
                headers: {
                    Authorization: `token ${process.env.GH_TOKEN}`,
                },
                params: {
                    per_page: 100,
                    page: page,
                    state: 'closed',    
                    labels: '>bug',   
                },
            });
            
            for (const issue of response.data) {
                await issueModel.insertIssue({
                    id: issue.id,
                    title: issue.title,
                    author: issue.user ? issue.user.login : null,
                    state: issue.state,
                    milestone: issue.milestone ? issue.milestone.title : null,
                    assignee: issue.assignee ?  issue.assignee.login : null,
                    priority: this.handlePriorityLabels(issue.labels),
                    resolution_time_days: this.calculateResolutionTimeDays(issue.created_at, issue.closed_at),
                    created_at: issue.created_at,
                    closed_at: issue.closed_at,
                });
            }
            console.log('Issues inseridas com sucesso!');
        } catch (error) {
            console.error('Erro ao buscar as issues:', error);
        }
    }

    calculateResolutionTimeDays(created_at, closed_at) {
        const createdAt = new Date(created_at);
        const closedAt = new Date(closed_at);
        return Math.round((closedAt - createdAt) / (1000 * 60 * 60 * 24));
    }

    handlePriorityLabels(labels) {
        const priorityLabel = labels.find(label => 
            ['priority:high', 'priority:normal', 'priority:critical'].includes(label.name)
        );
        return priorityLabel ? priorityLabel.name.split(':')[1] : 'low';
    }
}

module.exports = new IssueController();
