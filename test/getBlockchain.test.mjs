import { describe, it, expect } from 'vitest';
import { getBlockchain } from '../controllers/blockchainController.mjs';

describe('getBlockchain', () => {
  it('should return a response containing a "data" field', async () => {
    // Simulating a minimal response object
    const mockRes = {
      status(code) {
        this.code = code;
        return this; // allows chaining
      },
      json(data) {
        this.data = data;
        return this; // allows chaining
      }
    };

    // Execute the function
    await getBlockchain(null, mockRes, null);

    // Assertions
    expect(mockRes.code).toBe(200); // Check if the status code is set to 200
    expect(mockRes.data).toHaveProperty('data'); // Check for the presence of a 'data' field
  });
});