import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'nakevlink-connector',
  service: 'nakevlink-dataconnect',
  location: 'us-central1'
};

export const getUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUser', inputVars);
}
getUserRef.operationName = 'GetUser';

export function getUser(dcOrVars, vars) {
  return executeQuery(getUserRef(dcOrVars, vars));
}

export const getBusinessRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBusiness', inputVars);
}
getBusinessRef.operationName = 'GetBusiness';

export function getBusiness(dcOrVars, vars) {
  return executeQuery(getBusinessRef(dcOrVars, vars));
}

export const getBusinessesByCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBusinessesByCategory', inputVars);
}
getBusinessesByCategoryRef.operationName = 'GetBusinessesByCategory';

export function getBusinessesByCategory(dcOrVars, vars) {
  return executeQuery(getBusinessesByCategoryRef(dcOrVars, vars));
}

export const getAllBusinessesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAllBusinesses');
}
getAllBusinessesRef.operationName = 'GetAllBusinesses';

export function getAllBusinesses(dc) {
  return executeQuery(getAllBusinessesRef(dc));
}

export const getBusinessByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBusinessByEmail', inputVars);
}
getBusinessByEmailRef.operationName = 'GetBusinessByEmail';

export function getBusinessByEmail(dcOrVars, vars) {
  return executeQuery(getBusinessByEmailRef(dcOrVars, vars));
}

export const getBusinessPunchCardsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBusinessPunchCards', inputVars);
}
getBusinessPunchCardsRef.operationName = 'GetBusinessPunchCards';

export function getBusinessPunchCards(dcOrVars, vars) {
  return executeQuery(getBusinessPunchCardsRef(dcOrVars, vars));
}

export const getBusinessPunchesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBusinessPunches', inputVars);
}
getBusinessPunchesRef.operationName = 'GetBusinessPunches';

export function getBusinessPunches(dcOrVars, vars) {
  return executeQuery(getBusinessPunchesRef(dcOrVars, vars));
}

export const getBusinessPunchesTodayRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBusinessPunchesToday', inputVars);
}
getBusinessPunchesTodayRef.operationName = 'GetBusinessPunchesToday';

export function getBusinessPunchesToday(dcOrVars, vars) {
  return executeQuery(getBusinessPunchesTodayRef(dcOrVars, vars));
}

export const getUserPunchCardsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserPunchCards', inputVars);
}
getUserPunchCardsRef.operationName = 'GetUserPunchCards';

export function getUserPunchCards(dcOrVars, vars) {
  return executeQuery(getUserPunchCardsRef(dcOrVars, vars));
}

export const getUserPunchCardForBusinessRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserPunchCardForBusiness', inputVars);
}
getUserPunchCardForBusinessRef.operationName = 'GetUserPunchCardForBusiness';

export function getUserPunchCardForBusiness(dcOrVars, vars) {
  return executeQuery(getUserPunchCardForBusinessRef(dcOrVars, vars));
}

export const getActiveUserPunchCardForBusinessRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActiveUserPunchCardForBusiness', inputVars);
}
getActiveUserPunchCardForBusinessRef.operationName = 'GetActiveUserPunchCardForBusiness';

export function getActiveUserPunchCardForBusiness(dcOrVars, vars) {
  return executeQuery(getActiveUserPunchCardForBusinessRef(dcOrVars, vars));
}

export const getPunchCardByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPunchCardById', inputVars);
}
getPunchCardByIdRef.operationName = 'GetPunchCardById';

export function getPunchCardById(dcOrVars, vars) {
  return executeQuery(getPunchCardByIdRef(dcOrVars, vars));
}

export const getPunchesForCardRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPunchesForCard', inputVars);
}
getPunchesForCardRef.operationName = 'GetPunchesForCard';

export function getPunchesForCard(dcOrVars, vars) {
  return executeQuery(getPunchesForCardRef(dcOrVars, vars));
}

export const getPunchCodeByCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPunchCodeByCode', inputVars);
}
getPunchCodeByCodeRef.operationName = 'GetPunchCodeByCode';

