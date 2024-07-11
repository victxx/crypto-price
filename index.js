const { coreLogic } = require('./coreLogic');
const {
  namespaceWrapper,
  taskNodeAdministered,
  app,
} = require('@_koii/namespace-wrapper');

if (app) {
  // API para obtener el estado de la tarea
  app.get('/taskState', async (req, res) => {
    const state = await namespaceWrapper.getTaskState({
      is_stake_list_required: true,
    });
    console.log('TASK STATE', state);
    res.status(200).json({ taskState: state });
  });

  // API para obtener el valor almacenado
  app.get('/value', async (req, res) => {
    const value = await namespaceWrapper.storeGet('value');
    console.log('value', value);
    res.status(200).json({ value: value });
  });
}

async function setup() {
  await namespaceWrapper.defaultTaskSetup();
  process.on('message', m => {
    console.log('CHILD got message:', m);
    if (m.functionCall == 'submitPayload') {
      console.log('submitPayload called');
      coreLogic.submitTask(m.roundNumber);
    } else if (m.functionCall == 'auditPayload') {
      console.log('auditPayload called');
      coreLogic.auditTask(m.roundNumber);
    } else if (m.functionCall == 'executeTask') {
      console.log('executeTask called');
      coreLogic.task(m.roundNumber);
    } else if (m.functionCall == 'generateAndSubmitDistributionList') {
      console.log('generateAndSubmitDistributionList called');
      coreLogic.selectAndGenerateDistributionList(
        m.roundNumber,
        m.isPreviousRoundFailed,
      );
    } else if (m.functionCall == 'distributionListAudit') {
      console.log('distributionListAudit called');
      coreLogic.auditDistribution(m.roundNumber);
    }
  });
}

if (taskNodeAdministered) {
  setup();
}
