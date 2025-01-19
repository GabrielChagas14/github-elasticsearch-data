const pool = require('./dbConnection');

class IssueModel {
    async insertIssue(issue) {
        await pool.query(
            'INSERT INTO github_data (issue_id, title, author, state, milestone, priority, assignee, resolution_time_days, created_at, closed_at) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)',
            [issue.id, issue.title, issue.author, issue.state, issue.milestone, issue.priority, issue.assignee, issue.resolution_time_days, issue.created_at, issue.closed_at]
        );
    }

    async clearTable() {
        await pool.query('DELETE FROM github_data');
    }
}

module.exports = new IssueModel();
