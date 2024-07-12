const { namespaceWrapper, _server } = require('@_koii/namespace-wrapper');
const Joi = require('joi');
const axios = require('axios');

// Setup the default task environment
beforeAll(async () => {
  await namespaceWrapper.defaultTaskSetup();
});

// Core logic for fetching crypto prices
async function fetchCryptoPrices() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
    console.log('response: ', response);
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto prices:', error);
  }
}

// Submit the task to the Koii network
async function submitTask(round) {
  const prices = await fetchCryptoPrices();
  await namespaceWrapper.submitTask(round, JSON.stringify(prices));
}

// Perform task logic and submit to Koii network
describe('Performing the task', () => {
  it('should perform the core logic task', async () => {
    const round = 1;
    const prices = await fetchCryptoPrices();
    expect(prices).toHaveProperty('bitcoin');
    expect(prices).toHaveProperty('ethereum');
  });

  it('should make the submission to k2 for dummy round 1', async () => {
    const round = 1;
    await submitTask(round);
    const taskState = await namespaceWrapper.getTaskState();
    const schema = Joi.object()
      .pattern(
        Joi.string(),
        Joi.object().pattern(
          Joi.string(),
          Joi.object({
            submission_value: Joi.string().required(),
            slot: Joi.number().integer().required(),
            round: Joi.number().integer().required(),
          }),
        ),
      )
      .required()
      .min(1);
    const validationResult = schema.validate(taskState.submissions);
    try {
      expect(validationResult.error).toBeUndefined();
    } catch (e) {
      throw new Error("Submission doesn't exist or is incorrect");
    }
  });

  // Other tests...

  it('should test the endpoint', async () => {
    const response = await axios.get('http://localhost:10000');
    expect(response.status).toBe(200);
    expect(response.data).toEqual('Hello World!');
  });
});

// Cleanup after tests
afterAll(async () => {
  _server.close();
});
