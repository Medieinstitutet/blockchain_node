import { blockchain } from '../initBlockchain.mjs';
import ResponseModel from '../utilities/ResponseModel.mjs';

export const createTransaction = (req, res, next) => {
  const transaction = req.body;

  const blockIndex = blockchain.addTransaction(transaction);

  res.status(201).json(new ResponseModel({
    success: true,
    statusCode: 201,
    data: { message: 'Transaktion was created', transaction, blockIndex },
  }));
};

export const broadcastTransaction = (req, res, next) => {
  const transaction = blockchain.createTransaction(
    req.body.amount,
    req.body.sender,
    req.body.recipient
  );

  const blockIndex = blockchain.addTransaction(transaction);

  blockchain.blockchainNodes.forEach(async (url) => {
    await fetch(`${url}/api/v1/transactions/transaction`, {
      method: 'POST',
      body: JSON.stringify(transaction),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  });

  res.status(201).json(new ResponseModel({
    success: true,
    statusCode: 201,
    data: {
      message: 'Transaction created and distrubuted to the network',
      transaction,
      blockIndex,
    },
  }));
};
