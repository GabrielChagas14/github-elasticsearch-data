import pool from '../dbConnection.js';

class CommentModel {
    async insertComment(comment) {
        await pool.query(
            `INSERT INTO comment (comment_id, issue_id, author, body, created_at, url) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [comment.comment_id, comment.issue_id, comment.author, comment.body, comment.created_at, comment.url]
        );
    }

    getComments(issue_id) {
        return pool.query(`SELECT c.comment_id, c.body as comment_body FROM comment c
             WHERE c.issue_id = $1
             `, [issue_id]);
    }
}

export default new CommentModel();
