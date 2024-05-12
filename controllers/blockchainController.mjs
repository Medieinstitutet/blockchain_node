import { blockchain } from '../initBlockchain.mjs';
import { writeFileAsync, readFileAsync } from '../utilities/fileLogger.mjs';
import ResponseModel from '../utilities/ResponseModel.mjs';

export const getBlockchain = async (req, res, next) => {
  res.status(200).json(new ResponseModel({ success: true, data: blockchain }));
};

export const createBlock = async (req, res, next) => {
  await updateBlockChain();

  const lastBlock = blockchain.getLastBlock();
  const data = blockchain.pendingTransactions;
  const { nonce, difficulty, timestamp } = blockchain.proofOfWork(
    lastBlock.currBlockHash,
    data
  );

  const currBlockHash = blockchain.hashBlock(
    timestamp,
    lastBlock.currBlockHash,
    data,
    nonce,
    difficulty
  );

  const block = blockchain.createBlock(
    timestamp,
    lastBlock.currBlockHash,
    currBlockHash,
    data,
    nonce,
    difficulty
  );

  blockchain.blockchainNodes.forEach(async url => {
    const body = { block };
    await fetch(`${url}/api/v1/blockchain/block/broadcast`, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(body);
  });

  const blockReward = {
    amount: 3,
    sender: '0000',
    recipient: blockchain.nodeUrl,
  };

  await fetch(
    `${blockchain.nodeUrl}/api/v1/transactions/transaction/broadcast`,
    {
      method: 'POST',
      body: JSON.stringify(blockReward),
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  await writeFileAsync(
    'logs',
    'blockchain.json',
    JSON.stringify(blockchain.chainOfBlocks, null, 2)
  );

  res.status(201).json(
    new ResponseModel({
      success: true,
      data: { message: 'Block created and broadcasted', block },
    })
  );
};

const updateBlockChain = async () => {
  try {
    const blockchainData = await readFileAsync('logs', 'blockchain.json');
    const newBlockchainData = JSON.parse(blockchainData);

    blockchain.chainOfBlocks = newBlockchainData;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log('The Blockchain JSON file does not exist');
      return;
    }
  }
};

export const updateChain = (req, res, next) => {
  const block = req.body;
  const lastBlock = blockchain.getLastBlock();
  const hash = lastBlock.currBlockHash === block.prevBlockHash;
  const index = lastBlock.blockIndex + 1 === block.blockIndex;

  if (hash && index) {
    blockchain.chainOfBlocks.push(block);
    blockchain.pendingTransactions = [];
    res.status(201).json(new ResponseModel({
      success: true,
      statusCode: 201,
      data: {
        message: 'The block was added and sent to the network',
        block: block,
      },
    }));
  } else {
    res.status(500).json(new ResponseModel({
      success: false,
      statusCode: 500,
      data: { message: 'The block was denied', block },
    }));
  }
};

export const syncChain = (req, res, next) => {
  const currLength = blockchain.chainOfBlocks.length;
  let maxLength = currLength;
  let longestChain = null;

  blockchain.blockchainNodes.forEach(async node => {
    const response = await fetch(`${node}/api/v1/blockchain`);
    if (response.ok) {
      const result = await response.json();

      if (result.data.chainOfBlocks.length > maxLength) {
        maxLength = result.data.chainOfBlocks.length;
        longestChain = result.data.chainOfBlocks;
      }

      if (
        !longestChain ||
        (longestChain && !blockchain.validateChain(longestChain))
      ) {
        console.log('You are synced');
      } else {
        blockchain.chainOfBlocks = longestChain;
      }
    }
  });

  res.status(200).json(new ResponseModel({
    success: true,
    statusCode: 200,
    data: { message: 'The synchronization is finished' },
  }));
};
