const axios = require('axios');
require('dotenv').config();

const githubToken = process.env.GITHUB_TOKEN;

const fetchIssues = async () => {
    try {
        const response = await axios.get('https://api.github.com/repos/elastic/elasticsearch/issues', {
            headers: {
                Authorization: `token ${process.env.GH_TOKEN}`,
            },
            params: {
                per_page: 10,  
            },
        });
        console.log(response.data); 
    } catch (error) {
        console.error('Erro ao buscar as issues:', error);
    }
};

fetchIssues();
