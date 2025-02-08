/* Backend/server.ts */
import express from 'express';
import cors from 'cors';
import producerRoutes from './routes/producerRoutes';
import consumerRoutes from './routes/consumerRoutes';
import { connectDB } from './models/tokenModel';

const app = express();
app.use(cors());
app.use(express.json());
connectDB();

app.use('/api/producer', producerRoutes);
app.use('/api/consumer', consumerRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
