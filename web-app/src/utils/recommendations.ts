/**
 * Personalized Business Recommendation Algorithm for Nakevlink
 * 
 * This module implements a sophisticated recommendation system that combines:
 * - User preference analysis (declared + behavioral)
 * - Location-based scoring (when available)
 * - Business diversity promotion
 * - Smart fallbacks for new users
 */

import { CATEGORIES, type Category } from '@/constants/categories';

// =============================================================================
// TYPE DEFINITIONS
// =============================================================================

export interface UserProfile {
  id: string;
  favoriteCategory?: number;
  punchCards: PunchCardData[];
}

export interface PunchCardData {
  id: string;
  businessId: string;
  userId: string;
  maxPunches: number;
  business: BusinessData;
}

export interface BusinessData {
  id: string;
  name: string;
  description?: string;
  categoryId: number;
  address?: string;
  image?: string;
  punchNum?: number;
  expirationDurationInDays?: number;
  // Location data (optional - can be added later)
  latitude?: number;
  longitude?: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface RecommendationResult {
  business: BusinessData;
  score: number;
  categoryScore: number;
  distanceScore: number;
  diversityBonus: number;
  explanations: string[];
}

export interface RecommendationConfig {
  maxDistance?: number; // km, default 10
  maxResults?: number; // default 20
  minCategoryDiversity?: number; // minimum categories in results (0-8), default 3
  categoryWeight: number; // 0-1, default 0.6
  distanceWeight: number; // 0-1, default 0.3
  diversityWeight: number; // 0-1, default 0.1
  newUserFallbackWeight: number; // boost for new users, default 0.2
}

export interface CategoryWeights {
  [categoryId: number]: number; // 0-1 weight for each category
}

// =============================================================================
// ALGORITHM CONFIGURATION
// =============================================================================

const DEFAULT_CONFIG: RecommendationConfig = {
  maxDistance: 10, // 10km radius
  maxResults: 20,
  minCategoryDiversity: 3,
  categoryWeight: 0.6,
  distanceWeight: 0.3,
  diversityWeight: 0.1,
  newUserFallbackWeight: 0.2,
};

// =============================================================================
// DISTANCE CALCULATION UTILITIES
// =============================================================================

/**
 * Calculate distance between two points using Haversine formula
 * Returns distance in kilometers
 */
export function calculateDistance(
  lat1: number, 
  lon1: number, 
  lat2: number, 
  lon2: number
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Convert distance to score using exponential decay
 * Closer businesses get higher scores (0-1)
 */
export function distanceToScore(distanceKm: number, maxDistanceKm: number = 10): number {
  if (distanceKm >= maxDistanceKm) return 0;
  if (distanceKm <= 0) return 1;
  
  // Exponential decay: score = e^(-2*distance/maxDistance)
  const normalizedDistance = distanceKm / maxDistanceKm;
  return Math.exp(-2 * normalizedDistance);
}

// =============================================================================
// CATEGORY WEIGHT CALCULATION
// =============================================================================

/**
 * Calculate category preference weights for a user
 * Combines declared preference (40%) with behavioral data (60%)
 */
export function calculateCategoryWeights(user: UserProfile): CategoryWeights {
  const weights: CategoryWeights = {};
  
  // Initialize all categories to 0
  CATEGORIES.forEach(category => {
    weights[category.id] = 0;
  });
  
  // 1. Declared preference weight (40%)
  const declaredWeight = 0.4;
  if (user.favoriteCategory && weights.hasOwnProperty(user.favoriteCategory)) {
    weights[user.favoriteCategory] += declaredWeight;
  }
  
  // 2. Behavioral weight (60%) - based on punch card distribution
  const behavioralWeight = 0.6;
  if (user.punchCards.length > 0) {
    // Count punch cards per category
    const categoryCardCounts: { [categoryId: number]: number } = {};
    user.punchCards.forEach(card => {
      const categoryId = card.business.categoryId;
      categoryCardCounts[categoryId] = (categoryCardCounts[categoryId] || 0) + 1;
    });
    
    // Convert counts to weights (normalize by total cards)
    const totalCards = user.punchCards.length;
    Object.entries(categoryCardCounts).forEach(([categoryId, count]) => {
      const id = parseInt(categoryId);
      weights[id] += behavioralWeight * (count / totalCards);
    });
  } else {
    // New user fallback: distribute behavioral weight evenly or boost favorite category
    if (user.favoriteCategory) {
      weights[user.favoriteCategory] += behavioralWeight * 0.5;
    }
    // Add small baseline weights for popular categories
    weights[1] += behavioralWeight * 0.1; // Fitness
    weights[2] += behavioralWeight * 0.1; // Coffee  
    weights[5] += behavioralWeight * 0.2; // Food
    weights[8] += behavioralWeight * 0.1; // Other
  }
  
  return weights;
}

/**
 * Calculate category match score for a business
 */
export function calculateCategoryScore(
  business: BusinessData, 
  categoryWeights: CategoryWeights
): number {
  return categoryWeights[business.categoryId] || 0;
}

// =============================================================================
// DIVERSITY AND BONUS CALCULATIONS
// =============================================================================

/**
 * Calculate diversity bonus for businesses where user doesn't have cards
 */
export function calculateDiversityBonus(
  business: BusinessData,
  user: UserProfile
): number {
  const hasCard = user.punchCards.some(card => card.businessId === business.id);
  return hasCard ? 0 : 0.2; // 20% bonus for new businesses
}

/**
 * Ensure category diversity in results
 * Promotes businesses from underrepresented categories
 */
export function promoteCategoryDiversity(
  recommendations: RecommendationResult[],
  minCategories: number
): RecommendationResult[] {
  const categoryCount: { [categoryId: number]: number } = {};
  const result = [...recommendations];
  
  // Count categories in current results
  result.forEach(rec => {
    categoryCount[rec.business.categoryId] = (categoryCount[rec.business.categoryId] || 0) + 1;
  });
  
  const representedCategories = Object.keys(categoryCount).length;
  
  if (representedCategories >= minCategories) {
    return result; // Already diverse enough
  }
  
  // Boost scores for businesses in underrepresented categories
  const underrepresentedCategories = CATEGORIES
    .map(cat => cat.id)
    .filter(id => !categoryCount[id]);
  
  result.forEach(rec => {
    if (underrepresentedCategories.includes(rec.business.categoryId)) {
      rec.score *= 1.3; // 30% boost for diversity
      rec.explanations.push('Diversity boost applied');
    }
  });
  
  return result.sort((a, b) => b.score - a.score);
}

// =============================================================================
// MAIN RECOMMENDATION ENGINE
// =============================================================================

/**
 * Generate personalized business recommendations for a user
 */
export function generateRecommendations(
  user: UserProfile,
  businesses: BusinessData[],
  userLocation?: UserLocation,
  config: Partial<RecommendationConfig> = {}
): RecommendationResult[] {
  const finalConfig = { ...DEFAULT_CONFIG, ...config };
  const categoryWeights = calculateCategoryWeights(user);
  const recommendations: RecommendationResult[] = [];
  
  for (const business of businesses) {
    const explanations: string[] = [];
    
    // 1. Category Score (main factor)
    const categoryScore = calculateCategoryScore(business, categoryWeights);
    explanations.push(`Category match: ${Math.round(categoryScore * 100)}%`);
    
    // 2. Distance Score (if location available)
    let distanceScore = 1; // Default to full score if no location
    if (userLocation && business.latitude && business.longitude) {
      const distance = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        business.latitude,
        business.longitude
      );
      
      // Skip if too far
      if (finalConfig.maxDistance && distance > finalConfig.maxDistance) {
        continue;
      }
      
      distanceScore = distanceToScore(distance, finalConfig.maxDistance);
      explanations.push(`Distance: ${distance.toFixed(1)}km (score: ${Math.round(distanceScore * 100)}%)`);
    } else {
      explanations.push('No location data available');
    }
    
    // 3. Diversity Bonus
    const diversityBonus = calculateDiversityBonus(business, user);
    if (diversityBonus > 0) {
      explanations.push(`New business bonus: ${Math.round(diversityBonus * 100)}%`);
    }
    
    // 4. Calculate final weighted score
    const score = 
      categoryScore * finalConfig.categoryWeight +
      distanceScore * finalConfig.distanceWeight +
      diversityBonus * finalConfig.diversityWeight;
    
    recommendations.push({
      business,
      score,
      categoryScore,
      distanceScore,
      diversityBonus,
      explanations
    });
  }
  
  // Sort by score descending
  let sortedRecommendations = recommendations.sort((a, b) => b.score - a.score);
  
  // Apply diversity promotion
  if (finalConfig.minCategoryDiversity) {
    sortedRecommendations = promoteCategoryDiversity(
      sortedRecommendations, 
      finalConfig.minCategoryDiversity
    );
  }
  
  // Limit results
  if (finalConfig.maxResults) {
    sortedRecommendations = sortedRecommendations.slice(0, finalConfig.maxResults);
  }
  
  return sortedRecommendations;
}

// =============================================================================
// HELPER FUNCTIONS FOR INTEGRATION
// =============================================================================

/**
 * Convert Data Connect query results to UserProfile format
 */
export function buildUserProfile(
  user: { id: string; favoriteCategory?: number },
  punchCards: any[]
): UserProfile {
  return {
    id: user.id,
    favoriteCategory: user.favoriteCategory,
    punchCards: punchCards.map(card => ({
      id: card.id,
      businessId: card.businessId,
      userId: card.userId,
      maxPunches: card.maxPunches,
      business: {
        id: card.business.id,
        name: card.business.name,
        description: card.business.description,
        categoryId: card.business.categoryId,
        address: card.business.address,
        image: card.business.image,
        punchNum: card.business.punchNum,
        expirationDurationInDays: card.business.expirationDurationInDays,
      }
    }))
  };
}

/**
 * Create explanation text for recommendation results
 */
export function explainRecommendation(result: RecommendationResult): string {
  const categoryName = CATEGORIES.find(c => c.id === result.business.categoryId)?.name || 'Unknown';
  return `${result.business.name} (${categoryName}) - Score: ${Math.round(result.score * 100)}%\n` +
         result.explanations.map(e => `  • ${e}`).join('\n');
}

/**
 * Get summary statistics for debugging
 */
export function getRecommendationStats(
  user: UserProfile,
  results: RecommendationResult[]
): {
  totalBusinesses: number;
  avgScore: number;
  categoryDistribution: { [categoryName: string]: number };
  userCategoryWeights: { [categoryName: string]: number };
} {
  const categoryWeights = calculateCategoryWeights(user);
  
  return {
    totalBusinesses: results.length,
    avgScore: results.reduce((sum, r) => sum + r.score, 0) / results.length,
    categoryDistribution: results.reduce((dist, result) => {
      const categoryName = CATEGORIES.find(c => c.id === result.business.categoryId)?.name || 'Unknown';
      dist[categoryName] = (dist[categoryName] || 0) + 1;
      return dist;
    }, {} as { [categoryName: string]: number }),
    userCategoryWeights: Object.entries(categoryWeights).reduce((weights, [id, weight]) => {
      const categoryName = CATEGORIES.find(c => c.id === parseInt(id))?.name || 'Unknown';
      weights[categoryName] = Math.round(weight * 100) / 100;
      return weights;
    }, {} as { [categoryName: string]: number })
  };
}