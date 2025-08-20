// Firebase Data Connect SDK
// This is a temporary manual implementation until the CLI SDK generation is fixed

import { doc, setDoc, getDoc, collection, query, where, getDocs, addDoc, Timestamp } from 'firebase/firestore';
import { db } from '@/config/firebase';

// Types based on your Data Connect schema
export interface Category {
  id: number;
  name: string;
  description: string;
  image?: string;
}

export interface User {
  id: string; // Firebase Auth UID
  name: string;
  email: string;
  favorite_category?: number;
  created_datetime: Date;
}

export interface Business {
  id: string;
  name: string;
  contact_name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  category_id: number;
  image?: string;
  created_datetime: Date;
  description?: string;
  punch_num?: number;
  expiration_duration_in_days: number;
}

export interface PunchCard {
  id?: number;
  business_id: string;
  user_id: string;
  max_punches: number;
  created_at: Date;
  expires_at: Date;
}

export interface Punch {
  id?: number;
  card_id: number;
  punch_time: Date;
}

export interface PunchCode {
  id: string;           // UUID
  code: string;         // 6-digit code
  card_id: string;      // Reference to PunchCard
  created_at: Date;     
  expires_at: Date;     // created_at + 2 minutes
  used: boolean;        
  used_at?: Date;       // When code was used
  user_id: string;      // User who owns the card
  business_id: string;  // Business the card belongs to
}

// User operations
export const createUser = async (user: Omit<User, 'created_datetime'>): Promise<void> => {
  await setDoc(doc(db, 'users', user.id), {
    ...user,
    created_datetime: Timestamp.now()
  });
};

export const getUser = async (userId: string): Promise<User | null> => {
  const docSnap = await getDoc(doc(db, 'users', userId));
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      ...data,
      created_datetime: data.created_datetime?.toDate()
    } as User;
  }
  return null;
};

// Business operations
export const createBusiness = async (business: Omit<Business, 'id' | 'created_datetime'>): Promise<string> => {
  console.log('createBusiness: Creating business with data:', {
    name: business.name,
    email: business.email,
    category_id: business.category_id
  });
  
  try {
    const businessData = {
      ...business,
      created_datetime: Timestamp.now()
    };
    
    const docRef = await addDoc(collection(db, 'businesses'), businessData);
    
    console.log('createBusiness: Business created successfully:', {
      id: docRef.id,
      name: business.name,
      email: business.email
    });
    
    return docRef.id;
  } catch (error) {
    console.error('createBusiness: Failed to create business:', error);
    throw error;
  }
};

export const getBusiness = async (businessId: string): Promise<Business | null> => {
  const docSnap = await getDoc(doc(db, 'businesses', businessId));
  if (docSnap.exists()) {
    const data = docSnap.data();
    return {
      id: docSnap.id,
      ...data,
      created_datetime: data.created_datetime?.toDate()
    } as Business;
  }
  return null;
};

export const getBusinessesByCategory = async (categoryId: number): Promise<Business[]> => {
  const q = query(collection(db, 'businesses'), where('category_id', '==', categoryId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    created_datetime: doc.data().created_datetime?.toDate()
  } as Business));
};

export const getAllBusinesses = async (): Promise<Business[]> => {
  const querySnapshot = await getDocs(collection(db, 'businesses'));
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data(),
    created_datetime: doc.data().created_datetime?.toDate()
  } as Business));
};

export const getBusinessByEmail = async (email: string): Promise<Business | null> => {
  if (!email) {
    console.log('getBusinessByEmail: No email provided');
    return null;
  }
  
  console.log('getBusinessByEmail: Querying for email:', email);
  
  try {
    const q = query(collection(db, 'businesses'), where('email', '==', email));
    const querySnapshot = await getDocs(q);
    
    console.log('getBusinessByEmail: Query completed, documents found:', querySnapshot.size);
    
    if (querySnapshot.empty) {
      console.log('getBusinessByEmail: No business found for email:', email);
      return null;
    }
    
    const doc = querySnapshot.docs[0];
    const data = doc.data();
    const business = {
      id: doc.id,
      ...data,
      created_datetime: data.created_datetime?.toDate()
    } as Business;
    
    console.log('getBusinessByEmail: Found business:', { id: business.id, name: business.name, email: business.email });
    return business;
  } catch (error) {
    console.error('getBusinessByEmail: Query failed:', error);
    throw error;
  }
};

