import express from 'express';
import {
  createTransaction,
  broadcastTransaction,
} from '../controllers/transactionController.mjs';

const router = express.Router();

router.route('/transaction').post(createTransaction);
router.route('/transaction/broadcast').post(broadcastTransaction);

export default router;
