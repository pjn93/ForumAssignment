import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import rootRouter from './routes/index';
import { PrismaClient } from '@prisma/client';
import { errorMiddleware } from './middleware/errors';

const app:Express = express();
const PORT = 8001;
export const prismaClient = new PrismaClient({
 log: ['query'],
})


app.use(cors())
app.use(express.json());

app.use('/api', rootRouter)

app.use(errorMiddleware)

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
