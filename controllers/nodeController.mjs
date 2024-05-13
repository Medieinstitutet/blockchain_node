import { blockchain } from '../initBlockchain.mjs';
import ErrorResponse from '../utilities/ErrorResponse.mjs';
import ResponseModel from '../utilities/ResponseModel.mjs';

export const listMembers = (req, res, next) => {
  res
    .status(200)
    .json(
      new ResponseModel({
        success: true,
        statusCode: 200,
        data: blockchain.blockchainNodes,
      })
    );
};

export const registerNode = (req, res, next) => {
  const node = req.body;

  if (
    blockchain.blockchainNodes.indexOf(node.nodeUrl) === -1 &&
    blockchain.nodeUrl !== node.nodeUrl
  ) {
    blockchain.blockchainNodes.push(node.nodeUrl);
    syncNodes(node.nodeUrl);

    res.status(201).json(
      new ResponseModel({
        success: true,
        statusCode: 201,
        data: { message: `The Node ${node.nodeUrl} has been registered!` },
      })
    );
  } else {
    res.status(400).json(new ErrorResponse({
      success: false,
      statusCode: 400,
      data: { message: `This Node ${node.nodeUrl} is already registered!` },
    }));
  }
};

const syncNodes = url => {
  const nodes = [...blockchain.blockchainNodes, blockchain.nodeUrl];
  try {
    nodes.forEach(async node => {
      const body = { nodeUrl: node };
      await fetch(`${url}/api/v1/nodes/register-node`, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      });
    });
  } catch (error) {
    console.log(error);
  }
};
