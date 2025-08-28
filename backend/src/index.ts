import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import rewardsRouter from './routes/rewards';
import authRouter from './routes/auth';
import transactionsRouter from './routes/transactions';
import usersRouter from './routes/users';

dotenv.config();

const app = express();
const corsOrigin = process.env.CORS_ORIGIN || '*';
app.use(cors({ origin: corsOrigin }));
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/transactions', transactionsRouter);
app.use('/api/users', usersRouter);
app.use('/api/rewards', rewardsRouter);
app.use('/api/auth', authRouter);

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
app.listen(port, () => {
  console.log(`API listening on http://localhost:${port}`);
});


