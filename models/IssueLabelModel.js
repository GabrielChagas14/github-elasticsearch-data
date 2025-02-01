import pool from '../dbConnection.js';

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
    async getLabels(issue_id) {
        return await pool.query(
            `SELECT l.name, l.description
             FROM label l
             JOIN issue_label il ON l.label_id = il.label_id
             WHERE il.issue_id = $1`,
            [issue_id]
        );
    }
}

export default new IssueLabelModel();