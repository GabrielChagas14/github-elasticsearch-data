import axios from 'axios';
import commentModel from '../models/CommentModel.js';

class CommentController {
    async fetchComments(comments_url, issue_id) {
        try {
            const response = await axios.get(comments_url, {
                headers: {
                    Authorization: `token ${process.env.GH_TOKEN}`,
                },
            });

            for (const comment of response.data) {
                await commentModel.insertComment({
                    comment_id: comment.id,
                    issue_id: issue_id,
                    author: comment.user ? comment.user.login : null,
                    body: comment.body,
                    created_at: comment.created_at,
                    url: comment.html_url,
                });

                console.log(`Comentário inserido: ${comment.id} para a issue ${issue_id}`);
            }
        } catch (error) {
            console.error(`Erro ao buscar comentários da issue ${issue_id}:`, error);
        }
    }

     async getComments(issue_id) {
        
            const commentsObject = await commentModel.getComments(issue_id);
            if (!commentsObject || commentsObject.length === 0) {
                return "No comments available."; // Retorno seguro se não houver comentários
            }
            
            const comments = commentsObject.rows;
            
            return comments.map(comment => 
                `author: ${comment.author}\ncomment: ${comment.comment_body}`
            ).join('\n\n');
    
    }
    


}

export default new CommentController();
