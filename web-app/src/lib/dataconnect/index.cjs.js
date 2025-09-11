const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'nakevlink-connector',
  service: 'nakevlink-dataconnect',
  location: 'us-central1'
};
exports.connectorConfig = connectorConfig;

const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';
exports.createUserRef = createUserRef;

exports.createUser = function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
};

const createBusinessRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBusiness', inputVars);
}
createBusinessRef.operationName = 'CreateBusiness';
exports.createBusinessRef = createBusinessRef;

exports.createBusiness = function createBusiness(dcOrVars, vars) {
  return executeMutation(createBusinessRef(dcOrVars, vars));
};

const createPunchCardRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePunchCard', inputVars);
}
createPunchCardRef.operationName = 'CreatePunchCard';
exports.createPunchCardRef = createPunchCardRef;

exports.createPunchCard = function createPunchCard(dcOrVars, vars) {
  return executeMutation(createPunchCardRef(dcOrVars, vars));
};

const createPunchCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePunchCode', inputVars);
}
createPunchCodeRef.operationName = 'CreatePunchCode';
exports.createPunchCodeRef = createPunchCodeRef;

exports.createPunchCode = function createPunchCode(dcOrVars, vars) {
  return executeMutation(createPunchCodeRef(dcOrVars, vars));
};

const redeemPunchCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RedeemPunchCode', inputVars);
}
redeemPunchCodeRef.operationName = 'RedeemPunchCode';
exports.redeemPunchCodeRef = redeemPunchCodeRef;

exports.redeemPunchCode = function redeemPunchCode(dcOrVars, vars) {
  return executeMutation(redeemPunchCodeRef(dcOrVars, vars));
};

const addPunchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddPunch', inputVars);
}
addPunchRef.operationName = 'AddPunch';
exports.addPunchRef = addPunchRef;

exports.addPunch = function addPunch(dcOrVars, vars) {
  return executeMutation(addPunchRef(dcOrVars, vars));
};

const getUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUser', inputVars);
}
getUserRef.operationName = 'GetUser';
exports.getUserRef = getUserRef;

exports.getUser = function getUser(dcOrVars, vars) {
  return executeQuery(getUserRef(dcOrVars, vars));
};

const getBusinessRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBusiness', inputVars);
}
getBusinessRef.operationName = 'GetBusiness';
exports.getBusinessRef = getBusinessRef;

exports.getBusiness = function getBusiness(dcOrVars, vars) {
  return executeQuery(getBusinessRef(dcOrVars, vars));
};

const getBusinessesByCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBusinessesByCategory', inputVars);
}
getBusinessesByCategoryRef.operationName = 'GetBusinessesByCategory';
exports.getBusinessesByCategoryRef = getBusinessesByCategoryRef;

exports.getBusinessesByCategory = function getBusinessesByCategory(dcOrVars, vars) {
  return executeQuery(getBusinessesByCategoryRef(dcOrVars, vars));
};

const getAllBusinessesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAllBusinesses');
}
getAllBusinessesRef.operationName = 'GetAllBusinesses';
exports.getAllBusinessesRef = getAllBusinessesRef;

exports.getAllBusinesses = function getAllBusinesses(dc) {
  return executeQuery(getAllBusinessesRef(dc));
};

const getBusinessByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBusinessByEmail', inputVars);
}
getBusinessByEmailRef.operationName = 'GetBusinessByEmail';
exports.getBusinessByEmailRef = getBusinessByEmailRef;

exports.getBusinessByEmail = function getBusinessByEmail(dcOrVars, vars) {
  return executeQuery(getBusinessByEmailRef(dcOrVars, vars));
};

const getBusinessPunchCardsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBusinessPunchCards', inputVars);
}
getBusinessPunchCardsRef.operationName = 'GetBusinessPunchCards';
exports.getBusinessPunchCardsRef = getBusinessPunchCardsRef;

exports.getBusinessPunchCards = function getBusinessPunchCards(dcOrVars, vars) {
  return executeQuery(getBusinessPunchCardsRef(dcOrVars, vars));
};

const getBusinessPunchesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBusinessPunches', inputVars);
}
getBusinessPunchesRef.operationName = 'GetBusinessPunches';
exports.getBusinessPunchesRef = getBusinessPunchesRef;

exports.getBusinessPunches = function getBusinessPunches(dcOrVars, vars) {
  return executeQuery(getBusinessPunchesRef(dcOrVars, vars));
};

const getBusinessPunchesTodayRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBusinessPunchesToday', inputVars);
}
getBusinessPunchesTodayRef.operationName = 'GetBusinessPunchesToday';
exports.getBusinessPunchesTodayRef = getBusinessPunchesTodayRef;

exports.getBusinessPunchesToday = function getBusinessPunchesToday(dcOrVars, vars) {
  return executeQuery(getBusinessPunchesTodayRef(dcOrVars, vars));
};

const getUserPunchCardsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserPunchCards', inputVars);
}
getUserPunchCardsRef.operationName = 'GetUserPunchCards';
exports.getUserPunchCardsRef = getUserPunchCardsRef;

