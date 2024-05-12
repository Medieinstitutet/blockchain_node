import express from 'express';
import {
  listMembers,
  registerNode,
} from '../controllers/nodeController.mjs';

const router = express.Router();

router.route('/').get(listMembers);
router.route('/register-node').post(registerNode);

export default router;
