import { createHash } from '../utilities/cryptoLib.mjs';
import Block from './Block.mjs';
import Transaction from './Transaction.mjs';

export default class Blockchain {
  constructor() {
    this.chainOfBlocks = [];
    this.blockchainNodes = [];
    this.pendingTransactions = [];
    this.nodeUrl = process.argv[3];

    this.createBlock(Date.now(), '0', '0', [], 1500, process.env.DIFFICULTY);
    
    console.log('DIFFICULTY', process.env.DIFFICULTY);
  }

  createBlock(
    timestamp,
    prevBlockHash,
    currBlockHash,
    data,
    nonce,
    difficulty
  ) {
    const block = new Block(
      timestamp,
      this.chainOfBlocks.length + 1,
      prevBlockHash,
      currBlockHash,
      data,
      nonce,
      difficulty
    );

    this.pendingTransactions = [];
    this.chainOfBlocks.push(block);

    return block;
  }

  createTransaction(amount, sender, recipient) {
    return new Transaction(amount, sender, recipient);
  }

  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);
    return this.getLastBlock().blockIndex + 1;
  }

  getLastBlock() {
    return this.chainOfBlocks.at(-1);
  }

  hashBlock(timestamp, prevBlockHash, currBlockData, nonce, difficulty) {
    const stringToHash =
      timestamp.toString() +
      prevBlockHash +
      JSON.stringify(currBlockData) +
      nonce +
      difficulty;
    const hash = createHash(stringToHash);

    return hash;
  }

  validateChain(blockchain) {
    let isValid = true;

    for (let i = 1; i < blockchain.length; i++) {
      const currBlock = blockchain[i];
      const prevBlock = blockchain[i - 1];

      const hash = this.hashBlock(
        currBlock.timestamp,
        prevBlock.currentBlockHash,
        currBlock.data
      );

      if (hash !== currBlock.currBlockHash) isValid = false;
      if (currBlock.prevBlockHash !== prevBlock.currBlockHash)
        isValid = false;
    }

    return isValid;
  }

  proofOfWork(prevBlockHash, data) {
    const lastBlock = this.getLastBlock();
    let difficulty;
    let hash;
    let timestamp;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();

      difficulty = this.difficultyAdjustment(lastBlock, timestamp);
      hash = this.hashBlock(
        timestamp,
        prevBlockHash,
        data,
        nonce,
        difficulty
      );
    } while (hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return { nonce, difficulty, timestamp };
  }

  difficultyAdjustment(lastBlock, timestamp) {
    const MINE_RATE = process.env.MINE_RATE;
    let { difficulty } = lastBlock;

    if (difficulty < 1) return 1;

    return timestamp - lastBlock.timestamp > MINE_RATE
      ? +difficulty - 1
      : +difficulty + 1;
  }
}
