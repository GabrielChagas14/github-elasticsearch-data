import pool from '../dbConnection.js';

class GithubContributorsClassification {

    getAllClassification() {
        try {
            const result = pool.query(
                `SELECT * FROM github_contributors_classification gcc`
            );

            return result;
        } catch (error) {
            console.error("Error fetching github_contributors_classification:", error);
            return [];
        }
    }
}

export default new GithubContributorsClassification();
