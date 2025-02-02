import axios from 'axios';
import promptTemplate from '../services/promptTemplate.js';
import issueModel from '../models/IssueModel.js';
import commentController from './commentController.js';
import issueLabelController from './issuelabelController.js';

class IssueController {
    async fetchIssues(page, labels) {
        try {
            const response = await axios.get('https://api.github.com/repos/elastic/elasticsearch/issues', {
                headers: {
                    Authorization: `token ${process.env.GH_TOKEN}`,
                },
                params: {
                    per_page: 100,
                    page: page,
                    state: 'closed',
                    labels: labels,    
                },
            });
    
            for (const issue of response.data) {
                const exists = await issueModel.issueExists(issue.id);
    
                if (exists) {
                    console.log(`Issue ${issue.id} já está no banco. Pulando inserção.`);
                    continue; // Pula para a próxima issue
                }
    
                await issueModel.insertIssue({
                    id: issue.id,
                    title: issue.title,
                    author: issue.user ? issue.user.login : null,
                    state: issue.state,
                    milestone: issue.milestone ? issue.milestone.title : null,
                    assignee: issue.assignee ? issue.assignee.login : null,
                    priority: this.handlePriorityLabels(issue.labels),
                    resolution_time_days: this.calculateResolutionTimeDays(issue.created_at, issue.closed_at),
                    body: issue.body,
                    created_at: issue.created_at,
                    closed_at: issue.closed_at,
                });
    
                this.saveIssueLabels(issue.labels, issue.id);
                await commentController.fetchComments(issue.comments_url, issue.id);
            }
    
            console.log('Issues e comentários inseridos com sucesso!');
        } catch (error) {
            console.error('Erro ao buscar as issues:', error);
        }
    }
    

    async getIssues(req, res) {
        try {
            const issuesObject = await issueModel.getAllIssues();
            const issues = issuesObject.rows;

            const issueJson = issues.map(issue => {  
                return {
                        issue_id: issue.issue_id,
                        title: issue.title,
                        body: issue.body,
                        related_topic: issue.related_topic,
                    }
            });
        
            res.json(issueJson);
        } catch (error) {
            console.error("Erro ao obter issues:", error);
            res.status(500).json({ error: "Erro ao buscar issues" });
        }
    }

    calculateResolutionTimeDays(created_at, closed_at) {
        const createdAt = new Date(created_at);
        const closedAt = new Date(closed_at);
        return Math.round((closedAt - createdAt) / (1000 * 60 * 60 * 24));
    }

    handlePriorityLabels(labels) {
        const priorityLabel = labels.find(label => 
            ['priority:high', 'priority:normal', 'priority:critical'].includes(label.name)
        );
        return priorityLabel ? priorityLabel.name.split(':')[1] : null;
    }

    saveIssueLabels(labels, issueId) {
        for (const label of labels) {
            issueLabelController.insertIssueLabel({
                issue_id: issueId,
                label_id: label.id,
            });
        }
    }
 

    async createPrompts() {
        try {
            // Obtém todas as issues
            const issuesObject = await issueModel.getAllIssues();  // Método que busca todas as issues
            const issues = issuesObject.rows;
    
            // Faz todas as requisições de comentários e labels em paralelo
            const prompts = await Promise.all(issues.map(async (issue) => {
                const comments = await commentController.getComments(issue.issue_id);  // Requisição de comentários
                const labels = await issueLabelController.getLabels(issue.issue_id);  // Requisição de labels
    
                // Geração do prompt para cada issue
                const prompt = promptTemplate
                    .replace("{{title}}", issue.title)
                    .replace("{{description}}", issue.body)
                    .replace("{{comments}}", comments)
                    .replace("{{labels}}", labels);
                    
                // Retorna um objeto com o issue_id como chave e o prompt como valor
                return { issue_id: issue.issue_id, prompt: prompt.trim() };
            }));
    
            return prompts;  // Retorna o vetor de objetos com issue_id e prompt
        } catch (error) {
            console.error("Error creating prompts:", error);
            return null;
        }
    }

    getRelatedTopic(analysis) {
        const related_topics = ['Refactoring', 'Regression Testing', 'Both', 'None'];
        const firstLine = analysis.split("\n")[0].trim();
    
        // Verifica qual classificação está na primeira linha
        const related_topic = related_topics.find(c => firstLine.includes(c));
        return related_topic || 'None'; // Caso não encontre, retorna 'None'
    }
    async updateClassification(issueId, analysis) {
        try {
            const related_topic = await this.getRelatedTopic(analysis);
            await issueModel.updateClassification(issueId, related_topic, analysis);

            console.log(`Classificação da issue ${issueId} atualizada com sucesso!`);
        } catch (error) {
            console.error("Erro ao atualizar classificação da issue:", error);
        }
    }
}

export default new IssueController();
