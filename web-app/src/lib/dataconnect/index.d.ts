import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddPunchData {
  punch_insert: Punch_Key;
}

export interface AddPunchVariables {
  cardId: string;
  punchTime?: TimestampString | null;
}

export interface Business_Key {
  id: string;
  __typename?: 'Business_Key';
}

export interface CreateBusinessData {
  business_insert: Business_Key;
}

export interface CreateBusinessVariables {
  id?: string | null;
  name: string;
  contactName?: string | null;
  email?: string | null;
  phoneNumber?: string | null;
  address?: string | null;
  categoryId: number;
  image?: string | null;
  description?: string | null;
  punchNum?: number | null;
  expirationDurationInDays?: number | null;
  latitude?: number | null;
  longitude?: number | null;
  createdDatetime?: TimestampString | null;
}

export interface CreatePunchCardData {
  punchCard_insert: PunchCard_Key;
}

export interface CreatePunchCardVariables {
  businessId: string;
  userId: string;
  maxPunches: number;
  expiresAt: TimestampString;
  createdAt?: TimestampString | null;
}

export interface CreatePunchCodeData {
  punchCode_insert: PunchCode_Key;
}

export interface CreatePunchCodeVariables {
  code: string;
  cardId: string;
  businessId: string;
  userId: string;
  expiresAt: TimestampString;
  createdAt?: TimestampString | null;
}

export interface CreateUserData {
  user_insert: User_Key;
}

export interface CreateUserVariables {
  id: string;
  name: string;
  email: string;
  favoriteCategory?: number | null;
  createdDatetime?: TimestampString | null;
}

export interface GetActivePunchCodesData {
  punchCodes: ({
    id: string;
    code: string;
    cardId: string;
    expiresAt: TimestampString;
    createdAt?: TimestampString | null;
    card: {
      business: {
        name: string;
      };
    };
  } & PunchCode_Key)[];
}

export interface GetActivePunchCodesVariables {
  userId: string;
  now: TimestampString;
}

export interface GetActiveUserPunchCardForBusinessData {
  punchCards: ({
    id: string;
    businessId: string;
    userId: string;
    maxPunches: number;
    createdAt?: TimestampString | null;
    expiresAt: TimestampString;
    business: {
      id: string;
      name: string;
      categoryId: number;
      image?: string | null;
      description?: string | null;
      address?: string | null;
      phoneNumber?: string | null;
      punchNum?: number | null;
      expirationDurationInDays?: number | null;
      latitude?: number | null;
      longitude?: number | null;
    } & Business_Key;
  } & PunchCard_Key)[];
}

export interface GetActiveUserPunchCardForBusinessVariables {
  userId: string;
  businessId: string;
  now: TimestampString;
}

export interface GetAllBusinessesData {
  businesses: ({
    id: string;
    name: string;
    description?: string | null;
    punchNum?: number | null;
    expirationDurationInDays?: number | null;
    categoryId: number;
    image?: string | null;
    address?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  } & Business_Key)[];
}

export interface GetBusinessByEmailData {
  businesses: ({
    id: string;
    name: string;
    contactName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    categoryId: number;
    image?: string | null;
    description?: string | null;
    punchNum?: number | null;
    expirationDurationInDays?: number | null;
    latitude?: number | null;
    longitude?: number | null;
    createdDatetime?: TimestampString | null;
  } & Business_Key)[];
}

export interface GetBusinessByEmailVariables {
  email: string;
}

export interface GetBusinessData {
  business?: {
    id: string;
    name: string;
    contactName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    address?: string | null;
    categoryId: number;
    image?: string | null;
    description?: string | null;
    punchNum?: number | null;
    expirationDurationInDays?: number | null;
    latitude?: number | null;
    longitude?: number | null;
    createdDatetime?: TimestampString | null;
  } & Business_Key;
}

