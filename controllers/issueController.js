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
    

    getIssues() {
        return issueModel.getIssues();
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
    async createPrompt(issueId) {
        try {
            const issueObject = await issueModel.getIssues(issueId);
            const issue = issueObject.rows[0];
           
            const comments = await commentController.getComments(issue.issue_id);
            const labels = await issueLabelController.getLabels(issue.issue_id);
    
            const prompt = promptTemplate
                .replace("{{title}}", issue.title)
                .replace("{{description}}", issue.body)
                .replace("{{comments}}", comments)
                .replace("{{labels}}", labels);
                
            return prompt.trim();
        } catch (error) {
            console.error("Error creating prompt:", error);
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
    async updadeClassification(issueId, analysis) {
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
