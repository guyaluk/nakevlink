// DataConnect functions for Cloud Functions
// This is a simplified interface that mirrors the web app's DataConnect SDK

const { ConnectorConfig, DataConnect, executeQuery, executeMutation, queryRef, mutationRef, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'nakevlink-connector',
  service: 'nakevlink-dataconnect',
  location: 'us-central1'
};

// Initialize DataConnect instance for Cloud Functions
// Note: In Cloud Functions, we'd typically use the admin SDK
// For now, using the standard DataConnect SDK
let dataConnect;

function getDataConnect() {
  if (!dataConnect) {
    dataConnect = new DataConnect(connectorConfig);
  }
  return dataConnect;
}

// Query functions
async function getPunchCardById(vars) {
  const dc = getDataConnect();
  const ref = queryRef(dc, 'GetPunchCardById', vars);
  return executeQuery(ref);
}

async function getActivePunchCodes(vars) {
  const dc = getDataConnect();
  const ref = queryRef(dc, 'GetActivePunchCodes', vars);
  return executeQuery(ref);
}

async function getPunchCodeByCode(vars) {
  const dc = getDataConnect();
  const ref = queryRef(dc, 'GetPunchCodeByCode', vars);
  return executeQuery(ref);
}

async function getBusinessByEmail(vars) {
  const dc = getDataConnect();
  const ref = queryRef(dc, 'GetBusinessByEmail', vars);
  return executeQuery(ref);
}

async function getPunchesForCard(vars) {
  const dc = getDataConnect();
  const ref = queryRef(dc, 'GetPunchesForCard', vars);
  return executeQuery(ref);
}

// Mutation functions
async function createPunchCode(vars) {
  const dc = getDataConnect();
  const ref = mutationRef(dc, 'CreatePunchCode', vars);
  return executeMutation(ref);
}

async function addPunch(vars) {
  const dc = getDataConnect();
  const ref = mutationRef(dc, 'AddPunch', vars);
  return executeMutation(ref);
}

async function redeemPunchCode(vars) {
  const dc = getDataConnect();
  const ref = mutationRef(dc, 'RedeemPunchCode', vars);
  return executeMutation(ref);
}

module.exports = {
  getPunchCardById,
  getActivePunchCodes,
  getPunchCodeByCode,
  getBusinessByEmail,
  getPunchesForCard,
  createPunchCode,
  addPunch,
  redeemPunchCode
};