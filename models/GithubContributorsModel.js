import pool from '../dbConnection.js';

class GithubContributors {

    getAllContributors() {
        try {
            const result = pool.query(
                `SELECT * FROM github_contributors c`
            );

            return result;
        } catch (error) {
            console.error("Error fetching github_contributors:", error);
            return [];
        }
    }
}

export default new GithubContributors();
