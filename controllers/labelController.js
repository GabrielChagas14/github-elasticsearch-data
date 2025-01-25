const axios = require('axios');
const labelModel = require('../models/LabelModel.js');

class LabelController {
    async fetchLabels() {
        let page = 1;  // Inicializa a página como 1
        try {
            while (true) {
                const response = await axios.get('https://api.github.com/repos/elastic/elasticsearch/labels', {
                    headers: {
                        Authorization: `token ${process.env.GH_TOKEN}`,
                    },
                    params: {
                        per_page: 100,  // Pega até 100 labels por vez (limite da API)
                        page: page,     // Número da página atual
                    },
                });

                if (response.data.length === 0) {
                    break; // Sai do loop se não houver mais labels
                }

                for (const label of response.data) {
                    await labelModel.insertLabel({
                        id: label.id,
                        name: label.name,
                        color: label.color,
                        description: label.description,
                        is_default: label.default,
                        url: label.url,
                    });
                }

                console.log(`Página ${page} processada.`);
                page++; // Avança para a próxima página
            }

            console.log('Todas as labels foram inseridas com sucesso!');
        } catch (error) {
            console.error('Erro ao buscar as labels:', error);
        }
    }
}

module.exports = new LabelController();
