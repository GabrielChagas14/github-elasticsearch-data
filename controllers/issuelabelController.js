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
}

export default new IssueLabelController();