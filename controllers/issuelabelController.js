import issueLabelModel from '../models/IssueLabelModel.js';

class IssueLabelController {
    async insertIssueLabel(issueLabel) {
        try {
            await issueLabelModel.insertIssueLabel(issueLabel);
        } catch (error) {
            console.error('Erro ao inserir label:', error);
        }
    }

    async clearTable() {
        try {
            await issueLabelModel.clearTable();
        } catch (error) {
            console.error('Erro ao limpar a tabela de labels:', error);
        }
    }

    async getLabels (issue_id) {
        try {
            const labelsObject = await issueLabelModel.getLabels(issue_id);
            if (!labelsObject || labelsObject.length === 0) {
                return "No labels available."; // Retorno seguro se não houver labels
            }
            
            const labels = labelsObject.rows;
            
            return labels.map(label => 
                `label: ${label.name}, description: ${label.description == null ? 'No description' : label.description}`
            ).join('\n');
    
        } catch (error) {
            console.error("Error fetching labels:", error);
            return "No labels available.";
        }
    }
}

export default new IssueLabelController();