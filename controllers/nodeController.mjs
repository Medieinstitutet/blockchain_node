import { blockchain } from '../initBlockchain.mjs';

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
  // Ta ut ur req.body adressen till servern som vill bli medlem...
  const node = req.body;

  if (
    blockchain.blockchainNodes.indexOf(node.nodeUrl) === -1 &&
    blockchain.nodeUrl !== node.nodeUrl
  ) {
    blockchain.blockchainNodes.push(node.nodeUrl);
    // Synkronisering, skicka till den nya medlemmen/noden samma medlemmar/noder som jag har
    syncNodes(node.nodeUrl);

    res.status(201).json(
      new ResponseModel({
        success: true,
        statusCode: 201,
        data: { message: `The Node ${node.nodeUrl} has been registered!` },
      })
    );
  } else {
    res.status(400).json({
      success: false,
      statusCode: 400,
      data: { message: `This Node ${node.nodeUrl} is already registered!` },
    });
  }
};

const syncNodes = url => {
  // Skapa en array av alla mina medlemmar/noder samt lägga till mig själv...
  const nodes = [...blockchain.blockchainNodes, blockchain.nodeUrl];
  // Gå igenom varje medlem som finnns i members arrayen
  // Sedan skicka till varje medlem listan av medlemmar
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
