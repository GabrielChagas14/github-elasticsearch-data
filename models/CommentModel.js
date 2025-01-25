const pool = require('../dbConnection');

class CommentModel {
    async insertComment(comment) {
        await pool.query(
            `INSERT INTO comment (comment_id, issue_id, author, body, created_at, url) 
             VALUES ($1, $2, $3, $4, $5, $6)`,
            [comment.comment_id, comment.issue_id, comment.author, comment.body, comment.created_at, comment.url]
        );
    }
}

module.exports = new CommentModel();