exports.getUserPunchCards = function getUserPunchCards(dcOrVars, vars) {
  return executeQuery(getUserPunchCardsRef(dcOrVars, vars));
};

const getUserPunchCardForBusinessRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserPunchCardForBusiness', inputVars);
}
getUserPunchCardForBusinessRef.operationName = 'GetUserPunchCardForBusiness';
exports.getUserPunchCardForBusinessRef = getUserPunchCardForBusinessRef;

exports.getUserPunchCardForBusiness = function getUserPunchCardForBusiness(dcOrVars, vars) {
  return executeQuery(getUserPunchCardForBusinessRef(dcOrVars, vars));
};

const getActiveUserPunchCardForBusinessRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActiveUserPunchCardForBusiness', inputVars);
}
getActiveUserPunchCardForBusinessRef.operationName = 'GetActiveUserPunchCardForBusiness';
exports.getActiveUserPunchCardForBusinessRef = getActiveUserPunchCardForBusinessRef;

exports.getActiveUserPunchCardForBusiness = function getActiveUserPunchCardForBusiness(dcOrVars, vars) {
  return executeQuery(getActiveUserPunchCardForBusinessRef(dcOrVars, vars));
};

const getPunchCardByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPunchCardById', inputVars);
}
getPunchCardByIdRef.operationName = 'GetPunchCardById';
exports.getPunchCardByIdRef = getPunchCardByIdRef;

exports.getPunchCardById = function getPunchCardById(dcOrVars, vars) {
  return executeQuery(getPunchCardByIdRef(dcOrVars, vars));
};

const getPunchesForCardRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPunchesForCard', inputVars);
}
getPunchesForCardRef.operationName = 'GetPunchesForCard';
exports.getPunchesForCardRef = getPunchesForCardRef;

exports.getPunchesForCard = function getPunchesForCard(dcOrVars, vars) {
  return executeQuery(getPunchesForCardRef(dcOrVars, vars));
};

const getPunchCodeByCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPunchCodeByCode', inputVars);
}
getPunchCodeByCodeRef.operationName = 'GetPunchCodeByCode';
exports.getPunchCodeByCodeRef = getPunchCodeByCodeRef;

exports.getPunchCodeByCode = function getPunchCodeByCode(dcOrVars, vars) {
  return executeQuery(getPunchCodeByCodeRef(dcOrVars, vars));
};

const getActivePunchCodesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActivePunchCodes', inputVars);
}
getActivePunchCodesRef.operationName = 'GetActivePunchCodes';
exports.getActivePunchCodesRef = getActivePunchCodesRef;

exports.getActivePunchCodes = function getActivePunchCodes(dcOrVars, vars) {
  return executeQuery(getActivePunchCodesRef(dcOrVars, vars));
};

const getUserForRecommendationsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserForRecommendations', inputVars);
}
getUserForRecommendationsRef.operationName = 'GetUserForRecommendations';
exports.getUserForRecommendationsRef = getUserForRecommendationsRef;

exports.getUserForRecommendations = function getUserForRecommendations(dcOrVars, vars) {
  return executeQuery(getUserForRecommendationsRef(dcOrVars, vars));
};

const getBusinessesForRecommendationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBusinessesForRecommendations');
}
getBusinessesForRecommendationsRef.operationName = 'GetBusinessesForRecommendations';
exports.getBusinessesForRecommendationsRef = getBusinessesForRecommendationsRef;

exports.getBusinessesForRecommendations = function getBusinessesForRecommendations(dc) {
  return executeQuery(getBusinessesForRecommendationsRef(dc));
};

const getBusinessesByCategoriesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBusinessesByCategories', inputVars);
}
getBusinessesByCategoriesRef.operationName = 'GetBusinessesByCategories';
exports.getBusinessesByCategoriesRef = getBusinessesByCategoriesRef;

exports.getBusinessesByCategories = function getBusinessesByCategories(dcOrVars, vars) {
  return executeQuery(getBusinessesByCategoriesRef(dcOrVars, vars));
};

const getUserBehavioralDataRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserBehavioralData', inputVars);
}
getUserBehavioralDataRef.operationName = 'GetUserBehavioralData';
exports.getUserBehavioralDataRef = getUserBehavioralDataRef;

exports.getUserBehavioralData = function getUserBehavioralData(dcOrVars, vars) {
  return executeQuery(getUserBehavioralDataRef(dcOrVars, vars));
};

const getPopularBusinessesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPopularBusinesses', inputVars);
}
getPopularBusinessesRef.operationName = 'GetPopularBusinesses';
exports.getPopularBusinessesRef = getPopularBusinessesRef;

exports.getPopularBusinesses = function getPopularBusinesses(dcOrVars, vars) {
  return executeQuery(getPopularBusinessesRef(dcOrVars, vars));
};

const getSimilarBusinessesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSimilarBusinesses', inputVars);
}
getSimilarBusinessesRef.operationName = 'GetSimilarBusinesses';
exports.getSimilarBusinessesRef = getSimilarBusinessesRef;

exports.getSimilarBusinesses = function getSimilarBusinesses(dcOrVars, vars) {
  return executeQuery(getSimilarBusinessesRef(dcOrVars, vars));
};