export function getPunchCodeByCode(dcOrVars, vars) {
  return executeQuery(getPunchCodeByCodeRef(dcOrVars, vars));
}

export const getActivePunchCodesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetActivePunchCodes', inputVars);
}
getActivePunchCodesRef.operationName = 'GetActivePunchCodes';

export function getActivePunchCodes(dcOrVars, vars) {
  return executeQuery(getActivePunchCodesRef(dcOrVars, vars));
}

export const getUserForRecommendationsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserForRecommendations', inputVars);
}
getUserForRecommendationsRef.operationName = 'GetUserForRecommendations';

export function getUserForRecommendations(dcOrVars, vars) {
  return executeQuery(getUserForRecommendationsRef(dcOrVars, vars));
}

export const getBusinessesForRecommendationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBusinessesForRecommendations');
}
getBusinessesForRecommendationsRef.operationName = 'GetBusinessesForRecommendations';

export function getBusinessesForRecommendations(dc) {
  return executeQuery(getBusinessesForRecommendationsRef(dc));
}

export const getBusinessesByCategoriesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBusinessesByCategories', inputVars);
}
getBusinessesByCategoriesRef.operationName = 'GetBusinessesByCategories';

export function getBusinessesByCategories(dcOrVars, vars) {
  return executeQuery(getBusinessesByCategoriesRef(dcOrVars, vars));
}

export const getUserBehavioralDataRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserBehavioralData', inputVars);
}
getUserBehavioralDataRef.operationName = 'GetUserBehavioralData';

export function getUserBehavioralData(dcOrVars, vars) {
  return executeQuery(getUserBehavioralDataRef(dcOrVars, vars));
}

export const getPopularBusinessesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPopularBusinesses', inputVars);
}
getPopularBusinessesRef.operationName = 'GetPopularBusinesses';

export function getPopularBusinesses(dcOrVars, vars) {
  return executeQuery(getPopularBusinessesRef(dcOrVars, vars));
}

export const getSimilarBusinessesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSimilarBusinesses', inputVars);
}
getSimilarBusinessesRef.operationName = 'GetSimilarBusinesses';

export function getSimilarBusinesses(dcOrVars, vars) {
  return executeQuery(getSimilarBusinessesRef(dcOrVars, vars));
}

export const createUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateUser', inputVars);
}
createUserRef.operationName = 'CreateUser';

export function createUser(dcOrVars, vars) {
  return executeMutation(createUserRef(dcOrVars, vars));
}

export const createBusinessRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBusiness', inputVars);
}
createBusinessRef.operationName = 'CreateBusiness';

export function createBusiness(dcOrVars, vars) {
  return executeMutation(createBusinessRef(dcOrVars, vars));
}

export const createPunchCardRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePunchCard', inputVars);
}
createPunchCardRef.operationName = 'CreatePunchCard';

export function createPunchCard(dcOrVars, vars) {
  return executeMutation(createPunchCardRef(dcOrVars, vars));
}

export const createPunchCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePunchCode', inputVars);
}
createPunchCodeRef.operationName = 'CreatePunchCode';

export function createPunchCode(dcOrVars, vars) {
  return executeMutation(createPunchCodeRef(dcOrVars, vars));
}

export const redeemPunchCodeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RedeemPunchCode', inputVars);
}
redeemPunchCodeRef.operationName = 'RedeemPunchCode';

export function redeemPunchCode(dcOrVars, vars) {
  return executeMutation(redeemPunchCodeRef(dcOrVars, vars));
}

export const addPunchRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddPunch', inputVars);
}
addPunchRef.operationName = 'AddPunch';

export function addPunch(dcOrVars, vars) {
  return executeMutation(addPunchRef(dcOrVars, vars));
}

export const markPunchCardCompletedRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkPunchCardCompleted', inputVars);
}
markPunchCardCompletedRef.operationName = 'MarkPunchCardCompleted';

export function markPunchCardCompleted(dcOrVars, vars) {
  return executeMutation(markPunchCardCompletedRef(dcOrVars, vars));
}