export interface GetBusinessPunchCardsData {
  punchCards: ({
    id: string;
    businessId: string;
    userId: string;
    maxPunches: number;
    createdAt?: TimestampString | null;
    expiresAt: TimestampString;
    user: {
      id: string;
      name: string;
      email: string;
    } & User_Key;
  } & PunchCard_Key)[];
}

export interface GetBusinessPunchCardsVariables {
  businessId: string;
}

export interface GetBusinessPunchesData {
  punchCards: ({
    id: string;
    maxPunches: number;
    createdAt?: TimestampString | null;
    expiresAt: TimestampString;
    user: {
      name: string;
      email: string;
    };
  } & PunchCard_Key)[];
}

export interface GetBusinessPunchesTodayData {
  punchCards: ({
    id: string;
    maxPunches: number;
    createdAt?: TimestampString | null;
    expiresAt: TimestampString;
  } & PunchCard_Key)[];
}

export interface GetBusinessPunchesTodayVariables {
  businessId: string;
  todayStart: TimestampString;
}

export interface GetBusinessPunchesVariables {
  businessId: string;
}

export interface GetBusinessVariables {
  id: string;
}

export interface GetBusinessesByCategoriesData {
  businesses: ({
    id: string;
    name: string;
    description?: string | null;
    categoryId: number;
    address?: string | null;
    image?: string | null;
    punchNum?: number | null;
    expirationDurationInDays?: number | null;
    contactName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
  } & Business_Key)[];
}

export interface GetBusinessesByCategoriesVariables {
  categoryIds: number[];
}

export interface GetBusinessesByCategoryData {
  businesses: ({
    id: string;
    name: string;
    description?: string | null;
    punchNum?: number | null;
    expirationDurationInDays?: number | null;
    categoryId: number;
  } & Business_Key)[];
}

export interface GetBusinessesByCategoryVariables {
  categoryId: number;
}

export interface GetBusinessesForRecommendationsData {
  businesses: ({
    id: string;
    name: string;
    description?: string | null;
    categoryId: number;
    address?: string | null;
    image?: string | null;
    punchNum?: number | null;
    expirationDurationInDays?: number | null;
    contactName?: string | null;
    email?: string | null;
    phoneNumber?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    createdDatetime?: TimestampString | null;
  } & Business_Key)[];
}

export interface GetPopularBusinessesData {
  businesses: ({
    id: string;
    name: string;
    description?: string | null;
    categoryId: number;
    address?: string | null;
    image?: string | null;
    punchNum?: number | null;
    expirationDurationInDays?: number | null;
    latitude?: number | null;
    longitude?: number | null;
  } & Business_Key)[];
}

export interface GetPopularBusinessesVariables {
  limit: number;
}

export interface GetPunchCardByIdData {
  punchCard?: {
    id: string;
    businessId: string;
    userId: string;
    maxPunches: number;
    createdAt?: TimestampString | null;
    expiresAt: TimestampString;
    business: {
      id: string;
      name: string;
      categoryId: number;
      image?: string | null;
      description?: string | null;
      address?: string | null;
      phoneNumber?: string | null;
      punchNum?: number | null;
      expirationDurationInDays?: number | null;
      latitude?: number | null;
      longitude?: number | null;
    } & Business_Key;
      user: {
        id: string;
        name: string;
        email: string;
      } & User_Key;
  } & PunchCard_Key;
}

export interface GetPunchCardByIdVariables {
  id: string;
}

export interface GetPunchCodeByCodeData {
  punchCodes: ({
    id: string;
    code: string;
    cardId: string;
    businessId: string;
    userId: string;
    createdAt?: TimestampString | null;
    expiresAt: TimestampString;
    usedAt?: TimestampString | null;
    isUsed?: boolean | null;
    card: {
      id: string;
      maxPunches: number;
      expiresAt: TimestampString;
      business: {
        id: string;
        name: string;
      } & Business_Key;
        user: {
          id: string;
          name: string;
          email: string;
        } & User_Key;
    } & PunchCard_Key;
  } & PunchCode_Key)[];
}

