const pool = require('../dbConnection');

class IssueLabelModel {
    async insertIssueLabel(issueLabel) {
        await pool.query(
            'INSERT INTO issue_label (issue_id, label_id) VALUES ($1, $2)',
            [issueLabel.issue_id, issueLabel.label_id]
        );
    }

    async clearTable() {
        await pool.query('DELETE FROM issue_label');
    }
}

module.exports = new IssueLabelModel();