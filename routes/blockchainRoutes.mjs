import express from 'express';
import {
  createBlock,
  getBlockchain,
  syncChain,
  updateChain,
} from '../controllers/blockchainController.mjs';

const router = express.Router();

router.route('/').get(getBlockchain);
router.route('/create-block').post(createBlock);
router.route('/synchronize-chain').get(syncChain);
router.route('/block/broadcast').post(updateChain);

export default router;