export interface GetPunchCodeByCodeVariables {
  code: string;
}

export interface GetPunchesForCardData {
  punches: ({
    id: string;
    punchTime?: TimestampString | null;
  } & Punch_Key)[];
}

export interface GetPunchesForCardVariables {
  cardId: string;
}

export interface GetSimilarBusinessesData {
  punchCards: ({
    business: {
      categoryId: number;
    };
  })[];
    businesses: ({
      id: string;
      name: string;
      description?: string | null;
      categoryId: number;
      address?: string | null;
      image?: string | null;
      punchNum?: number | null;
      expirationDurationInDays?: number | null;
      latitude?: number | null;
      longitude?: number | null;
    } & Business_Key)[];
}

export interface GetSimilarBusinessesVariables {
  userId: string;
  excludeBusinessIds: string[];
}

export interface GetUserBehavioralDataData {
  punchCards: ({
    id: string;
    businessId: string;
    maxPunches: number;
    createdAt?: TimestampString | null;
    business: {
      id: string;
      name: string;
      categoryId: number;
    } & Business_Key;
  } & PunchCard_Key)[];
}

export interface GetUserBehavioralDataVariables {
  userId: string;
}

export interface GetUserData {
  user?: {
    id: string;
    name: string;
    email: string;
    favoriteCategory?: number | null;
    createdDatetime?: TimestampString | null;
  } & User_Key;
}

export interface GetUserForRecommendationsData {
  user?: {
    id: string;
    name: string;
    email: string;
    favoriteCategory?: number | null;
    createdDatetime?: TimestampString | null;
  } & User_Key;
    punchCards: ({
      id: string;
      businessId: string;
      userId: string;
      maxPunches: number;
      createdAt?: TimestampString | null;
      expiresAt: TimestampString;
      business: {
        id: string;
        name: string;
        description?: string | null;
        categoryId: number;
        address?: string | null;
        image?: string | null;
        punchNum?: number | null;
        expirationDurationInDays?: number | null;
        latitude?: number | null;
        longitude?: number | null;
      } & Business_Key;
    } & PunchCard_Key)[];
}

export interface GetUserForRecommendationsVariables {
  userId: string;
}

export interface GetUserPunchCardForBusinessData {
  punchCards: ({
    id: string;
    businessId: string;
    userId: string;
    maxPunches: number;
    createdAt?: TimestampString | null;
    expiresAt: TimestampString;
    business: {
      id: string;
      name: string;
      categoryId: number;
      image?: string | null;
      description?: string | null;
      address?: string | null;
      latitude?: number | null;
      longitude?: number | null;
    } & Business_Key;
  } & PunchCard_Key)[];
}

export interface GetUserPunchCardForBusinessVariables {
  userId: string;
  businessId: string;
}

export interface GetUserPunchCardsData {
  punchCards: ({
    id: string;
    businessId: string;
    userId: string;
    maxPunches: number;
    createdAt?: TimestampString | null;
    expiresAt: TimestampString;
    business: {
      id: string;
      name: string;
      categoryId: number;
      image?: string | null;
      description?: string | null;
      address?: string | null;
      latitude?: number | null;
      longitude?: number | null;
    } & Business_Key;
  } & PunchCard_Key)[];
}

export interface GetUserPunchCardsVariables {
  userId: string;
}

export interface GetUserVariables {
  id: string;
}

export interface MarkPunchCardCompletedData {
  punchCard_update?: PunchCard_Key | null;
}

export interface MarkPunchCardCompletedVariables {
  cardId: string;
  completedAt?: TimestampString | null;
}

export interface PunchCard_Key {
  id: string;
  __typename?: 'PunchCard_Key';
}

export interface PunchCode_Key {
  id: string;
  __typename?: 'PunchCode_Key';
}

export interface Punch_Key {
  id: string;
  __typename?: 'Punch_Key';
}

