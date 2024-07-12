const { namespaceWrapper, _server } = require('@_koii/namespace-wrapper');
const Joi = require('joi');
const axios = require('axios');


// Perform task logic and submit to Koii network
/* describe('Performing the task', () => {
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
*/

const { namespaceWrapper } = require('@_koii/namespace-wrapper');
class Submission {
  /**
   * Executes your task, optionally storing the result.
   *
   * @param {number} round - The current round number
   * @returns {void}
   */
  async task(round) {
    console.log('Started Task', new Date(), process.env.TEST_KEYWORD)
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
      console.log('response: ', response);
      const value = response.data
      // Store the result in NeDB (optional)
      if (value) {
        await namespaceWrapper.storeSet('value', value);
      }
      // Optional, return your task
      return value;
    } catch (err) {
      console.log('ERROR IN EXECUTING TASK', err);
      return 'ERROR IN EXECUTING TASK' + err;
    }
  }

  /**
   * Submits a task for a given round
   *
   * @param {number} round - The current round number
   * @returns {Promise<any>} The submission value that you will use in audit. Ex. cid of the IPFS file
   */
  async submitTask(round) {
    console.log('SUBMIT TASK CALLED ROUND NUMBER', round);
    try {
      console.log('SUBMIT TASK SLOT', await namespaceWrapper.getSlot());
      const submission = await this.fetchSubmission(round);
      console.log('SUBMISSION', submission);
      await namespaceWrapper.checkSubmissionAndUpdateRound(submission, round);
      console.log('SUBMISSION CHECKED AND ROUND UPDATED');
      return submission;
    } catch (error) {
      console.log('ERROR IN SUBMISSION', error);
    }
  }
  /**
   * Fetches the submission value
   *
   * @param {number} round - The current round number
   * @returns {Promise<string>} The submission value that you will use in audit. It can be the real value, cid, etc.
   *
   */
  async fetchSubmission(round) {
    console.log('Started Submission', new Date(), process.env.TEST_KEYWORD)
    console.log('FETCH SUBMISSION');
    // Fetch the value from NeDB
    const value = await namespaceWrapper.storeGet('value'); // retrieves the value
    // Return cid/value, etc.
    return value;
  }
}
const submission = new Submission();
module.exports = { submission };