// Categories (hardcoded for now, matching your constants)
export const getCategories = async (): Promise<Category[]> => {
  // These match your CATEGORIES constant
  return [
    { id: 1, name: "Fitness Studios", description: "Gyms and fitness centers" },
    { id: 2, name: "Coffee Shops", description: "Cafes and coffee houses" },
    { id: 3, name: "Restaurants", description: "Dining establishments" },
    { id: 4, name: "Retail Stores", description: "Shopping and retail" },
    { id: 5, name: "Beauty & Wellness", description: "Salons and spas" },
    { id: 6, name: "Services", description: "Professional services" }
  ];
};

// Punch card operations
export const createPunchCard = async (card: Omit<PunchCard, 'id' | 'created_at'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'punchCards'), {
    ...card,
    created_at: Timestamp.now(),
    expires_at: Timestamp.fromDate(card.expires_at)
  });
  return docRef.id;
};

export const getUserPunchCards = async (userId: string): Promise<PunchCard[]> => {
  const q = query(collection(db, 'punchCards'), where('user_id', '==', userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: parseInt(doc.id),
    ...doc.data(),
    created_at: doc.data().created_at?.toDate(),
    expires_at: doc.data().expires_at?.toDate()
  } as PunchCard));
};

export const getBusinessPunchCards = async (businessId: string): Promise<PunchCard[]> => {
  const q = query(collection(db, 'punchCards'), where('business_id', '==', businessId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: parseInt(doc.id),
    ...doc.data(),
    created_at: doc.data().created_at?.toDate(),
    expires_at: doc.data().expires_at?.toDate()
  } as PunchCard));
};

// Punch operations
export const addPunch = async (cardId: number): Promise<void> => {
  await addDoc(collection(db, 'punches'), {
    card_id: cardId,
    punch_time: Timestamp.now()
  });
};

export const getCardPunches = async (cardId: number): Promise<Punch[]> => {
  const q = query(collection(db, 'punches'), where('card_id', '==', cardId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: parseInt(doc.id),
    ...doc.data(),
    punch_time: doc.data().punch_time?.toDate()
  } as Punch));
};

// PunchCode operations
export const createPunchCode = async (punchCode: Omit<PunchCode, 'id'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'punchCodes'), {
    ...punchCode,
    created_at: Timestamp.fromDate(punchCode.created_at),
    expires_at: Timestamp.fromDate(punchCode.expires_at),
    used: false
  });
  return docRef.id;
};

export const getPunchCodeByCode = async (code: string): Promise<PunchCode | null> => {
  const q = query(
    collection(db, 'punchCodes'), 
    where('code', '==', code),
    where('used', '==', false)
  );
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  const doc = querySnapshot.docs[0];
  const data = doc.data();
  return {
    id: doc.id,
    ...data,
    created_at: data.created_at?.toDate(),
    expires_at: data.expires_at?.toDate(),
    used_at: data.used_at?.toDate()
  } as PunchCode;
};

export const markPunchCodeAsUsed = async (codeId: string): Promise<void> => {
  await setDoc(doc(db, 'punchCodes', codeId), {
    used: true,
    used_at: Timestamp.now()
  }, { merge: true });
};

export const getActivePunchCode = async (cardId: string): Promise<PunchCode | null> => {
  const q = query(
    collection(db, 'punchCodes'),
    where('card_id', '==', cardId),
    where('used', '==', false)
  );
  const querySnapshot = await getDocs(q);
  
  if (querySnapshot.empty) {
    return null;
  }
  
  // Return the most recent active code
  const codes = querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      created_at: data.created_at?.toDate(),
      expires_at: data.expires_at?.toDate(),
      used_at: data.used_at?.toDate()
    } as PunchCode;
  });
  
  // Filter out expired codes
  const now = new Date();
  const activeCode = codes.find(code => code.expires_at > now);
  
  return activeCode || null;
};