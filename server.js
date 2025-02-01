// server.js
import express from 'express';
import issueRoutes from './routes/issueRoutes.js';  // Mudança para import

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api', issueRoutes);

const startServer = () => {
  app.listen(port, () => {
    console.log(`Servidor rodando na porta http://localhost:${port}`);
  });
};

export default startServer;
