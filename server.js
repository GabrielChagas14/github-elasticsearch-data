// server.js
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import issueRoutes from './routes/issueRoutes.js';  // Mudança para import

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', issueRoutes);

app.use(express.static(path.join(__dirname, 'views')));
app.use('/assets', express.static(path.join(__dirname, 'assets')));
app.use('/resources', express.static(path.join(__dirname, 'resources')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
});

const startServer = () => {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
  });
};

export default startServer;