export interface RedeemPunchCodeData {
  punchCode_update?: PunchCode_Key | null;
}

export interface RedeemPunchCodeVariables {
  codeId: string;
  usedAt: TimestampString;
}

export interface UpdateBusinessCoordinatesData {
  business_update?: Business_Key | null;
}

export interface UpdateBusinessCoordinatesVariables {
  businessId: string;
  latitude: number;
  longitude: number;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface CreateUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
  operationName: string;
}
export const createUserRef: CreateUserRef;

export function createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;
export function createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBusinessVariables): MutationRef<CreateBusinessData, CreateBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateBusinessVariables): MutationRef<CreateBusinessData, CreateBusinessVariables>;
  operationName: string;
}
export const createBusinessRef: CreateBusinessRef;

export function createBusiness(vars: CreateBusinessVariables): MutationPromise<CreateBusinessData, CreateBusinessVariables>;
export function createBusiness(dc: DataConnect, vars: CreateBusinessVariables): MutationPromise<CreateBusinessData, CreateBusinessVariables>;

interface CreatePunchCardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePunchCardVariables): MutationRef<CreatePunchCardData, CreatePunchCardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePunchCardVariables): MutationRef<CreatePunchCardData, CreatePunchCardVariables>;
  operationName: string;
}
export const createPunchCardRef: CreatePunchCardRef;

export function createPunchCard(vars: CreatePunchCardVariables): MutationPromise<CreatePunchCardData, CreatePunchCardVariables>;
export function createPunchCard(dc: DataConnect, vars: CreatePunchCardVariables): MutationPromise<CreatePunchCardData, CreatePunchCardVariables>;

interface CreatePunchCodeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePunchCodeVariables): MutationRef<CreatePunchCodeData, CreatePunchCodeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreatePunchCodeVariables): MutationRef<CreatePunchCodeData, CreatePunchCodeVariables>;
  operationName: string;
}
export const createPunchCodeRef: CreatePunchCodeRef;

export function createPunchCode(vars: CreatePunchCodeVariables): MutationPromise<CreatePunchCodeData, CreatePunchCodeVariables>;
export function createPunchCode(dc: DataConnect, vars: CreatePunchCodeVariables): MutationPromise<CreatePunchCodeData, CreatePunchCodeVariables>;

interface RedeemPunchCodeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RedeemPunchCodeVariables): MutationRef<RedeemPunchCodeData, RedeemPunchCodeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RedeemPunchCodeVariables): MutationRef<RedeemPunchCodeData, RedeemPunchCodeVariables>;
  operationName: string;
}
export const redeemPunchCodeRef: RedeemPunchCodeRef;

export function redeemPunchCode(vars: RedeemPunchCodeVariables): MutationPromise<RedeemPunchCodeData, RedeemPunchCodeVariables>;
export function redeemPunchCode(dc: DataConnect, vars: RedeemPunchCodeVariables): MutationPromise<RedeemPunchCodeData, RedeemPunchCodeVariables>;

interface AddPunchRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddPunchVariables): MutationRef<AddPunchData, AddPunchVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddPunchVariables): MutationRef<AddPunchData, AddPunchVariables>;
  operationName: string;
}
export const addPunchRef: AddPunchRef;

export function addPunch(vars: AddPunchVariables): MutationPromise<AddPunchData, AddPunchVariables>;
export function addPunch(dc: DataConnect, vars: AddPunchVariables): MutationPromise<AddPunchData, AddPunchVariables>;

interface MarkPunchCardCompletedRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkPunchCardCompletedVariables): MutationRef<MarkPunchCardCompletedData, MarkPunchCardCompletedVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: MarkPunchCardCompletedVariables): MutationRef<MarkPunchCardCompletedData, MarkPunchCardCompletedVariables>;
  operationName: string;
}
export const markPunchCardCompletedRef: MarkPunchCardCompletedRef;

