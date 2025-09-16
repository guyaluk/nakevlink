# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `nakevlink-connector`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetUser*](#getuser)
  - [*GetBusiness*](#getbusiness)
  - [*GetBusinessesByCategory*](#getbusinessesbycategory)
  - [*GetAllBusinesses*](#getallbusinesses)
  - [*GetBusinessByEmail*](#getbusinessbyemail)
  - [*GetBusinessPunchCards*](#getbusinesspunchcards)
  - [*GetBusinessPunches*](#getbusinesspunches)
  - [*GetBusinessPunchesToday*](#getbusinesspunchestoday)
  - [*GetUserPunchCards*](#getuserpunchcards)
  - [*GetUserPunchCardForBusiness*](#getuserpunchcardforbusiness)
  - [*GetActiveUserPunchCardForBusiness*](#getactiveuserpunchcardforbusiness)
  - [*GetPunchCardById*](#getpunchcardbyid)
  - [*GetPunchesForCard*](#getpunchesforcard)
  - [*GetPunchCodeByCode*](#getpunchcodebycode)
  - [*GetActivePunchCodes*](#getactivepunchcodes)
  - [*GetUserForRecommendations*](#getuserforrecommendations)
  - [*GetBusinessesForRecommendations*](#getbusinessesforrecommendations)
  - [*GetBusinessesByCategories*](#getbusinessesbycategories)
  - [*GetUserBehavioralData*](#getuserbehavioraldata)
  - [*GetPopularBusinesses*](#getpopularbusinesses)
  - [*GetSimilarBusinesses*](#getsimilarbusinesses)
- [**Mutations**](#mutations)
  - [*CreateUser*](#createuser)
  - [*CreateBusiness*](#createbusiness)
  - [*CreatePunchCard*](#createpunchcard)
  - [*CreatePunchCode*](#createpunchcode)
  - [*RedeemPunchCode*](#redeempunchcode)
  - [*AddPunch*](#addpunch)
  - [*MarkPunchCardCompleted*](#markpunchcardcompleted)
  - [*UpdateBusinessCoordinates*](#updatebusinesscoordinates)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `nakevlink-connector`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@nakevlink/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@nakevlink/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@nakevlink/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `nakevlink-connector` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetUser
You can execute the `GetUser` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUser(vars: GetUserVariables): QueryPromise<GetUserData, GetUserVariables>;

interface GetUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
}
export const getUserRef: GetUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUser(dc: DataConnect, vars: GetUserVariables): QueryPromise<GetUserData, GetUserVariables>;

interface GetUserRef {
  ...
  (dc: DataConnect, vars: GetUserVariables): QueryRef<GetUserData, GetUserVariables>;
}
export const getUserRef: GetUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserRef:
```typescript
const name = getUserRef.operationName;
console.log(name);
```

### Variables
The `GetUser` query requires an argument of type `GetUserVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetUser` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetUserData {
  user?: {
    id: string;
    name: string;
    email: string;
    favoriteCategory?: number | null;
    createdDatetime?: TimestampString | null;
  } & User_Key;
}
```
### Using `GetUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUser, GetUserVariables } from '@nakevlink/dataconnect';

// The `GetUser` query requires an argument of type `GetUserVariables`:
const getUserVars: GetUserVariables = {
  id: ..., 
};

// Call the `getUser()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUser(getUserVars);
// Variables can be defined inline as well.
const { data } = await getUser({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUser(dataConnect, getUserVars);

console.log(data.user);

// Or, you can use the `Promise` API.
getUser(getUserVars).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

### Using `GetUser`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserRef, GetUserVariables } from '@nakevlink/dataconnect';

// The `GetUser` query requires an argument of type `GetUserVariables`:
const getUserVars: GetUserVariables = {
  id: ..., 
};

// Call the `getUserRef()` function to get a reference to the query.
const ref = getUserRef(getUserVars);
// Variables can be defined inline as well.
const ref = getUserRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserRef(dataConnect, getUserVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
});
```

## GetBusiness
You can execute the `GetBusiness` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBusiness(vars: GetBusinessVariables): QueryPromise<GetBusinessData, GetBusinessVariables>;

interface GetBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessVariables): QueryRef<GetBusinessData, GetBusinessVariables>;
}
export const getBusinessRef: GetBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBusiness(dc: DataConnect, vars: GetBusinessVariables): QueryPromise<GetBusinessData, GetBusinessVariables>;

interface GetBusinessRef {
  ...
  (dc: DataConnect, vars: GetBusinessVariables): QueryRef<GetBusinessData, GetBusinessVariables>;
}
export const getBusinessRef: GetBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBusinessRef:
```typescript
const name = getBusinessRef.operationName;
console.log(name);
```

### Variables
The `GetBusiness` query requires an argument of type `GetBusinessVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBusinessVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetBusiness` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBusinessData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBusiness, GetBusinessVariables } from '@nakevlink/dataconnect';

// The `GetBusiness` query requires an argument of type `GetBusinessVariables`:
const getBusinessVars: GetBusinessVariables = {
  id: ..., 
};

// Call the `getBusiness()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBusiness(getBusinessVars);
// Variables can be defined inline as well.
const { data } = await getBusiness({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBusiness(dataConnect, getBusinessVars);

console.log(data.business);

// Or, you can use the `Promise` API.
getBusiness(getBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.business);
});
```

### Using `GetBusiness`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBusinessRef, GetBusinessVariables } from '@nakevlink/dataconnect';

// The `GetBusiness` query requires an argument of type `GetBusinessVariables`:
const getBusinessVars: GetBusinessVariables = {
  id: ..., 
};

// Call the `getBusinessRef()` function to get a reference to the query.
const ref = getBusinessRef(getBusinessVars);
// Variables can be defined inline as well.
const ref = getBusinessRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBusinessRef(dataConnect, getBusinessVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.business);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.business);
});
```

## GetBusinessesByCategory
You can execute the `GetBusinessesByCategory` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBusinessesByCategory(vars: GetBusinessesByCategoryVariables): QueryPromise<GetBusinessesByCategoryData, GetBusinessesByCategoryVariables>;

interface GetBusinessesByCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessesByCategoryVariables): QueryRef<GetBusinessesByCategoryData, GetBusinessesByCategoryVariables>;
}
export const getBusinessesByCategoryRef: GetBusinessesByCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBusinessesByCategory(dc: DataConnect, vars: GetBusinessesByCategoryVariables): QueryPromise<GetBusinessesByCategoryData, GetBusinessesByCategoryVariables>;

interface GetBusinessesByCategoryRef {
  ...
  (dc: DataConnect, vars: GetBusinessesByCategoryVariables): QueryRef<GetBusinessesByCategoryData, GetBusinessesByCategoryVariables>;
}
export const getBusinessesByCategoryRef: GetBusinessesByCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBusinessesByCategoryRef:
```typescript
const name = getBusinessesByCategoryRef.operationName;
console.log(name);
```

### Variables
The `GetBusinessesByCategory` query requires an argument of type `GetBusinessesByCategoryVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBusinessesByCategoryVariables {
  categoryId: number;
}
```
### Return Type
Recall that executing the `GetBusinessesByCategory` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBusinessesByCategoryData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetBusinessesByCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBusinessesByCategory, GetBusinessesByCategoryVariables } from '@nakevlink/dataconnect';

// The `GetBusinessesByCategory` query requires an argument of type `GetBusinessesByCategoryVariables`:
const getBusinessesByCategoryVars: GetBusinessesByCategoryVariables = {
  categoryId: ..., 
};

// Call the `getBusinessesByCategory()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBusinessesByCategory(getBusinessesByCategoryVars);
// Variables can be defined inline as well.
const { data } = await getBusinessesByCategory({ categoryId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBusinessesByCategory(dataConnect, getBusinessesByCategoryVars);

console.log(data.businesses);

// Or, you can use the `Promise` API.
getBusinessesByCategory(getBusinessesByCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

### Using `GetBusinessesByCategory`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBusinessesByCategoryRef, GetBusinessesByCategoryVariables } from '@nakevlink/dataconnect';

// The `GetBusinessesByCategory` query requires an argument of type `GetBusinessesByCategoryVariables`:
const getBusinessesByCategoryVars: GetBusinessesByCategoryVariables = {
  categoryId: ..., 
};

// Call the `getBusinessesByCategoryRef()` function to get a reference to the query.
const ref = getBusinessesByCategoryRef(getBusinessesByCategoryVars);
// Variables can be defined inline as well.
const ref = getBusinessesByCategoryRef({ categoryId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBusinessesByCategoryRef(dataConnect, getBusinessesByCategoryVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.businesses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

## GetAllBusinesses
You can execute the `GetAllBusinesses` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getAllBusinesses(): QueryPromise<GetAllBusinessesData, undefined>;

interface GetAllBusinessesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetAllBusinessesData, undefined>;
}
export const getAllBusinessesRef: GetAllBusinessesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getAllBusinesses(dc: DataConnect): QueryPromise<GetAllBusinessesData, undefined>;

interface GetAllBusinessesRef {
  ...
  (dc: DataConnect): QueryRef<GetAllBusinessesData, undefined>;
}
export const getAllBusinessesRef: GetAllBusinessesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getAllBusinessesRef:
```typescript
const name = getAllBusinessesRef.operationName;
console.log(name);
```

### Variables
The `GetAllBusinesses` query has no variables.
### Return Type
Recall that executing the `GetAllBusinesses` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetAllBusinessesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetAllBusinesses`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getAllBusinesses } from '@nakevlink/dataconnect';


// Call the `getAllBusinesses()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getAllBusinesses();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getAllBusinesses(dataConnect);

console.log(data.businesses);

// Or, you can use the `Promise` API.
getAllBusinesses().then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

### Using `GetAllBusinesses`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getAllBusinessesRef } from '@nakevlink/dataconnect';


// Call the `getAllBusinessesRef()` function to get a reference to the query.
const ref = getAllBusinessesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getAllBusinessesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.businesses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

## GetBusinessByEmail
You can execute the `GetBusinessByEmail` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBusinessByEmail(vars: GetBusinessByEmailVariables): QueryPromise<GetBusinessByEmailData, GetBusinessByEmailVariables>;

interface GetBusinessByEmailRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessByEmailVariables): QueryRef<GetBusinessByEmailData, GetBusinessByEmailVariables>;
}
export const getBusinessByEmailRef: GetBusinessByEmailRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBusinessByEmail(dc: DataConnect, vars: GetBusinessByEmailVariables): QueryPromise<GetBusinessByEmailData, GetBusinessByEmailVariables>;

interface GetBusinessByEmailRef {
  ...
  (dc: DataConnect, vars: GetBusinessByEmailVariables): QueryRef<GetBusinessByEmailData, GetBusinessByEmailVariables>;
}
export const getBusinessByEmailRef: GetBusinessByEmailRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBusinessByEmailRef:
```typescript
const name = getBusinessByEmailRef.operationName;
console.log(name);
```

### Variables
The `GetBusinessByEmail` query requires an argument of type `GetBusinessByEmailVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBusinessByEmailVariables {
  email: string;
}
```
### Return Type
Recall that executing the `GetBusinessByEmail` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBusinessByEmailData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetBusinessByEmail`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBusinessByEmail, GetBusinessByEmailVariables } from '@nakevlink/dataconnect';

// The `GetBusinessByEmail` query requires an argument of type `GetBusinessByEmailVariables`:
const getBusinessByEmailVars: GetBusinessByEmailVariables = {
  email: ..., 
};

// Call the `getBusinessByEmail()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBusinessByEmail(getBusinessByEmailVars);
// Variables can be defined inline as well.
const { data } = await getBusinessByEmail({ email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBusinessByEmail(dataConnect, getBusinessByEmailVars);

console.log(data.businesses);

// Or, you can use the `Promise` API.
getBusinessByEmail(getBusinessByEmailVars).then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

### Using `GetBusinessByEmail`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBusinessByEmailRef, GetBusinessByEmailVariables } from '@nakevlink/dataconnect';

// The `GetBusinessByEmail` query requires an argument of type `GetBusinessByEmailVariables`:
const getBusinessByEmailVars: GetBusinessByEmailVariables = {
  email: ..., 
};

// Call the `getBusinessByEmailRef()` function to get a reference to the query.
const ref = getBusinessByEmailRef(getBusinessByEmailVars);
// Variables can be defined inline as well.
const ref = getBusinessByEmailRef({ email: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBusinessByEmailRef(dataConnect, getBusinessByEmailVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.businesses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

## GetBusinessPunchCards
You can execute the `GetBusinessPunchCards` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBusinessPunchCards(vars: GetBusinessPunchCardsVariables): QueryPromise<GetBusinessPunchCardsData, GetBusinessPunchCardsVariables>;

interface GetBusinessPunchCardsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessPunchCardsVariables): QueryRef<GetBusinessPunchCardsData, GetBusinessPunchCardsVariables>;
}
export const getBusinessPunchCardsRef: GetBusinessPunchCardsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBusinessPunchCards(dc: DataConnect, vars: GetBusinessPunchCardsVariables): QueryPromise<GetBusinessPunchCardsData, GetBusinessPunchCardsVariables>;

interface GetBusinessPunchCardsRef {
  ...
  (dc: DataConnect, vars: GetBusinessPunchCardsVariables): QueryRef<GetBusinessPunchCardsData, GetBusinessPunchCardsVariables>;
}
export const getBusinessPunchCardsRef: GetBusinessPunchCardsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBusinessPunchCardsRef:
```typescript
const name = getBusinessPunchCardsRef.operationName;
console.log(name);
```

### Variables
The `GetBusinessPunchCards` query requires an argument of type `GetBusinessPunchCardsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBusinessPunchCardsVariables {
  businessId: string;
}
```
### Return Type
Recall that executing the `GetBusinessPunchCards` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBusinessPunchCardsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetBusinessPunchCards`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBusinessPunchCards, GetBusinessPunchCardsVariables } from '@nakevlink/dataconnect';

// The `GetBusinessPunchCards` query requires an argument of type `GetBusinessPunchCardsVariables`:
const getBusinessPunchCardsVars: GetBusinessPunchCardsVariables = {
  businessId: ..., 
};

// Call the `getBusinessPunchCards()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBusinessPunchCards(getBusinessPunchCardsVars);
// Variables can be defined inline as well.
const { data } = await getBusinessPunchCards({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBusinessPunchCards(dataConnect, getBusinessPunchCardsVars);

console.log(data.punchCards);

// Or, you can use the `Promise` API.
getBusinessPunchCards(getBusinessPunchCardsVars).then((response) => {
  const data = response.data;
  console.log(data.punchCards);
});
```

### Using `GetBusinessPunchCards`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBusinessPunchCardsRef, GetBusinessPunchCardsVariables } from '@nakevlink/dataconnect';

// The `GetBusinessPunchCards` query requires an argument of type `GetBusinessPunchCardsVariables`:
const getBusinessPunchCardsVars: GetBusinessPunchCardsVariables = {
  businessId: ..., 
};

// Call the `getBusinessPunchCardsRef()` function to get a reference to the query.
const ref = getBusinessPunchCardsRef(getBusinessPunchCardsVars);
// Variables can be defined inline as well.
const ref = getBusinessPunchCardsRef({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBusinessPunchCardsRef(dataConnect, getBusinessPunchCardsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.punchCards);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.punchCards);
});
```

## GetBusinessPunches
You can execute the `GetBusinessPunches` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBusinessPunches(vars: GetBusinessPunchesVariables): QueryPromise<GetBusinessPunchesData, GetBusinessPunchesVariables>;

interface GetBusinessPunchesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessPunchesVariables): QueryRef<GetBusinessPunchesData, GetBusinessPunchesVariables>;
}
export const getBusinessPunchesRef: GetBusinessPunchesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBusinessPunches(dc: DataConnect, vars: GetBusinessPunchesVariables): QueryPromise<GetBusinessPunchesData, GetBusinessPunchesVariables>;

interface GetBusinessPunchesRef {
  ...
  (dc: DataConnect, vars: GetBusinessPunchesVariables): QueryRef<GetBusinessPunchesData, GetBusinessPunchesVariables>;
}
export const getBusinessPunchesRef: GetBusinessPunchesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBusinessPunchesRef:
```typescript
const name = getBusinessPunchesRef.operationName;
console.log(name);
```

### Variables
The `GetBusinessPunches` query requires an argument of type `GetBusinessPunchesVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBusinessPunchesVariables {
  businessId: string;
}
```
### Return Type
Recall that executing the `GetBusinessPunches` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBusinessPunchesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetBusinessPunches`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBusinessPunches, GetBusinessPunchesVariables } from '@nakevlink/dataconnect';

// The `GetBusinessPunches` query requires an argument of type `GetBusinessPunchesVariables`:
const getBusinessPunchesVars: GetBusinessPunchesVariables = {
  businessId: ..., 
};

// Call the `getBusinessPunches()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBusinessPunches(getBusinessPunchesVars);
// Variables can be defined inline as well.
const { data } = await getBusinessPunches({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBusinessPunches(dataConnect, getBusinessPunchesVars);

console.log(data.punchCards);

// Or, you can use the `Promise` API.
getBusinessPunches(getBusinessPunchesVars).then((response) => {
  const data = response.data;
  console.log(data.punchCards);
});
```

### Using `GetBusinessPunches`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBusinessPunchesRef, GetBusinessPunchesVariables } from '@nakevlink/dataconnect';

// The `GetBusinessPunches` query requires an argument of type `GetBusinessPunchesVariables`:
const getBusinessPunchesVars: GetBusinessPunchesVariables = {
  businessId: ..., 
};

// Call the `getBusinessPunchesRef()` function to get a reference to the query.
const ref = getBusinessPunchesRef(getBusinessPunchesVars);
// Variables can be defined inline as well.
const ref = getBusinessPunchesRef({ businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBusinessPunchesRef(dataConnect, getBusinessPunchesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.punchCards);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.punchCards);
});
```

## GetBusinessPunchesToday
You can execute the `GetBusinessPunchesToday` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBusinessPunchesToday(vars: GetBusinessPunchesTodayVariables): QueryPromise<GetBusinessPunchesTodayData, GetBusinessPunchesTodayVariables>;

interface GetBusinessPunchesTodayRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessPunchesTodayVariables): QueryRef<GetBusinessPunchesTodayData, GetBusinessPunchesTodayVariables>;
}
export const getBusinessPunchesTodayRef: GetBusinessPunchesTodayRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBusinessPunchesToday(dc: DataConnect, vars: GetBusinessPunchesTodayVariables): QueryPromise<GetBusinessPunchesTodayData, GetBusinessPunchesTodayVariables>;

interface GetBusinessPunchesTodayRef {
  ...
  (dc: DataConnect, vars: GetBusinessPunchesTodayVariables): QueryRef<GetBusinessPunchesTodayData, GetBusinessPunchesTodayVariables>;
}
export const getBusinessPunchesTodayRef: GetBusinessPunchesTodayRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBusinessPunchesTodayRef:
```typescript
const name = getBusinessPunchesTodayRef.operationName;
console.log(name);
```

### Variables
The `GetBusinessPunchesToday` query requires an argument of type `GetBusinessPunchesTodayVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBusinessPunchesTodayVariables {
  businessId: string;
  todayStart: TimestampString;
}
```
### Return Type
Recall that executing the `GetBusinessPunchesToday` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBusinessPunchesTodayData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetBusinessPunchesTodayData {
  punchCards: ({
    id: string;
    maxPunches: number;
    createdAt?: TimestampString | null;
    expiresAt: TimestampString;
  } & PunchCard_Key)[];
}
```
### Using `GetBusinessPunchesToday`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBusinessPunchesToday, GetBusinessPunchesTodayVariables } from '@nakevlink/dataconnect';

// The `GetBusinessPunchesToday` query requires an argument of type `GetBusinessPunchesTodayVariables`:
const getBusinessPunchesTodayVars: GetBusinessPunchesTodayVariables = {
  businessId: ..., 
  todayStart: ..., 
};

// Call the `getBusinessPunchesToday()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBusinessPunchesToday(getBusinessPunchesTodayVars);
// Variables can be defined inline as well.
const { data } = await getBusinessPunchesToday({ businessId: ..., todayStart: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBusinessPunchesToday(dataConnect, getBusinessPunchesTodayVars);

console.log(data.punchCards);

// Or, you can use the `Promise` API.
getBusinessPunchesToday(getBusinessPunchesTodayVars).then((response) => {
  const data = response.data;
  console.log(data.punchCards);
});
```

### Using `GetBusinessPunchesToday`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBusinessPunchesTodayRef, GetBusinessPunchesTodayVariables } from '@nakevlink/dataconnect';

// The `GetBusinessPunchesToday` query requires an argument of type `GetBusinessPunchesTodayVariables`:
const getBusinessPunchesTodayVars: GetBusinessPunchesTodayVariables = {
  businessId: ..., 
  todayStart: ..., 
};

// Call the `getBusinessPunchesTodayRef()` function to get a reference to the query.
const ref = getBusinessPunchesTodayRef(getBusinessPunchesTodayVars);
// Variables can be defined inline as well.
const ref = getBusinessPunchesTodayRef({ businessId: ..., todayStart: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBusinessPunchesTodayRef(dataConnect, getBusinessPunchesTodayVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.punchCards);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.punchCards);
});
```

## GetUserPunchCards
You can execute the `GetUserPunchCards` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUserPunchCards(vars: GetUserPunchCardsVariables): QueryPromise<GetUserPunchCardsData, GetUserPunchCardsVariables>;

interface GetUserPunchCardsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserPunchCardsVariables): QueryRef<GetUserPunchCardsData, GetUserPunchCardsVariables>;
}
export const getUserPunchCardsRef: GetUserPunchCardsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserPunchCards(dc: DataConnect, vars: GetUserPunchCardsVariables): QueryPromise<GetUserPunchCardsData, GetUserPunchCardsVariables>;

interface GetUserPunchCardsRef {
  ...
  (dc: DataConnect, vars: GetUserPunchCardsVariables): QueryRef<GetUserPunchCardsData, GetUserPunchCardsVariables>;
}
export const getUserPunchCardsRef: GetUserPunchCardsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserPunchCardsRef:
```typescript
const name = getUserPunchCardsRef.operationName;
console.log(name);
```

### Variables
The `GetUserPunchCards` query requires an argument of type `GetUserPunchCardsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserPunchCardsVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserPunchCards` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserPunchCardsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserPunchCards`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserPunchCards, GetUserPunchCardsVariables } from '@nakevlink/dataconnect';

// The `GetUserPunchCards` query requires an argument of type `GetUserPunchCardsVariables`:
const getUserPunchCardsVars: GetUserPunchCardsVariables = {
  userId: ..., 
};

// Call the `getUserPunchCards()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserPunchCards(getUserPunchCardsVars);
// Variables can be defined inline as well.
const { data } = await getUserPunchCards({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserPunchCards(dataConnect, getUserPunchCardsVars);

console.log(data.punchCards);

// Or, you can use the `Promise` API.
getUserPunchCards(getUserPunchCardsVars).then((response) => {
  const data = response.data;
  console.log(data.punchCards);
});
```

### Using `GetUserPunchCards`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserPunchCardsRef, GetUserPunchCardsVariables } from '@nakevlink/dataconnect';

// The `GetUserPunchCards` query requires an argument of type `GetUserPunchCardsVariables`:
const getUserPunchCardsVars: GetUserPunchCardsVariables = {
  userId: ..., 
};

// Call the `getUserPunchCardsRef()` function to get a reference to the query.
const ref = getUserPunchCardsRef(getUserPunchCardsVars);
// Variables can be defined inline as well.
const ref = getUserPunchCardsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserPunchCardsRef(dataConnect, getUserPunchCardsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.punchCards);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.punchCards);
});
```

## GetUserPunchCardForBusiness
You can execute the `GetUserPunchCardForBusiness` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUserPunchCardForBusiness(vars: GetUserPunchCardForBusinessVariables): QueryPromise<GetUserPunchCardForBusinessData, GetUserPunchCardForBusinessVariables>;

interface GetUserPunchCardForBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserPunchCardForBusinessVariables): QueryRef<GetUserPunchCardForBusinessData, GetUserPunchCardForBusinessVariables>;
}
export const getUserPunchCardForBusinessRef: GetUserPunchCardForBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserPunchCardForBusiness(dc: DataConnect, vars: GetUserPunchCardForBusinessVariables): QueryPromise<GetUserPunchCardForBusinessData, GetUserPunchCardForBusinessVariables>;

interface GetUserPunchCardForBusinessRef {
  ...
  (dc: DataConnect, vars: GetUserPunchCardForBusinessVariables): QueryRef<GetUserPunchCardForBusinessData, GetUserPunchCardForBusinessVariables>;
}
export const getUserPunchCardForBusinessRef: GetUserPunchCardForBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserPunchCardForBusinessRef:
```typescript
const name = getUserPunchCardForBusinessRef.operationName;
console.log(name);
```

### Variables
The `GetUserPunchCardForBusiness` query requires an argument of type `GetUserPunchCardForBusinessVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserPunchCardForBusinessVariables {
  userId: string;
  businessId: string;
}
```
### Return Type
Recall that executing the `GetUserPunchCardForBusiness` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserPunchCardForBusinessData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserPunchCardForBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserPunchCardForBusiness, GetUserPunchCardForBusinessVariables } from '@nakevlink/dataconnect';

// The `GetUserPunchCardForBusiness` query requires an argument of type `GetUserPunchCardForBusinessVariables`:
const getUserPunchCardForBusinessVars: GetUserPunchCardForBusinessVariables = {
  userId: ..., 
  businessId: ..., 
};

// Call the `getUserPunchCardForBusiness()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserPunchCardForBusiness(getUserPunchCardForBusinessVars);
// Variables can be defined inline as well.
const { data } = await getUserPunchCardForBusiness({ userId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserPunchCardForBusiness(dataConnect, getUserPunchCardForBusinessVars);

console.log(data.punchCards);

// Or, you can use the `Promise` API.
getUserPunchCardForBusiness(getUserPunchCardForBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.punchCards);
});
```

### Using `GetUserPunchCardForBusiness`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserPunchCardForBusinessRef, GetUserPunchCardForBusinessVariables } from '@nakevlink/dataconnect';

// The `GetUserPunchCardForBusiness` query requires an argument of type `GetUserPunchCardForBusinessVariables`:
const getUserPunchCardForBusinessVars: GetUserPunchCardForBusinessVariables = {
  userId: ..., 
  businessId: ..., 
};

// Call the `getUserPunchCardForBusinessRef()` function to get a reference to the query.
const ref = getUserPunchCardForBusinessRef(getUserPunchCardForBusinessVars);
// Variables can be defined inline as well.
const ref = getUserPunchCardForBusinessRef({ userId: ..., businessId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserPunchCardForBusinessRef(dataConnect, getUserPunchCardForBusinessVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.punchCards);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.punchCards);
});
```

## GetActiveUserPunchCardForBusiness
You can execute the `GetActiveUserPunchCardForBusiness` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getActiveUserPunchCardForBusiness(vars: GetActiveUserPunchCardForBusinessVariables): QueryPromise<GetActiveUserPunchCardForBusinessData, GetActiveUserPunchCardForBusinessVariables>;

interface GetActiveUserPunchCardForBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActiveUserPunchCardForBusinessVariables): QueryRef<GetActiveUserPunchCardForBusinessData, GetActiveUserPunchCardForBusinessVariables>;
}
export const getActiveUserPunchCardForBusinessRef: GetActiveUserPunchCardForBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getActiveUserPunchCardForBusiness(dc: DataConnect, vars: GetActiveUserPunchCardForBusinessVariables): QueryPromise<GetActiveUserPunchCardForBusinessData, GetActiveUserPunchCardForBusinessVariables>;

interface GetActiveUserPunchCardForBusinessRef {
  ...
  (dc: DataConnect, vars: GetActiveUserPunchCardForBusinessVariables): QueryRef<GetActiveUserPunchCardForBusinessData, GetActiveUserPunchCardForBusinessVariables>;
}
export const getActiveUserPunchCardForBusinessRef: GetActiveUserPunchCardForBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getActiveUserPunchCardForBusinessRef:
```typescript
const name = getActiveUserPunchCardForBusinessRef.operationName;
console.log(name);
```

### Variables
The `GetActiveUserPunchCardForBusiness` query requires an argument of type `GetActiveUserPunchCardForBusinessVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetActiveUserPunchCardForBusinessVariables {
  userId: string;
  businessId: string;
  now: TimestampString;
}
```
### Return Type
Recall that executing the `GetActiveUserPunchCardForBusiness` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetActiveUserPunchCardForBusinessData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetActiveUserPunchCardForBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getActiveUserPunchCardForBusiness, GetActiveUserPunchCardForBusinessVariables } from '@nakevlink/dataconnect';

// The `GetActiveUserPunchCardForBusiness` query requires an argument of type `GetActiveUserPunchCardForBusinessVariables`:
const getActiveUserPunchCardForBusinessVars: GetActiveUserPunchCardForBusinessVariables = {
  userId: ..., 
  businessId: ..., 
  now: ..., 
};

// Call the `getActiveUserPunchCardForBusiness()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getActiveUserPunchCardForBusiness(getActiveUserPunchCardForBusinessVars);
// Variables can be defined inline as well.
const { data } = await getActiveUserPunchCardForBusiness({ userId: ..., businessId: ..., now: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getActiveUserPunchCardForBusiness(dataConnect, getActiveUserPunchCardForBusinessVars);

console.log(data.punchCards);

// Or, you can use the `Promise` API.
getActiveUserPunchCardForBusiness(getActiveUserPunchCardForBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.punchCards);
});
```

### Using `GetActiveUserPunchCardForBusiness`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getActiveUserPunchCardForBusinessRef, GetActiveUserPunchCardForBusinessVariables } from '@nakevlink/dataconnect';

// The `GetActiveUserPunchCardForBusiness` query requires an argument of type `GetActiveUserPunchCardForBusinessVariables`:
const getActiveUserPunchCardForBusinessVars: GetActiveUserPunchCardForBusinessVariables = {
  userId: ..., 
  businessId: ..., 
  now: ..., 
};

// Call the `getActiveUserPunchCardForBusinessRef()` function to get a reference to the query.
const ref = getActiveUserPunchCardForBusinessRef(getActiveUserPunchCardForBusinessVars);
// Variables can be defined inline as well.
const ref = getActiveUserPunchCardForBusinessRef({ userId: ..., businessId: ..., now: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getActiveUserPunchCardForBusinessRef(dataConnect, getActiveUserPunchCardForBusinessVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.punchCards);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.punchCards);
});
```

## GetPunchCardById
You can execute the `GetPunchCardById` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getPunchCardById(vars: GetPunchCardByIdVariables): QueryPromise<GetPunchCardByIdData, GetPunchCardByIdVariables>;

interface GetPunchCardByIdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPunchCardByIdVariables): QueryRef<GetPunchCardByIdData, GetPunchCardByIdVariables>;
}
export const getPunchCardByIdRef: GetPunchCardByIdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPunchCardById(dc: DataConnect, vars: GetPunchCardByIdVariables): QueryPromise<GetPunchCardByIdData, GetPunchCardByIdVariables>;

interface GetPunchCardByIdRef {
  ...
  (dc: DataConnect, vars: GetPunchCardByIdVariables): QueryRef<GetPunchCardByIdData, GetPunchCardByIdVariables>;
}
export const getPunchCardByIdRef: GetPunchCardByIdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPunchCardByIdRef:
```typescript
const name = getPunchCardByIdRef.operationName;
console.log(name);
```

### Variables
The `GetPunchCardById` query requires an argument of type `GetPunchCardByIdVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPunchCardByIdVariables {
  id: string;
}
```
### Return Type
Recall that executing the `GetPunchCardById` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPunchCardByIdData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetPunchCardById`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPunchCardById, GetPunchCardByIdVariables } from '@nakevlink/dataconnect';

// The `GetPunchCardById` query requires an argument of type `GetPunchCardByIdVariables`:
const getPunchCardByIdVars: GetPunchCardByIdVariables = {
  id: ..., 
};

// Call the `getPunchCardById()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPunchCardById(getPunchCardByIdVars);
// Variables can be defined inline as well.
const { data } = await getPunchCardById({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPunchCardById(dataConnect, getPunchCardByIdVars);

console.log(data.punchCard);

// Or, you can use the `Promise` API.
getPunchCardById(getPunchCardByIdVars).then((response) => {
  const data = response.data;
  console.log(data.punchCard);
});
```

### Using `GetPunchCardById`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPunchCardByIdRef, GetPunchCardByIdVariables } from '@nakevlink/dataconnect';

// The `GetPunchCardById` query requires an argument of type `GetPunchCardByIdVariables`:
const getPunchCardByIdVars: GetPunchCardByIdVariables = {
  id: ..., 
};

// Call the `getPunchCardByIdRef()` function to get a reference to the query.
const ref = getPunchCardByIdRef(getPunchCardByIdVars);
// Variables can be defined inline as well.
const ref = getPunchCardByIdRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPunchCardByIdRef(dataConnect, getPunchCardByIdVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.punchCard);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.punchCard);
});
```

## GetPunchesForCard
You can execute the `GetPunchesForCard` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getPunchesForCard(vars: GetPunchesForCardVariables): QueryPromise<GetPunchesForCardData, GetPunchesForCardVariables>;

interface GetPunchesForCardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPunchesForCardVariables): QueryRef<GetPunchesForCardData, GetPunchesForCardVariables>;
}
export const getPunchesForCardRef: GetPunchesForCardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPunchesForCard(dc: DataConnect, vars: GetPunchesForCardVariables): QueryPromise<GetPunchesForCardData, GetPunchesForCardVariables>;

interface GetPunchesForCardRef {
  ...
  (dc: DataConnect, vars: GetPunchesForCardVariables): QueryRef<GetPunchesForCardData, GetPunchesForCardVariables>;
}
export const getPunchesForCardRef: GetPunchesForCardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPunchesForCardRef:
```typescript
const name = getPunchesForCardRef.operationName;
console.log(name);
```

### Variables
The `GetPunchesForCard` query requires an argument of type `GetPunchesForCardVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPunchesForCardVariables {
  cardId: string;
}
```
### Return Type
Recall that executing the `GetPunchesForCard` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPunchesForCardData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetPunchesForCardData {
  punches: ({
    id: string;
    punchTime?: TimestampString | null;
  } & Punch_Key)[];
}
```
### Using `GetPunchesForCard`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPunchesForCard, GetPunchesForCardVariables } from '@nakevlink/dataconnect';

// The `GetPunchesForCard` query requires an argument of type `GetPunchesForCardVariables`:
const getPunchesForCardVars: GetPunchesForCardVariables = {
  cardId: ..., 
};

// Call the `getPunchesForCard()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPunchesForCard(getPunchesForCardVars);
// Variables can be defined inline as well.
const { data } = await getPunchesForCard({ cardId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPunchesForCard(dataConnect, getPunchesForCardVars);

console.log(data.punches);

// Or, you can use the `Promise` API.
getPunchesForCard(getPunchesForCardVars).then((response) => {
  const data = response.data;
  console.log(data.punches);
});
```

### Using `GetPunchesForCard`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPunchesForCardRef, GetPunchesForCardVariables } from '@nakevlink/dataconnect';

// The `GetPunchesForCard` query requires an argument of type `GetPunchesForCardVariables`:
const getPunchesForCardVars: GetPunchesForCardVariables = {
  cardId: ..., 
};

// Call the `getPunchesForCardRef()` function to get a reference to the query.
const ref = getPunchesForCardRef(getPunchesForCardVars);
// Variables can be defined inline as well.
const ref = getPunchesForCardRef({ cardId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPunchesForCardRef(dataConnect, getPunchesForCardVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.punches);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.punches);
});
```

## GetPunchCodeByCode
You can execute the `GetPunchCodeByCode` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getPunchCodeByCode(vars: GetPunchCodeByCodeVariables): QueryPromise<GetPunchCodeByCodeData, GetPunchCodeByCodeVariables>;

interface GetPunchCodeByCodeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPunchCodeByCodeVariables): QueryRef<GetPunchCodeByCodeData, GetPunchCodeByCodeVariables>;
}
export const getPunchCodeByCodeRef: GetPunchCodeByCodeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPunchCodeByCode(dc: DataConnect, vars: GetPunchCodeByCodeVariables): QueryPromise<GetPunchCodeByCodeData, GetPunchCodeByCodeVariables>;

interface GetPunchCodeByCodeRef {
  ...
  (dc: DataConnect, vars: GetPunchCodeByCodeVariables): QueryRef<GetPunchCodeByCodeData, GetPunchCodeByCodeVariables>;
}
export const getPunchCodeByCodeRef: GetPunchCodeByCodeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPunchCodeByCodeRef:
```typescript
const name = getPunchCodeByCodeRef.operationName;
console.log(name);
```

### Variables
The `GetPunchCodeByCode` query requires an argument of type `GetPunchCodeByCodeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPunchCodeByCodeVariables {
  code: string;
}
```
### Return Type
Recall that executing the `GetPunchCodeByCode` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPunchCodeByCodeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetPunchCodeByCode`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPunchCodeByCode, GetPunchCodeByCodeVariables } from '@nakevlink/dataconnect';

// The `GetPunchCodeByCode` query requires an argument of type `GetPunchCodeByCodeVariables`:
const getPunchCodeByCodeVars: GetPunchCodeByCodeVariables = {
  code: ..., 
};

// Call the `getPunchCodeByCode()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPunchCodeByCode(getPunchCodeByCodeVars);
// Variables can be defined inline as well.
const { data } = await getPunchCodeByCode({ code: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPunchCodeByCode(dataConnect, getPunchCodeByCodeVars);

console.log(data.punchCodes);

// Or, you can use the `Promise` API.
getPunchCodeByCode(getPunchCodeByCodeVars).then((response) => {
  const data = response.data;
  console.log(data.punchCodes);
});
```

### Using `GetPunchCodeByCode`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPunchCodeByCodeRef, GetPunchCodeByCodeVariables } from '@nakevlink/dataconnect';

// The `GetPunchCodeByCode` query requires an argument of type `GetPunchCodeByCodeVariables`:
const getPunchCodeByCodeVars: GetPunchCodeByCodeVariables = {
  code: ..., 
};

// Call the `getPunchCodeByCodeRef()` function to get a reference to the query.
const ref = getPunchCodeByCodeRef(getPunchCodeByCodeVars);
// Variables can be defined inline as well.
const ref = getPunchCodeByCodeRef({ code: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPunchCodeByCodeRef(dataConnect, getPunchCodeByCodeVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.punchCodes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.punchCodes);
});
```

## GetActivePunchCodes
You can execute the `GetActivePunchCodes` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getActivePunchCodes(vars: GetActivePunchCodesVariables): QueryPromise<GetActivePunchCodesData, GetActivePunchCodesVariables>;

interface GetActivePunchCodesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetActivePunchCodesVariables): QueryRef<GetActivePunchCodesData, GetActivePunchCodesVariables>;
}
export const getActivePunchCodesRef: GetActivePunchCodesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getActivePunchCodes(dc: DataConnect, vars: GetActivePunchCodesVariables): QueryPromise<GetActivePunchCodesData, GetActivePunchCodesVariables>;

interface GetActivePunchCodesRef {
  ...
  (dc: DataConnect, vars: GetActivePunchCodesVariables): QueryRef<GetActivePunchCodesData, GetActivePunchCodesVariables>;
}
export const getActivePunchCodesRef: GetActivePunchCodesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getActivePunchCodesRef:
```typescript
const name = getActivePunchCodesRef.operationName;
console.log(name);
```

### Variables
The `GetActivePunchCodes` query requires an argument of type `GetActivePunchCodesVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetActivePunchCodesVariables {
  userId: string;
  now: TimestampString;
}
```
### Return Type
Recall that executing the `GetActivePunchCodes` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetActivePunchCodesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetActivePunchCodes`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getActivePunchCodes, GetActivePunchCodesVariables } from '@nakevlink/dataconnect';

// The `GetActivePunchCodes` query requires an argument of type `GetActivePunchCodesVariables`:
const getActivePunchCodesVars: GetActivePunchCodesVariables = {
  userId: ..., 
  now: ..., 
};

// Call the `getActivePunchCodes()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getActivePunchCodes(getActivePunchCodesVars);
// Variables can be defined inline as well.
const { data } = await getActivePunchCodes({ userId: ..., now: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getActivePunchCodes(dataConnect, getActivePunchCodesVars);

console.log(data.punchCodes);

// Or, you can use the `Promise` API.
getActivePunchCodes(getActivePunchCodesVars).then((response) => {
  const data = response.data;
  console.log(data.punchCodes);
});
```

### Using `GetActivePunchCodes`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getActivePunchCodesRef, GetActivePunchCodesVariables } from '@nakevlink/dataconnect';

// The `GetActivePunchCodes` query requires an argument of type `GetActivePunchCodesVariables`:
const getActivePunchCodesVars: GetActivePunchCodesVariables = {
  userId: ..., 
  now: ..., 
};

// Call the `getActivePunchCodesRef()` function to get a reference to the query.
const ref = getActivePunchCodesRef(getActivePunchCodesVars);
// Variables can be defined inline as well.
const ref = getActivePunchCodesRef({ userId: ..., now: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getActivePunchCodesRef(dataConnect, getActivePunchCodesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.punchCodes);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.punchCodes);
});
```

## GetUserForRecommendations
You can execute the `GetUserForRecommendations` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUserForRecommendations(vars: GetUserForRecommendationsVariables): QueryPromise<GetUserForRecommendationsData, GetUserForRecommendationsVariables>;

interface GetUserForRecommendationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserForRecommendationsVariables): QueryRef<GetUserForRecommendationsData, GetUserForRecommendationsVariables>;
}
export const getUserForRecommendationsRef: GetUserForRecommendationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserForRecommendations(dc: DataConnect, vars: GetUserForRecommendationsVariables): QueryPromise<GetUserForRecommendationsData, GetUserForRecommendationsVariables>;

interface GetUserForRecommendationsRef {
  ...
  (dc: DataConnect, vars: GetUserForRecommendationsVariables): QueryRef<GetUserForRecommendationsData, GetUserForRecommendationsVariables>;
}
export const getUserForRecommendationsRef: GetUserForRecommendationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserForRecommendationsRef:
```typescript
const name = getUserForRecommendationsRef.operationName;
console.log(name);
```

### Variables
The `GetUserForRecommendations` query requires an argument of type `GetUserForRecommendationsVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserForRecommendationsVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserForRecommendations` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserForRecommendationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserForRecommendations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserForRecommendations, GetUserForRecommendationsVariables } from '@nakevlink/dataconnect';

// The `GetUserForRecommendations` query requires an argument of type `GetUserForRecommendationsVariables`:
const getUserForRecommendationsVars: GetUserForRecommendationsVariables = {
  userId: ..., 
};

// Call the `getUserForRecommendations()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserForRecommendations(getUserForRecommendationsVars);
// Variables can be defined inline as well.
const { data } = await getUserForRecommendations({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserForRecommendations(dataConnect, getUserForRecommendationsVars);

console.log(data.user);
console.log(data.punchCards);

// Or, you can use the `Promise` API.
getUserForRecommendations(getUserForRecommendationsVars).then((response) => {
  const data = response.data;
  console.log(data.user);
  console.log(data.punchCards);
});
```

### Using `GetUserForRecommendations`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserForRecommendationsRef, GetUserForRecommendationsVariables } from '@nakevlink/dataconnect';

// The `GetUserForRecommendations` query requires an argument of type `GetUserForRecommendationsVariables`:
const getUserForRecommendationsVars: GetUserForRecommendationsVariables = {
  userId: ..., 
};

// Call the `getUserForRecommendationsRef()` function to get a reference to the query.
const ref = getUserForRecommendationsRef(getUserForRecommendationsVars);
// Variables can be defined inline as well.
const ref = getUserForRecommendationsRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserForRecommendationsRef(dataConnect, getUserForRecommendationsVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);
console.log(data.punchCards);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
  console.log(data.punchCards);
});
```

## GetBusinessesForRecommendations
You can execute the `GetBusinessesForRecommendations` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBusinessesForRecommendations(): QueryPromise<GetBusinessesForRecommendationsData, undefined>;

interface GetBusinessesForRecommendationsRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetBusinessesForRecommendationsData, undefined>;
}
export const getBusinessesForRecommendationsRef: GetBusinessesForRecommendationsRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBusinessesForRecommendations(dc: DataConnect): QueryPromise<GetBusinessesForRecommendationsData, undefined>;

interface GetBusinessesForRecommendationsRef {
  ...
  (dc: DataConnect): QueryRef<GetBusinessesForRecommendationsData, undefined>;
}
export const getBusinessesForRecommendationsRef: GetBusinessesForRecommendationsRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBusinessesForRecommendationsRef:
```typescript
const name = getBusinessesForRecommendationsRef.operationName;
console.log(name);
```

### Variables
The `GetBusinessesForRecommendations` query has no variables.
### Return Type
Recall that executing the `GetBusinessesForRecommendations` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBusinessesForRecommendationsData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetBusinessesForRecommendations`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBusinessesForRecommendations } from '@nakevlink/dataconnect';


// Call the `getBusinessesForRecommendations()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBusinessesForRecommendations();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBusinessesForRecommendations(dataConnect);

console.log(data.businesses);

// Or, you can use the `Promise` API.
getBusinessesForRecommendations().then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

### Using `GetBusinessesForRecommendations`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBusinessesForRecommendationsRef } from '@nakevlink/dataconnect';


// Call the `getBusinessesForRecommendationsRef()` function to get a reference to the query.
const ref = getBusinessesForRecommendationsRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBusinessesForRecommendationsRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.businesses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

## GetBusinessesByCategories
You can execute the `GetBusinessesByCategories` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getBusinessesByCategories(vars: GetBusinessesByCategoriesVariables): QueryPromise<GetBusinessesByCategoriesData, GetBusinessesByCategoriesVariables>;

interface GetBusinessesByCategoriesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetBusinessesByCategoriesVariables): QueryRef<GetBusinessesByCategoriesData, GetBusinessesByCategoriesVariables>;
}
export const getBusinessesByCategoriesRef: GetBusinessesByCategoriesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getBusinessesByCategories(dc: DataConnect, vars: GetBusinessesByCategoriesVariables): QueryPromise<GetBusinessesByCategoriesData, GetBusinessesByCategoriesVariables>;

interface GetBusinessesByCategoriesRef {
  ...
  (dc: DataConnect, vars: GetBusinessesByCategoriesVariables): QueryRef<GetBusinessesByCategoriesData, GetBusinessesByCategoriesVariables>;
}
export const getBusinessesByCategoriesRef: GetBusinessesByCategoriesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getBusinessesByCategoriesRef:
```typescript
const name = getBusinessesByCategoriesRef.operationName;
console.log(name);
```

### Variables
The `GetBusinessesByCategories` query requires an argument of type `GetBusinessesByCategoriesVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetBusinessesByCategoriesVariables {
  categoryIds: number[];
}
```
### Return Type
Recall that executing the `GetBusinessesByCategories` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetBusinessesByCategoriesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetBusinessesByCategories`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getBusinessesByCategories, GetBusinessesByCategoriesVariables } from '@nakevlink/dataconnect';

// The `GetBusinessesByCategories` query requires an argument of type `GetBusinessesByCategoriesVariables`:
const getBusinessesByCategoriesVars: GetBusinessesByCategoriesVariables = {
  categoryIds: ..., 
};

// Call the `getBusinessesByCategories()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getBusinessesByCategories(getBusinessesByCategoriesVars);
// Variables can be defined inline as well.
const { data } = await getBusinessesByCategories({ categoryIds: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getBusinessesByCategories(dataConnect, getBusinessesByCategoriesVars);

console.log(data.businesses);

// Or, you can use the `Promise` API.
getBusinessesByCategories(getBusinessesByCategoriesVars).then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

### Using `GetBusinessesByCategories`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getBusinessesByCategoriesRef, GetBusinessesByCategoriesVariables } from '@nakevlink/dataconnect';

// The `GetBusinessesByCategories` query requires an argument of type `GetBusinessesByCategoriesVariables`:
const getBusinessesByCategoriesVars: GetBusinessesByCategoriesVariables = {
  categoryIds: ..., 
};

// Call the `getBusinessesByCategoriesRef()` function to get a reference to the query.
const ref = getBusinessesByCategoriesRef(getBusinessesByCategoriesVars);
// Variables can be defined inline as well.
const ref = getBusinessesByCategoriesRef({ categoryIds: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getBusinessesByCategoriesRef(dataConnect, getBusinessesByCategoriesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.businesses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

## GetUserBehavioralData
You can execute the `GetUserBehavioralData` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getUserBehavioralData(vars: GetUserBehavioralDataVariables): QueryPromise<GetUserBehavioralDataData, GetUserBehavioralDataVariables>;

interface GetUserBehavioralDataRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetUserBehavioralDataVariables): QueryRef<GetUserBehavioralDataData, GetUserBehavioralDataVariables>;
}
export const getUserBehavioralDataRef: GetUserBehavioralDataRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getUserBehavioralData(dc: DataConnect, vars: GetUserBehavioralDataVariables): QueryPromise<GetUserBehavioralDataData, GetUserBehavioralDataVariables>;

interface GetUserBehavioralDataRef {
  ...
  (dc: DataConnect, vars: GetUserBehavioralDataVariables): QueryRef<GetUserBehavioralDataData, GetUserBehavioralDataVariables>;
}
export const getUserBehavioralDataRef: GetUserBehavioralDataRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getUserBehavioralDataRef:
```typescript
const name = getUserBehavioralDataRef.operationName;
console.log(name);
```

### Variables
The `GetUserBehavioralData` query requires an argument of type `GetUserBehavioralDataVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetUserBehavioralDataVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `GetUserBehavioralData` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetUserBehavioralDataData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetUserBehavioralData`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getUserBehavioralData, GetUserBehavioralDataVariables } from '@nakevlink/dataconnect';

// The `GetUserBehavioralData` query requires an argument of type `GetUserBehavioralDataVariables`:
const getUserBehavioralDataVars: GetUserBehavioralDataVariables = {
  userId: ..., 
};

// Call the `getUserBehavioralData()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getUserBehavioralData(getUserBehavioralDataVars);
// Variables can be defined inline as well.
const { data } = await getUserBehavioralData({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getUserBehavioralData(dataConnect, getUserBehavioralDataVars);

console.log(data.punchCards);

// Or, you can use the `Promise` API.
getUserBehavioralData(getUserBehavioralDataVars).then((response) => {
  const data = response.data;
  console.log(data.punchCards);
});
```

### Using `GetUserBehavioralData`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getUserBehavioralDataRef, GetUserBehavioralDataVariables } from '@nakevlink/dataconnect';

// The `GetUserBehavioralData` query requires an argument of type `GetUserBehavioralDataVariables`:
const getUserBehavioralDataVars: GetUserBehavioralDataVariables = {
  userId: ..., 
};

// Call the `getUserBehavioralDataRef()` function to get a reference to the query.
const ref = getUserBehavioralDataRef(getUserBehavioralDataVars);
// Variables can be defined inline as well.
const ref = getUserBehavioralDataRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getUserBehavioralDataRef(dataConnect, getUserBehavioralDataVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.punchCards);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.punchCards);
});
```

## GetPopularBusinesses
You can execute the `GetPopularBusinesses` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getPopularBusinesses(vars: GetPopularBusinessesVariables): QueryPromise<GetPopularBusinessesData, GetPopularBusinessesVariables>;

interface GetPopularBusinessesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetPopularBusinessesVariables): QueryRef<GetPopularBusinessesData, GetPopularBusinessesVariables>;
}
export const getPopularBusinessesRef: GetPopularBusinessesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getPopularBusinesses(dc: DataConnect, vars: GetPopularBusinessesVariables): QueryPromise<GetPopularBusinessesData, GetPopularBusinessesVariables>;

interface GetPopularBusinessesRef {
  ...
  (dc: DataConnect, vars: GetPopularBusinessesVariables): QueryRef<GetPopularBusinessesData, GetPopularBusinessesVariables>;
}
export const getPopularBusinessesRef: GetPopularBusinessesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getPopularBusinessesRef:
```typescript
const name = getPopularBusinessesRef.operationName;
console.log(name);
```

### Variables
The `GetPopularBusinesses` query requires an argument of type `GetPopularBusinessesVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetPopularBusinessesVariables {
  limit: number;
}
```
### Return Type
Recall that executing the `GetPopularBusinesses` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetPopularBusinessesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetPopularBusinesses`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getPopularBusinesses, GetPopularBusinessesVariables } from '@nakevlink/dataconnect';

// The `GetPopularBusinesses` query requires an argument of type `GetPopularBusinessesVariables`:
const getPopularBusinessesVars: GetPopularBusinessesVariables = {
  limit: ..., 
};

// Call the `getPopularBusinesses()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getPopularBusinesses(getPopularBusinessesVars);
// Variables can be defined inline as well.
const { data } = await getPopularBusinesses({ limit: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getPopularBusinesses(dataConnect, getPopularBusinessesVars);

console.log(data.businesses);

// Or, you can use the `Promise` API.
getPopularBusinesses(getPopularBusinessesVars).then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

### Using `GetPopularBusinesses`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getPopularBusinessesRef, GetPopularBusinessesVariables } from '@nakevlink/dataconnect';

// The `GetPopularBusinesses` query requires an argument of type `GetPopularBusinessesVariables`:
const getPopularBusinessesVars: GetPopularBusinessesVariables = {
  limit: ..., 
};

// Call the `getPopularBusinessesRef()` function to get a reference to the query.
const ref = getPopularBusinessesRef(getPopularBusinessesVars);
// Variables can be defined inline as well.
const ref = getPopularBusinessesRef({ limit: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getPopularBusinessesRef(dataConnect, getPopularBusinessesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.businesses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.businesses);
});
```

## GetSimilarBusinesses
You can execute the `GetSimilarBusinesses` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
getSimilarBusinesses(vars: GetSimilarBusinessesVariables): QueryPromise<GetSimilarBusinessesData, GetSimilarBusinessesVariables>;

interface GetSimilarBusinessesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: GetSimilarBusinessesVariables): QueryRef<GetSimilarBusinessesData, GetSimilarBusinessesVariables>;
}
export const getSimilarBusinessesRef: GetSimilarBusinessesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getSimilarBusinesses(dc: DataConnect, vars: GetSimilarBusinessesVariables): QueryPromise<GetSimilarBusinessesData, GetSimilarBusinessesVariables>;

interface GetSimilarBusinessesRef {
  ...
  (dc: DataConnect, vars: GetSimilarBusinessesVariables): QueryRef<GetSimilarBusinessesData, GetSimilarBusinessesVariables>;
}
export const getSimilarBusinessesRef: GetSimilarBusinessesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getSimilarBusinessesRef:
```typescript
const name = getSimilarBusinessesRef.operationName;
console.log(name);
```

### Variables
The `GetSimilarBusinesses` query requires an argument of type `GetSimilarBusinessesVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface GetSimilarBusinessesVariables {
  userId: string;
  excludeBusinessIds: string[];
}
```
### Return Type
Recall that executing the `GetSimilarBusinesses` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetSimilarBusinessesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `GetSimilarBusinesses`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getSimilarBusinesses, GetSimilarBusinessesVariables } from '@nakevlink/dataconnect';

// The `GetSimilarBusinesses` query requires an argument of type `GetSimilarBusinessesVariables`:
const getSimilarBusinessesVars: GetSimilarBusinessesVariables = {
  userId: ..., 
  excludeBusinessIds: ..., 
};

// Call the `getSimilarBusinesses()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getSimilarBusinesses(getSimilarBusinessesVars);
// Variables can be defined inline as well.
const { data } = await getSimilarBusinesses({ userId: ..., excludeBusinessIds: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getSimilarBusinesses(dataConnect, getSimilarBusinessesVars);

console.log(data.punchCards);
console.log(data.businesses);

// Or, you can use the `Promise` API.
getSimilarBusinesses(getSimilarBusinessesVars).then((response) => {
  const data = response.data;
  console.log(data.punchCards);
  console.log(data.businesses);
});
```

### Using `GetSimilarBusinesses`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getSimilarBusinessesRef, GetSimilarBusinessesVariables } from '@nakevlink/dataconnect';

// The `GetSimilarBusinesses` query requires an argument of type `GetSimilarBusinessesVariables`:
const getSimilarBusinessesVars: GetSimilarBusinessesVariables = {
  userId: ..., 
  excludeBusinessIds: ..., 
};

// Call the `getSimilarBusinessesRef()` function to get a reference to the query.
const ref = getSimilarBusinessesRef(getSimilarBusinessesVars);
// Variables can be defined inline as well.
const ref = getSimilarBusinessesRef({ userId: ..., excludeBusinessIds: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getSimilarBusinessesRef(dataConnect, getSimilarBusinessesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.punchCards);
console.log(data.businesses);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.punchCards);
  console.log(data.businesses);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `nakevlink-connector` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateUser
You can execute the `CreateUser` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createUser(vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createUser(dc: DataConnect, vars: CreateUserVariables): MutationPromise<CreateUserData, CreateUserVariables>;

interface CreateUserRef {
  ...
  (dc: DataConnect, vars: CreateUserVariables): MutationRef<CreateUserData, CreateUserVariables>;
}
export const createUserRef: CreateUserRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createUserRef:
```typescript
const name = createUserRef.operationName;
console.log(name);
```

### Variables
The `CreateUser` mutation requires an argument of type `CreateUserVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateUserVariables {
  id: string;
  name: string;
  email: string;
  favoriteCategory?: number | null;
  createdDatetime?: TimestampString | null;
}
```
### Return Type
Recall that executing the `CreateUser` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateUserData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateUserData {
  user_insert: User_Key;
}
```
### Using `CreateUser`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createUser, CreateUserVariables } from '@nakevlink/dataconnect';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  id: ..., 
  name: ..., 
  email: ..., 
  favoriteCategory: ..., // optional
  createdDatetime: ..., // optional
};

// Call the `createUser()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createUser(createUserVars);
// Variables can be defined inline as well.
const { data } = await createUser({ id: ..., name: ..., email: ..., favoriteCategory: ..., createdDatetime: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createUser(dataConnect, createUserVars);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
createUser(createUserVars).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

### Using `CreateUser`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createUserRef, CreateUserVariables } from '@nakevlink/dataconnect';

// The `CreateUser` mutation requires an argument of type `CreateUserVariables`:
const createUserVars: CreateUserVariables = {
  id: ..., 
  name: ..., 
  email: ..., 
  favoriteCategory: ..., // optional
  createdDatetime: ..., // optional
};

// Call the `createUserRef()` function to get a reference to the mutation.
const ref = createUserRef(createUserVars);
// Variables can be defined inline as well.
const ref = createUserRef({ id: ..., name: ..., email: ..., favoriteCategory: ..., createdDatetime: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createUserRef(dataConnect, createUserVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_insert);
});
```

## CreateBusiness
You can execute the `CreateBusiness` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createBusiness(vars: CreateBusinessVariables): MutationPromise<CreateBusinessData, CreateBusinessVariables>;

interface CreateBusinessRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateBusinessVariables): MutationRef<CreateBusinessData, CreateBusinessVariables>;
}
export const createBusinessRef: CreateBusinessRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createBusiness(dc: DataConnect, vars: CreateBusinessVariables): MutationPromise<CreateBusinessData, CreateBusinessVariables>;

interface CreateBusinessRef {
  ...
  (dc: DataConnect, vars: CreateBusinessVariables): MutationRef<CreateBusinessData, CreateBusinessVariables>;
}
export const createBusinessRef: CreateBusinessRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createBusinessRef:
```typescript
const name = createBusinessRef.operationName;
console.log(name);
```

### Variables
The `CreateBusiness` mutation requires an argument of type `CreateBusinessVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `CreateBusiness` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateBusinessData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateBusinessData {
  business_insert: Business_Key;
}
```
### Using `CreateBusiness`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createBusiness, CreateBusinessVariables } from '@nakevlink/dataconnect';

// The `CreateBusiness` mutation requires an argument of type `CreateBusinessVariables`:
const createBusinessVars: CreateBusinessVariables = {
  id: ..., // optional
  name: ..., 
  contactName: ..., // optional
  email: ..., // optional
  phoneNumber: ..., // optional
  address: ..., // optional
  categoryId: ..., 
  image: ..., // optional
  description: ..., // optional
  punchNum: ..., // optional
  expirationDurationInDays: ..., // optional
  latitude: ..., // optional
  longitude: ..., // optional
  createdDatetime: ..., // optional
};

// Call the `createBusiness()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createBusiness(createBusinessVars);
// Variables can be defined inline as well.
const { data } = await createBusiness({ id: ..., name: ..., contactName: ..., email: ..., phoneNumber: ..., address: ..., categoryId: ..., image: ..., description: ..., punchNum: ..., expirationDurationInDays: ..., latitude: ..., longitude: ..., createdDatetime: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createBusiness(dataConnect, createBusinessVars);

console.log(data.business_insert);

// Or, you can use the `Promise` API.
createBusiness(createBusinessVars).then((response) => {
  const data = response.data;
  console.log(data.business_insert);
});
```

### Using `CreateBusiness`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createBusinessRef, CreateBusinessVariables } from '@nakevlink/dataconnect';

// The `CreateBusiness` mutation requires an argument of type `CreateBusinessVariables`:
const createBusinessVars: CreateBusinessVariables = {
  id: ..., // optional
  name: ..., 
  contactName: ..., // optional
  email: ..., // optional
  phoneNumber: ..., // optional
  address: ..., // optional
  categoryId: ..., 
  image: ..., // optional
  description: ..., // optional
  punchNum: ..., // optional
  expirationDurationInDays: ..., // optional
  latitude: ..., // optional
  longitude: ..., // optional
  createdDatetime: ..., // optional
};

// Call the `createBusinessRef()` function to get a reference to the mutation.
const ref = createBusinessRef(createBusinessVars);
// Variables can be defined inline as well.
const ref = createBusinessRef({ id: ..., name: ..., contactName: ..., email: ..., phoneNumber: ..., address: ..., categoryId: ..., image: ..., description: ..., punchNum: ..., expirationDurationInDays: ..., latitude: ..., longitude: ..., createdDatetime: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createBusinessRef(dataConnect, createBusinessVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.business_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.business_insert);
});
```

## CreatePunchCard
You can execute the `CreatePunchCard` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createPunchCard(vars: CreatePunchCardVariables): MutationPromise<CreatePunchCardData, CreatePunchCardVariables>;

interface CreatePunchCardRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePunchCardVariables): MutationRef<CreatePunchCardData, CreatePunchCardVariables>;
}
export const createPunchCardRef: CreatePunchCardRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPunchCard(dc: DataConnect, vars: CreatePunchCardVariables): MutationPromise<CreatePunchCardData, CreatePunchCardVariables>;

interface CreatePunchCardRef {
  ...
  (dc: DataConnect, vars: CreatePunchCardVariables): MutationRef<CreatePunchCardData, CreatePunchCardVariables>;
}
export const createPunchCardRef: CreatePunchCardRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPunchCardRef:
```typescript
const name = createPunchCardRef.operationName;
console.log(name);
```

### Variables
The `CreatePunchCard` mutation requires an argument of type `CreatePunchCardVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePunchCardVariables {
  businessId: string;
  userId: string;
  maxPunches: number;
  expiresAt: TimestampString;
  createdAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `CreatePunchCard` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePunchCardData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePunchCardData {
  punchCard_insert: PunchCard_Key;
}
```
### Using `CreatePunchCard`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPunchCard, CreatePunchCardVariables } from '@nakevlink/dataconnect';

// The `CreatePunchCard` mutation requires an argument of type `CreatePunchCardVariables`:
const createPunchCardVars: CreatePunchCardVariables = {
  businessId: ..., 
  userId: ..., 
  maxPunches: ..., 
  expiresAt: ..., 
  createdAt: ..., // optional
};

// Call the `createPunchCard()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPunchCard(createPunchCardVars);
// Variables can be defined inline as well.
const { data } = await createPunchCard({ businessId: ..., userId: ..., maxPunches: ..., expiresAt: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPunchCard(dataConnect, createPunchCardVars);

console.log(data.punchCard_insert);

// Or, you can use the `Promise` API.
createPunchCard(createPunchCardVars).then((response) => {
  const data = response.data;
  console.log(data.punchCard_insert);
});
```

### Using `CreatePunchCard`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPunchCardRef, CreatePunchCardVariables } from '@nakevlink/dataconnect';

// The `CreatePunchCard` mutation requires an argument of type `CreatePunchCardVariables`:
const createPunchCardVars: CreatePunchCardVariables = {
  businessId: ..., 
  userId: ..., 
  maxPunches: ..., 
  expiresAt: ..., 
  createdAt: ..., // optional
};

// Call the `createPunchCardRef()` function to get a reference to the mutation.
const ref = createPunchCardRef(createPunchCardVars);
// Variables can be defined inline as well.
const ref = createPunchCardRef({ businessId: ..., userId: ..., maxPunches: ..., expiresAt: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPunchCardRef(dataConnect, createPunchCardVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.punchCard_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.punchCard_insert);
});
```

## CreatePunchCode
You can execute the `CreatePunchCode` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
createPunchCode(vars: CreatePunchCodeVariables): MutationPromise<CreatePunchCodeData, CreatePunchCodeVariables>;

interface CreatePunchCodeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreatePunchCodeVariables): MutationRef<CreatePunchCodeData, CreatePunchCodeVariables>;
}
export const createPunchCodeRef: CreatePunchCodeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createPunchCode(dc: DataConnect, vars: CreatePunchCodeVariables): MutationPromise<CreatePunchCodeData, CreatePunchCodeVariables>;

interface CreatePunchCodeRef {
  ...
  (dc: DataConnect, vars: CreatePunchCodeVariables): MutationRef<CreatePunchCodeData, CreatePunchCodeVariables>;
}
export const createPunchCodeRef: CreatePunchCodeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createPunchCodeRef:
```typescript
const name = createPunchCodeRef.operationName;
console.log(name);
```

### Variables
The `CreatePunchCode` mutation requires an argument of type `CreatePunchCodeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreatePunchCodeVariables {
  code: string;
  cardId: string;
  businessId: string;
  userId: string;
  expiresAt: TimestampString;
  createdAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `CreatePunchCode` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreatePunchCodeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreatePunchCodeData {
  punchCode_insert: PunchCode_Key;
}
```
### Using `CreatePunchCode`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createPunchCode, CreatePunchCodeVariables } from '@nakevlink/dataconnect';

// The `CreatePunchCode` mutation requires an argument of type `CreatePunchCodeVariables`:
const createPunchCodeVars: CreatePunchCodeVariables = {
  code: ..., 
  cardId: ..., 
  businessId: ..., 
  userId: ..., 
  expiresAt: ..., 
  createdAt: ..., // optional
};

// Call the `createPunchCode()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createPunchCode(createPunchCodeVars);
// Variables can be defined inline as well.
const { data } = await createPunchCode({ code: ..., cardId: ..., businessId: ..., userId: ..., expiresAt: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createPunchCode(dataConnect, createPunchCodeVars);

console.log(data.punchCode_insert);

// Or, you can use the `Promise` API.
createPunchCode(createPunchCodeVars).then((response) => {
  const data = response.data;
  console.log(data.punchCode_insert);
});
```

### Using `CreatePunchCode`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createPunchCodeRef, CreatePunchCodeVariables } from '@nakevlink/dataconnect';

// The `CreatePunchCode` mutation requires an argument of type `CreatePunchCodeVariables`:
const createPunchCodeVars: CreatePunchCodeVariables = {
  code: ..., 
  cardId: ..., 
  businessId: ..., 
  userId: ..., 
  expiresAt: ..., 
  createdAt: ..., // optional
};

// Call the `createPunchCodeRef()` function to get a reference to the mutation.
const ref = createPunchCodeRef(createPunchCodeVars);
// Variables can be defined inline as well.
const ref = createPunchCodeRef({ code: ..., cardId: ..., businessId: ..., userId: ..., expiresAt: ..., createdAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createPunchCodeRef(dataConnect, createPunchCodeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.punchCode_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.punchCode_insert);
});
```

## RedeemPunchCode
You can execute the `RedeemPunchCode` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
redeemPunchCode(vars: RedeemPunchCodeVariables): MutationPromise<RedeemPunchCodeData, RedeemPunchCodeVariables>;

interface RedeemPunchCodeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RedeemPunchCodeVariables): MutationRef<RedeemPunchCodeData, RedeemPunchCodeVariables>;
}
export const redeemPunchCodeRef: RedeemPunchCodeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
redeemPunchCode(dc: DataConnect, vars: RedeemPunchCodeVariables): MutationPromise<RedeemPunchCodeData, RedeemPunchCodeVariables>;

interface RedeemPunchCodeRef {
  ...
  (dc: DataConnect, vars: RedeemPunchCodeVariables): MutationRef<RedeemPunchCodeData, RedeemPunchCodeVariables>;
}
export const redeemPunchCodeRef: RedeemPunchCodeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the redeemPunchCodeRef:
```typescript
const name = redeemPunchCodeRef.operationName;
console.log(name);
```

### Variables
The `RedeemPunchCode` mutation requires an argument of type `RedeemPunchCodeVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RedeemPunchCodeVariables {
  codeId: string;
  usedAt: TimestampString;
}
```
### Return Type
Recall that executing the `RedeemPunchCode` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RedeemPunchCodeData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RedeemPunchCodeData {
  punchCode_update?: PunchCode_Key | null;
}
```
### Using `RedeemPunchCode`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, redeemPunchCode, RedeemPunchCodeVariables } from '@nakevlink/dataconnect';

// The `RedeemPunchCode` mutation requires an argument of type `RedeemPunchCodeVariables`:
const redeemPunchCodeVars: RedeemPunchCodeVariables = {
  codeId: ..., 
  usedAt: ..., 
};

// Call the `redeemPunchCode()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await redeemPunchCode(redeemPunchCodeVars);
// Variables can be defined inline as well.
const { data } = await redeemPunchCode({ codeId: ..., usedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await redeemPunchCode(dataConnect, redeemPunchCodeVars);

console.log(data.punchCode_update);

// Or, you can use the `Promise` API.
redeemPunchCode(redeemPunchCodeVars).then((response) => {
  const data = response.data;
  console.log(data.punchCode_update);
});
```

### Using `RedeemPunchCode`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, redeemPunchCodeRef, RedeemPunchCodeVariables } from '@nakevlink/dataconnect';

// The `RedeemPunchCode` mutation requires an argument of type `RedeemPunchCodeVariables`:
const redeemPunchCodeVars: RedeemPunchCodeVariables = {
  codeId: ..., 
  usedAt: ..., 
};

// Call the `redeemPunchCodeRef()` function to get a reference to the mutation.
const ref = redeemPunchCodeRef(redeemPunchCodeVars);
// Variables can be defined inline as well.
const ref = redeemPunchCodeRef({ codeId: ..., usedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = redeemPunchCodeRef(dataConnect, redeemPunchCodeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.punchCode_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.punchCode_update);
});
```

## AddPunch
You can execute the `AddPunch` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
addPunch(vars: AddPunchVariables): MutationPromise<AddPunchData, AddPunchVariables>;

interface AddPunchRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddPunchVariables): MutationRef<AddPunchData, AddPunchVariables>;
}
export const addPunchRef: AddPunchRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addPunch(dc: DataConnect, vars: AddPunchVariables): MutationPromise<AddPunchData, AddPunchVariables>;

interface AddPunchRef {
  ...
  (dc: DataConnect, vars: AddPunchVariables): MutationRef<AddPunchData, AddPunchVariables>;
}
export const addPunchRef: AddPunchRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addPunchRef:
```typescript
const name = addPunchRef.operationName;
console.log(name);
```

### Variables
The `AddPunch` mutation requires an argument of type `AddPunchVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddPunchVariables {
  cardId: string;
  punchTime?: TimestampString | null;
}
```
### Return Type
Recall that executing the `AddPunch` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddPunchData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddPunchData {
  punch_insert: Punch_Key;
}
```
### Using `AddPunch`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addPunch, AddPunchVariables } from '@nakevlink/dataconnect';

// The `AddPunch` mutation requires an argument of type `AddPunchVariables`:
const addPunchVars: AddPunchVariables = {
  cardId: ..., 
  punchTime: ..., // optional
};

// Call the `addPunch()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addPunch(addPunchVars);
// Variables can be defined inline as well.
const { data } = await addPunch({ cardId: ..., punchTime: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addPunch(dataConnect, addPunchVars);

console.log(data.punch_insert);

// Or, you can use the `Promise` API.
addPunch(addPunchVars).then((response) => {
  const data = response.data;
  console.log(data.punch_insert);
});
```

### Using `AddPunch`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addPunchRef, AddPunchVariables } from '@nakevlink/dataconnect';

// The `AddPunch` mutation requires an argument of type `AddPunchVariables`:
const addPunchVars: AddPunchVariables = {
  cardId: ..., 
  punchTime: ..., // optional
};

// Call the `addPunchRef()` function to get a reference to the mutation.
const ref = addPunchRef(addPunchVars);
// Variables can be defined inline as well.
const ref = addPunchRef({ cardId: ..., punchTime: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addPunchRef(dataConnect, addPunchVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.punch_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.punch_insert);
});
```

## MarkPunchCardCompleted
You can execute the `MarkPunchCardCompleted` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
markPunchCardCompleted(vars: MarkPunchCardCompletedVariables): MutationPromise<MarkPunchCardCompletedData, MarkPunchCardCompletedVariables>;

interface MarkPunchCardCompletedRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: MarkPunchCardCompletedVariables): MutationRef<MarkPunchCardCompletedData, MarkPunchCardCompletedVariables>;
}
export const markPunchCardCompletedRef: MarkPunchCardCompletedRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
markPunchCardCompleted(dc: DataConnect, vars: MarkPunchCardCompletedVariables): MutationPromise<MarkPunchCardCompletedData, MarkPunchCardCompletedVariables>;

interface MarkPunchCardCompletedRef {
  ...
  (dc: DataConnect, vars: MarkPunchCardCompletedVariables): MutationRef<MarkPunchCardCompletedData, MarkPunchCardCompletedVariables>;
}
export const markPunchCardCompletedRef: MarkPunchCardCompletedRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the markPunchCardCompletedRef:
```typescript
const name = markPunchCardCompletedRef.operationName;
console.log(name);
```

### Variables
The `MarkPunchCardCompleted` mutation requires an argument of type `MarkPunchCardCompletedVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface MarkPunchCardCompletedVariables {
  cardId: string;
  completedAt?: TimestampString | null;
}
```
### Return Type
Recall that executing the `MarkPunchCardCompleted` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `MarkPunchCardCompletedData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface MarkPunchCardCompletedData {
  punchCard_update?: PunchCard_Key | null;
}
```
### Using `MarkPunchCardCompleted`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, markPunchCardCompleted, MarkPunchCardCompletedVariables } from '@nakevlink/dataconnect';

// The `MarkPunchCardCompleted` mutation requires an argument of type `MarkPunchCardCompletedVariables`:
const markPunchCardCompletedVars: MarkPunchCardCompletedVariables = {
  cardId: ..., 
  completedAt: ..., // optional
};

// Call the `markPunchCardCompleted()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await markPunchCardCompleted(markPunchCardCompletedVars);
// Variables can be defined inline as well.
const { data } = await markPunchCardCompleted({ cardId: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await markPunchCardCompleted(dataConnect, markPunchCardCompletedVars);

console.log(data.punchCard_update);

// Or, you can use the `Promise` API.
markPunchCardCompleted(markPunchCardCompletedVars).then((response) => {
  const data = response.data;
  console.log(data.punchCard_update);
});
```

### Using `MarkPunchCardCompleted`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, markPunchCardCompletedRef, MarkPunchCardCompletedVariables } from '@nakevlink/dataconnect';

// The `MarkPunchCardCompleted` mutation requires an argument of type `MarkPunchCardCompletedVariables`:
const markPunchCardCompletedVars: MarkPunchCardCompletedVariables = {
  cardId: ..., 
  completedAt: ..., // optional
};

// Call the `markPunchCardCompletedRef()` function to get a reference to the mutation.
const ref = markPunchCardCompletedRef(markPunchCardCompletedVars);
// Variables can be defined inline as well.
const ref = markPunchCardCompletedRef({ cardId: ..., completedAt: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = markPunchCardCompletedRef(dataConnect, markPunchCardCompletedVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.punchCard_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.punchCard_update);
});
```

## UpdateBusinessCoordinates
You can execute the `UpdateBusinessCoordinates` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect/index.d.ts](./index.d.ts):
```typescript
updateBusinessCoordinates(vars: UpdateBusinessCoordinatesVariables): MutationPromise<UpdateBusinessCoordinatesData, UpdateBusinessCoordinatesVariables>;

interface UpdateBusinessCoordinatesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateBusinessCoordinatesVariables): MutationRef<UpdateBusinessCoordinatesData, UpdateBusinessCoordinatesVariables>;
}
export const updateBusinessCoordinatesRef: UpdateBusinessCoordinatesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateBusinessCoordinates(dc: DataConnect, vars: UpdateBusinessCoordinatesVariables): MutationPromise<UpdateBusinessCoordinatesData, UpdateBusinessCoordinatesVariables>;

interface UpdateBusinessCoordinatesRef {
  ...
  (dc: DataConnect, vars: UpdateBusinessCoordinatesVariables): MutationRef<UpdateBusinessCoordinatesData, UpdateBusinessCoordinatesVariables>;
}
export const updateBusinessCoordinatesRef: UpdateBusinessCoordinatesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateBusinessCoordinatesRef:
```typescript
const name = updateBusinessCoordinatesRef.operationName;
console.log(name);
```

### Variables
The `UpdateBusinessCoordinates` mutation requires an argument of type `UpdateBusinessCoordinatesVariables`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateBusinessCoordinatesVariables {
  businessId: string;
  latitude: number;
  longitude: number;
}
```
### Return Type
Recall that executing the `UpdateBusinessCoordinates` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateBusinessCoordinatesData`, which is defined in [dataconnect/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateBusinessCoordinatesData {
  business_update?: Business_Key | null;
}
```
### Using `UpdateBusinessCoordinates`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateBusinessCoordinates, UpdateBusinessCoordinatesVariables } from '@nakevlink/dataconnect';

// The `UpdateBusinessCoordinates` mutation requires an argument of type `UpdateBusinessCoordinatesVariables`:
const updateBusinessCoordinatesVars: UpdateBusinessCoordinatesVariables = {
  businessId: ..., 
  latitude: ..., 
  longitude: ..., 
};

// Call the `updateBusinessCoordinates()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateBusinessCoordinates(updateBusinessCoordinatesVars);
// Variables can be defined inline as well.
const { data } = await updateBusinessCoordinates({ businessId: ..., latitude: ..., longitude: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateBusinessCoordinates(dataConnect, updateBusinessCoordinatesVars);

console.log(data.business_update);

// Or, you can use the `Promise` API.
updateBusinessCoordinates(updateBusinessCoordinatesVars).then((response) => {
  const data = response.data;
  console.log(data.business_update);
});
```

### Using `UpdateBusinessCoordinates`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateBusinessCoordinatesRef, UpdateBusinessCoordinatesVariables } from '@nakevlink/dataconnect';

// The `UpdateBusinessCoordinates` mutation requires an argument of type `UpdateBusinessCoordinatesVariables`:
const updateBusinessCoordinatesVars: UpdateBusinessCoordinatesVariables = {
  businessId: ..., 
  latitude: ..., 
  longitude: ..., 
};

// Call the `updateBusinessCoordinatesRef()` function to get a reference to the mutation.
const ref = updateBusinessCoordinatesRef(updateBusinessCoordinatesVars);
// Variables can be defined inline as well.
const ref = updateBusinessCoordinatesRef({ businessId: ..., latitude: ..., longitude: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateBusinessCoordinatesRef(dataConnect, updateBusinessCoordinatesVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.business_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.business_update);
});
```

