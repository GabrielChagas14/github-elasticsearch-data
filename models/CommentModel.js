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
        try {
            const result = pool.query(
                `SELECT c.comment_id, c.author, c.body AS comment_body 
                 FROM comment c
                 WHERE c.issue_id = $1`, 
                [issue_id]
            );
    
            return result; // Retorna apenas os comentários como array
        } catch (error) {
            console.error("Error fetching comments:", error);
            return []; // Retorna um array vazio para evitar erro no .map()
        }
    }

    getAllComments() {
        try {
            const result = pool.query(
                `SELECT * FROM comment c`
            );
    
            return result;
        } catch (error) {
            console.error("Error fetching comments:", error);
            return [];
        }
    }
}

export default new CommentModel();