export function markPunchCardCompleted(vars: MarkPunchCardCompletedVariables): MutationPromise<MarkPunchCardCompletedData, MarkPunchCardCompletedVariables>;
export function markPunchCardCompleted(dc: DataConnect, vars: MarkPunchCardCompletedVariables): MutationPromise<MarkPunchCardCompletedData, MarkPunchCardCompletedVariables>;

interface UpdateBusinessCoordinatesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBusinessCoordinatesVariables): MutationRef<UpdateBusinessCoordinatesData, UpdateBusinessCoordinatesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateBusinessCoordinatesVariables): MutationRef<UpdateBusinessCoordinatesData, UpdateBusinessCoordinatesVariables>;
  operationName: string;
}
export const updateBusinessCoordinatesRef: UpdateBusinessCoordinatesRef;

export function updateBusinessCoordinates(vars: UpdateBusinessCoordinatesVariables): MutationPromise<UpdateBusinessCoordinatesData, UpdateBusinessCoordinatesVariables>;
export function updateBusinessCoordinates(dc: DataConnect, vars: UpdateBusinessCoordinatesVariables): MutationPromise<UpdateBusinessCoordinatesData, UpdateBusinessCoordinatesVariables>;

interface GetUserRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
  operationName: string;
}
export const getUserRef: GetUserRef;

export function getUser(vars: GetUserVariables): QueryPromise<GetUserData, GetUserVariables>;
export function getUser(dc: DataConnect, vars: GetUserVariables): QueryPromise<GetUserData, GetUserVariables>;

interface GetBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessVariables): QueryRef<GetBusinessData, GetBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBusinessVariables): QueryRef<GetBusinessData, GetBusinessVariables>;
  operationName: string;
}
export const getBusinessRef: GetBusinessRef;

export function getBusiness(vars: GetBusinessVariables): QueryPromise<GetBusinessData, GetBusinessVariables>;
export function getBusiness(dc: DataConnect, vars: GetBusinessVariables): QueryPromise<GetBusinessData, GetBusinessVariables>;

interface GetBusinessesByCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessesByCategoryVariables): QueryRef<GetBusinessesByCategoryData, GetBusinessesByCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBusinessesByCategoryVariables): QueryRef<GetBusinessesByCategoryData, GetBusinessesByCategoryVariables>;
  operationName: string;
}
export const getBusinessesByCategoryRef: GetBusinessesByCategoryRef;

export function getBusinessesByCategory(vars: GetBusinessesByCategoryVariables): QueryPromise<GetBusinessesByCategoryData, GetBusinessesByCategoryVariables>;
export function getBusinessesByCategory(dc: DataConnect, vars: GetBusinessesByCategoryVariables): QueryPromise<GetBusinessesByCategoryData, GetBusinessesByCategoryVariables>;

interface GetAllBusinessesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAllBusinessesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetAllBusinessesData, undefined>;
  operationName: string;
}
export const getAllBusinessesRef: GetAllBusinessesRef;

export function getAllBusinesses(): QueryPromise<GetAllBusinessesData, undefined>;
export function getAllBusinesses(dc: DataConnect): QueryPromise<GetAllBusinessesData, undefined>;

interface GetBusinessByEmailRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessByEmailVariables): QueryRef<GetBusinessByEmailData, GetBusinessByEmailVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBusinessByEmailVariables): QueryRef<GetBusinessByEmailData, GetBusinessByEmailVariables>;
  operationName: string;
}
export const getBusinessByEmailRef: GetBusinessByEmailRef;

export function getBusinessByEmail(vars: GetBusinessByEmailVariables): QueryPromise<GetBusinessByEmailData, GetBusinessByEmailVariables>;
export function getBusinessByEmail(dc: DataConnect, vars: GetBusinessByEmailVariables): QueryPromise<GetBusinessByEmailData, GetBusinessByEmailVariables>;

