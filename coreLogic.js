const axios = require('axios');
const { namespaceWrapper } = require('@_koii/namespace-wrapper');

class CoreLogic {
  async task(round) {
    const prices = await this.fetchCryptoPrices();
    await namespaceWrapper.storeSet(round.toString(), JSON.stringify(prices));
    return prices;
  }

  async submitTask(round) {
    const prices = await this.fetchCryptoPrices();
    await namespaceWrapper.storeSet(round.toString(), JSON.stringify(prices));
    return prices;
  }

  async auditTask(round) {
    // Implement audit logic if necessary
  }

  async selectAndGenerateDistributionList(
    round,
    isPreviousRoundFailed = false,
  ) {
    await namespaceWrapper.selectAndGenerateDistributionList(
      this.submitDistributionList,
      round,
      isPreviousRoundFailed,
    );
  }

  async auditDistribution(round) {
    // Implement distribution audit logic if necessary
  }

  async fetchCryptoPrices() {
    try {
      const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd');
      return response.data;
    } catch (error) {
      console.error('Error fetching crypto prices:', error);
      return null;
    }
  }

  async submitDistributionList(round, distributionList) {
    // Implement logic to submit distribution list
  }
}
const coreLogic = new CoreLogic();

module.exports = { coreLogic };
