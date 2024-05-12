import express from 'express';
import cors from 'cors';
import blockchainRouter from './routes/blockchainRoutes.mjs';
import transactionRouter from './routes/transactionRoutes.mjs';
import nodeRouter from './routes/nodeRoutes.mjs';
import path from 'path';
import { fileURLToPath } from 'url';

const PORT = process.argv[2];

const app = express();

const fileName = fileURLToPath(import.meta.url);
const dirname = path.dirname(fileName);

global.__appdir = dirname;

app.use(cors());
app.use(express.json());

app.use('/api/v1/blockchain', blockchainRouter);
app.use('/api/v1/transactions', transactionRouter);
app.use('/api/v1/nodes', nodeRouter);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});

const syncBlockchain = async () => {
  console.log(process.argv[3]);
  const response = await fetch(
    `${process.argv[3]}/api/blockchain/synchronize-chain`
  );
  if(response.ok) {
    const result = await response.json();
  } else {
    console.log('Fatal Error!!!');
  }
}