interface GetBusinessPunchCardsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessPunchCardsVariables): QueryRef<GetBusinessPunchCardsData, GetBusinessPunchCardsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBusinessPunchCardsVariables): QueryRef<GetBusinessPunchCardsData, GetBusinessPunchCardsVariables>;
  operationName: string;
}
export const getBusinessPunchCardsRef: GetBusinessPunchCardsRef;

export function getBusinessPunchCards(vars: GetBusinessPunchCardsVariables): QueryPromise<GetBusinessPunchCardsData, GetBusinessPunchCardsVariables>;
export function getBusinessPunchCards(dc: DataConnect, vars: GetBusinessPunchCardsVariables): QueryPromise<GetBusinessPunchCardsData, GetBusinessPunchCardsVariables>;

interface GetBusinessPunchesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessPunchesVariables): QueryRef<GetBusinessPunchesData, GetBusinessPunchesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBusinessPunchesVariables): QueryRef<GetBusinessPunchesData, GetBusinessPunchesVariables>;
  operationName: string;
}
export const getBusinessPunchesRef: GetBusinessPunchesRef;

export function getBusinessPunches(vars: GetBusinessPunchesVariables): QueryPromise<GetBusinessPunchesData, GetBusinessPunchesVariables>;
export function getBusinessPunches(dc: DataConnect, vars: GetBusinessPunchesVariables): QueryPromise<GetBusinessPunchesData, GetBusinessPunchesVariables>;

interface GetBusinessPunchesTodayRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessPunchesTodayVariables): QueryRef<GetBusinessPunchesTodayData, GetBusinessPunchesTodayVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBusinessPunchesTodayVariables): QueryRef<GetBusinessPunchesTodayData, GetBusinessPunchesTodayVariables>;
  operationName: string;
}
export const getBusinessPunchesTodayRef: GetBusinessPunchesTodayRef;

export function getBusinessPunchesToday(vars: GetBusinessPunchesTodayVariables): QueryPromise<GetBusinessPunchesTodayData, GetBusinessPunchesTodayVariables>;
export function getBusinessPunchesToday(dc: DataConnect, vars: GetBusinessPunchesTodayVariables): QueryPromise<GetBusinessPunchesTodayData, GetBusinessPunchesTodayVariables>;

interface GetUserPunchCardsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserPunchCardsVariables): QueryRef<GetUserPunchCardsData, GetUserPunchCardsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserPunchCardsVariables): QueryRef<GetUserPunchCardsData, GetUserPunchCardsVariables>;
  operationName: string;
}
export const getUserPunchCardsRef: GetUserPunchCardsRef;

export function getUserPunchCards(vars: GetUserPunchCardsVariables): QueryPromise<GetUserPunchCardsData, GetUserPunchCardsVariables>;
export function getUserPunchCards(dc: DataConnect, vars: GetUserPunchCardsVariables): QueryPromise<GetUserPunchCardsData, GetUserPunchCardsVariables>;

interface GetUserPunchCardForBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserPunchCardForBusinessVariables): QueryRef<GetUserPunchCardForBusinessData, GetUserPunchCardForBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserPunchCardForBusinessVariables): QueryRef<GetUserPunchCardForBusinessData, GetUserPunchCardForBusinessVariables>;
  operationName: string;
}
export const getUserPunchCardForBusinessRef: GetUserPunchCardForBusinessRef;

export function getUserPunchCardForBusiness(vars: GetUserPunchCardForBusinessVariables): QueryPromise<GetUserPunchCardForBusinessData, GetUserPunchCardForBusinessVariables>;
export function getUserPunchCardForBusiness(dc: DataConnect, vars: GetUserPunchCardForBusinessVariables): QueryPromise<GetUserPunchCardForBusinessData, GetUserPunchCardForBusinessVariables>;

interface GetActiveUserPunchCardForBusinessRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActiveUserPunchCardForBusinessVariables): QueryRef<GetActiveUserPunchCardForBusinessData, GetActiveUserPunchCardForBusinessVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetActiveUserPunchCardForBusinessVariables): QueryRef<GetActiveUserPunchCardForBusinessData, GetActiveUserPunchCardForBusinessVariables>;
  operationName: string;
}
export const getActiveUserPunchCardForBusinessRef: GetActiveUserPunchCardForBusinessRef;

export function getActiveUserPunchCardForBusiness(vars: GetActiveUserPunchCardForBusinessVariables): QueryPromise<GetActiveUserPunchCardForBusinessData, GetActiveUserPunchCardForBusinessVariables>;
export function getActiveUserPunchCardForBusiness(dc: DataConnect, vars: GetActiveUserPunchCardForBusinessVariables): QueryPromise<GetActiveUserPunchCardForBusinessData, GetActiveUserPunchCardForBusinessVariables>;

interface GetPunchCardByIdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPunchCardByIdVariables): QueryRef<GetPunchCardByIdData, GetPunchCardByIdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPunchCardByIdVariables): QueryRef<GetPunchCardByIdData, GetPunchCardByIdVariables>;
  operationName: string;
}
export const getPunchCardByIdRef: GetPunchCardByIdRef;

export function getPunchCardById(vars: GetPunchCardByIdVariables): QueryPromise<GetPunchCardByIdData, GetPunchCardByIdVariables>;
export function getPunchCardById(dc: DataConnect, vars: GetPunchCardByIdVariables): QueryPromise<GetPunchCardByIdData, GetPunchCardByIdVariables>;

interface GetPunchesForCardRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPunchesForCardVariables): QueryRef<GetPunchesForCardData, GetPunchesForCardVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPunchesForCardVariables): QueryRef<GetPunchesForCardData, GetPunchesForCardVariables>;
  operationName: string;
}
export const getPunchesForCardRef: GetPunchesForCardRef;

export function getPunchesForCard(vars: GetPunchesForCardVariables): QueryPromise<GetPunchesForCardData, GetPunchesForCardVariables>;
export function getPunchesForCard(dc: DataConnect, vars: GetPunchesForCardVariables): QueryPromise<GetPunchesForCardData, GetPunchesForCardVariables>;

interface GetPunchCodeByCodeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPunchCodeByCodeVariables): QueryRef<GetPunchCodeByCodeData, GetPunchCodeByCodeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPunchCodeByCodeVariables): QueryRef<GetPunchCodeByCodeData, GetPunchCodeByCodeVariables>;
  operationName: string;
}
export const getPunchCodeByCodeRef: GetPunchCodeByCodeRef;

export function getPunchCodeByCode(vars: GetPunchCodeByCodeVariables): QueryPromise<GetPunchCodeByCodeData, GetPunchCodeByCodeVariables>;
export function getPunchCodeByCode(dc: DataConnect, vars: GetPunchCodeByCodeVariables): QueryPromise<GetPunchCodeByCodeData, GetPunchCodeByCodeVariables>;

interface GetActivePunchCodesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActivePunchCodesVariables): QueryRef<GetActivePunchCodesData, GetActivePunchCodesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetActivePunchCodesVariables): QueryRef<GetActivePunchCodesData, GetActivePunchCodesVariables>;
  operationName: string;
}
export const getActivePunchCodesRef: GetActivePunchCodesRef;

export function getActivePunchCodes(vars: GetActivePunchCodesVariables): QueryPromise<GetActivePunchCodesData, GetActivePunchCodesVariables>;
export function getActivePunchCodes(dc: DataConnect, vars: GetActivePunchCodesVariables): QueryPromise<GetActivePunchCodesData, GetActivePunchCodesVariables>;

interface GetUserForRecommendationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserForRecommendationsVariables): QueryRef<GetUserForRecommendationsData, GetUserForRecommendationsVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserForRecommendationsVariables): QueryRef<GetUserForRecommendationsData, GetUserForRecommendationsVariables>;
  operationName: string;
}
export const getUserForRecommendationsRef: GetUserForRecommendationsRef;

