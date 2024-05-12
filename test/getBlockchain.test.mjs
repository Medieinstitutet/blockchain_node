import { describe, it, expect } from 'vitest';
import Blockchain from '../models/Blockchain.mjs';
import Transaction from '../models/Transaction.mjs';

describe('Transaction Handling', () => {
  it('should add a transaction to the pending transactions list', () => {
    const blockchain = new Blockchain();
    const transaction = new Transaction(100, 'senderAddress', 'recipientAddress');
    blockchain.addTransaction(transaction);

    expect(blockchain.pendingTransactions.length).toBe(1); // Check that the transaction list is not empty
    expect(blockchain.pendingTransactions[0]).toBe(transaction); // Check that the transaction is the one we added
  });
});
