import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { vehicleRoutes } from './routes/vehicleRoutes';
import { AppDataSource } from './config/database';

import dotenv from 'dotenv';
dotenv.config();

const app: Application = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use('/api/vehicles', vehicleRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const startServer = async () => {
  try {
    await AppDataSource.initialize();
    
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
