import axios from 'axios';
import ContributorsClassificationModel from '../models/ContributorsClassificationModel.js';

class CommentController {

    async getAllClassification(req, res) {
        try {
            const classificationObject = await ContributorsClassificationModel.getAllClassification();
            if (!classificationObject || classificationObject.length === 0) {
                return "No comments available."; // Retorno seguro se não houver comentários
            }
            
            const classification = classificationObject.rows;

            const classificationJson = classification.map(classification => {  


                return {
                        login: classification.login,
                        classification: classification.classification
                    }
            });
        
            res.json(classificationJson);
        } catch (error) {
            console.error("Erro ao obter comments:", error);
            res.status(500).json({ error: "Erro ao buscar comments" });
        }
    }
    


}

export default new CommentController();