export function getUserForRecommendations(vars: GetUserForRecommendationsVariables): QueryPromise<GetUserForRecommendationsData, GetUserForRecommendationsVariables>;
export function getUserForRecommendations(dc: DataConnect, vars: GetUserForRecommendationsVariables): QueryPromise<GetUserForRecommendationsData, GetUserForRecommendationsVariables>;

interface GetBusinessesForRecommendationsRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetBusinessesForRecommendationsData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetBusinessesForRecommendationsData, undefined>;
  operationName: string;
}
export const getBusinessesForRecommendationsRef: GetBusinessesForRecommendationsRef;

export function getBusinessesForRecommendations(): QueryPromise<GetBusinessesForRecommendationsData, undefined>;
export function getBusinessesForRecommendations(dc: DataConnect): QueryPromise<GetBusinessesForRecommendationsData, undefined>;

interface GetBusinessesByCategoriesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessesByCategoriesVariables): QueryRef<GetBusinessesByCategoriesData, GetBusinessesByCategoriesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetBusinessesByCategoriesVariables): QueryRef<GetBusinessesByCategoriesData, GetBusinessesByCategoriesVariables>;
  operationName: string;
}
export const getBusinessesByCategoriesRef: GetBusinessesByCategoriesRef;

export function getBusinessesByCategories(vars: GetBusinessesByCategoriesVariables): QueryPromise<GetBusinessesByCategoriesData, GetBusinessesByCategoriesVariables>;
export function getBusinessesByCategories(dc: DataConnect, vars: GetBusinessesByCategoriesVariables): QueryPromise<GetBusinessesByCategoriesData, GetBusinessesByCategoriesVariables>;

interface GetUserBehavioralDataRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserBehavioralDataVariables): QueryRef<GetUserBehavioralDataData, GetUserBehavioralDataVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetUserBehavioralDataVariables): QueryRef<GetUserBehavioralDataData, GetUserBehavioralDataVariables>;
  operationName: string;
}
export const getUserBehavioralDataRef: GetUserBehavioralDataRef;

export function getUserBehavioralData(vars: GetUserBehavioralDataVariables): QueryPromise<GetUserBehavioralDataData, GetUserBehavioralDataVariables>;
export function getUserBehavioralData(dc: DataConnect, vars: GetUserBehavioralDataVariables): QueryPromise<GetUserBehavioralDataData, GetUserBehavioralDataVariables>;

interface GetPopularBusinessesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPopularBusinessesVariables): QueryRef<GetPopularBusinessesData, GetPopularBusinessesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetPopularBusinessesVariables): QueryRef<GetPopularBusinessesData, GetPopularBusinessesVariables>;
  operationName: string;
}
export const getPopularBusinessesRef: GetPopularBusinessesRef;

export function getPopularBusinesses(vars: GetPopularBusinessesVariables): QueryPromise<GetPopularBusinessesData, GetPopularBusinessesVariables>;
export function getPopularBusinesses(dc: DataConnect, vars: GetPopularBusinessesVariables): QueryPromise<GetPopularBusinessesData, GetPopularBusinessesVariables>;

interface GetSimilarBusinessesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSimilarBusinessesVariables): QueryRef<GetSimilarBusinessesData, GetSimilarBusinessesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: GetSimilarBusinessesVariables): QueryRef<GetSimilarBusinessesData, GetSimilarBusinessesVariables>;
  operationName: string;
}
export const getSimilarBusinessesRef: GetSimilarBusinessesRef;

export function getSimilarBusinesses(vars: GetSimilarBusinessesVariables): QueryPromise<GetSimilarBusinessesData, GetSimilarBusinessesVariables>;
export function getSimilarBusinesses(dc: DataConnect, vars: GetSimilarBusinessesVariables): QueryPromise<GetSimilarBusinessesData, GetSimilarBusinessesVariables>;

