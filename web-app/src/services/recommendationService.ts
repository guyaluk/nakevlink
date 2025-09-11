/**
 * Recommendation Service for Nakevlink
 * 
 * This service integrates the recommendation algorithm with Firebase Data Connect
 * and provides a clean API for the UI components to consume personalized recommendations.
 */

import { 
  generateRecommendations,
  buildUserProfile,
  getRecommendationStats,
  explainRecommendation,
  type RecommendationResult,
  type RecommendationConfig,
  type UserLocation,
  type UserProfile,
  type BusinessData 
} from '@/utils/recommendations';
import { retryWithBackoff as retryWithExponentialBackoff } from '@/utils/retry';

// =============================================================================
// TYPE DEFINITIONS FOR DATA CONNECT INTEGRATION
// =============================================================================

interface DataConnectUser {
  id: string;
  name: string;
  email: string;
  favoriteCategory?: number;
  createdDatetime: any; // Timestamp
}

interface DataConnectPunchCard {
  id: string;
  businessId: string;
  userId: string;
  maxPunches: number;
  createdAt: any; // Timestamp
  expiresAt: any; // Timestamp
  business: DataConnectBusiness;
}

interface DataConnectBusiness {
  id: string;
  name: string;
  description?: string;
  categoryId: number;
  address?: string;
  image?: string;
  punchNum?: number;
  expirationDurationInDays?: number;
  contactName?: string;
  email?: string;
  phoneNumber?: string;
  createdDatetime?: any; // Timestamp
}

// Export types that are used by other components
export type { RecommendationResult, UserLocation, RecommendationConfig } from '@/utils/recommendations';

interface UserRecommendationData {
  user: DataConnectUser;
  punchCards: DataConnectPunchCard[];
}

// =============================================================================
// RECOMMENDATION SERVICE CLASS
// =============================================================================

export class RecommendationService {
  private static instance: RecommendationService;
  private cachedRecommendations: Map<string, { data: RecommendationResult[], timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): RecommendationService {
    if (!RecommendationService.instance) {
      RecommendationService.instance = new RecommendationService();
    }
    return RecommendationService.instance;
  }

  /**
   * Get personalized recommendations for a user
   */
  async getRecommendationsForUser(
    userId: string,
    userLocation?: UserLocation,
    config?: Partial<RecommendationConfig>
  ): Promise<RecommendationResult[]> {
    const cacheKey = `${userId}-${userLocation?.latitude || 'no-lat'}-${userLocation?.longitude || 'no-lon'}`;
    
    // Check cache first
    const cached = this.cachedRecommendations.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('Returning cached recommendations for user:', userId);
      return cached.data;
    }

    try {
      // Get user profile and punch cards
      const userProfile = await this.getUserProfileForRecommendations(userId);
      
      // Get all available businesses
      const businesses = await this.getBusinessesForRecommendations();
      
      // Generate recommendations
      const recommendations = generateRecommendations(
        userProfile,
        businesses,
        userLocation,
        config
      );

      // Cache the results
      this.cachedRecommendations.set(cacheKey, {
        data: recommendations,
        timestamp: Date.now()
      });

      console.log(`Generated ${recommendations.length} recommendations for user ${userId}`);
      return recommendations;

    } catch (error) {
      console.error('Error generating recommendations:', error);
      
      // Fallback to popular businesses if recommendation fails
      return this.getFallbackRecommendations(userId);
    }
  }

  /**
   * Get recommendations by specific categories
   */
  async getRecommendationsByCategories(
    userId: string,
    categoryIds: number[],
    userLocation?: UserLocation,
    config?: Partial<RecommendationConfig>
  ): Promise<RecommendationResult[]> {
    try {
      const userProfile = await this.getUserProfileForRecommendations(userId);
      const businesses = await this.getBusinessesByCategories(categoryIds);
      
      return generateRecommendations(
        userProfile,
        businesses,
        userLocation,
        config
      );
    } catch (error) {
      console.error('Error generating category-specific recommendations:', error);
      return [];
    }
  }

  /**
   * Get recommendation statistics and explanations for debugging
   */
  async getRecommendationInsights(userId: string): Promise<{
    stats: any;
    explanations: string[];
    userProfile: UserProfile;
  }> {
    try {
      const userProfile = await this.getUserProfileForRecommendations(userId);
      const businesses = await this.getBusinessesForRecommendations();
      const recommendations = generateRecommendations(userProfile, businesses);
      
      const stats = getRecommendationStats(userProfile, recommendations);
      const explanations = recommendations.slice(0, 5).map(explainRecommendation);
      
      return { stats, explanations, userProfile };
    } catch (error) {
      console.error('Error getting recommendation insights:', error);
      throw error;
    }
  }

  /**
   * Clear recommendation cache for a user (useful after user makes new punch cards)
   */
  clearUserCache(userId: string): void {
    const keysToDelete = Array.from(this.cachedRecommendations.keys())
      .filter(key => key.startsWith(userId));
    
    keysToDelete.forEach(key => this.cachedRecommendations.delete(key));
    console.log(`Cleared recommendation cache for user ${userId}`);
  }

  /**
   * Clear all cached recommendations
   */
  clearAllCache(): void {
    this.cachedRecommendations.clear();
    console.log('Cleared all recommendation cache');
  }

  // =============================================================================
  // PRIVATE DATA ACCESS METHODS
  // =============================================================================

  private async getUserProfileForRecommendations(userId: string): Promise<UserProfile> {
    return retryWithExponentialBackoff(async () => {
      // Dynamic import to avoid circular dependencies and ensure latest SDK
      const { getUserForRecommendations } = await import('@/lib/dataconnect');
      
      const result = await getUserForRecommendations({ userId });
      
      if (!result.data.user) {
        throw new Error(`User not found: ${userId}`);
      }

      return buildUserProfile(
        result.data.user,
        result.data.punchCards || []
      );
    }, 3, 1000, `getUserProfileForRecommendations(${userId})`);
  }

  private async getBusinessesForRecommendations(): Promise<BusinessData[]> {
    return retryWithExponentialBackoff(async () => {
      const { getBusinessesForRecommendations } = await import('@/lib/dataconnect');
      
      const result = await getBusinessesForRecommendations();
      
      return (result.data.businesses || []).map(this.mapDataConnectBusiness);
    }, 3, 1000, 'getBusinessesForRecommendations');
  }

  private async getBusinessesByCategories(categoryIds: number[]): Promise<BusinessData[]> {
    return retryWithExponentialBackoff(async () => {
      const { getBusinessesByCategories } = await import('@/lib/dataconnect');
      
      const result = await getBusinessesByCategories({ categoryIds });
      
      return (result.data.businesses || []).map(this.mapDataConnectBusiness);
    }, 3, 1000, `getBusinessesByCategories(${categoryIds.join(',')})`);
  }

  private async getFallbackRecommendations(userId: string): Promise<RecommendationResult[]> {
    try {
      console.log('Using fallback recommendations for user:', userId);
      
      const { getPopularBusinesses } = await import('@/lib/dataconnect');
      const result = await getPopularBusinesses({ limit: 10 });
      
      const businesses = (result.data.businesses || []).map(this.mapDataConnectBusiness);
      
      // Create minimal user profile for fallback
      const fallbackUserProfile: UserProfile = {
        id: userId,
        favoriteCategory: 5, // Default to Food category
        punchCards: []
      };
      
      return generateRecommendations(fallbackUserProfile, businesses);
    } catch (error) {
      console.error('Error getting fallback recommendations:', error);
      return [];
    }
  }

  private mapDataConnectBusiness(business: DataConnectBusiness): BusinessData {
    return {
      id: business.id,
      name: business.name,
      description: business.description,
      categoryId: business.categoryId,
      address: business.address,
      image: business.image,
      punchNum: business.punchNum,
      expirationDurationInDays: business.expirationDurationInDays,
      // Note: latitude/longitude not available in current schema
      // These can be added later when location data is integrated
    };
  }
}

// =============================================================================
// CONVENIENCE FUNCTIONS FOR COMPONENTS
// =============================================================================

/**
 * Get personalized recommendations for a user (main API)
 */
export async function getPersonalizedRecommendations(
  userId: string,
  userLocation?: UserLocation,
  config?: Partial<RecommendationConfig>
): Promise<RecommendationResult[]> {
  const service = RecommendationService.getInstance();
  return service.getRecommendationsForUser(userId, userLocation, config);
}

/**
 * Get recommendations for specific categories
 */
export async function getCategoryRecommendations(
  userId: string,
  categoryIds: number[],
  userLocation?: UserLocation,
  config?: Partial<RecommendationConfig>
): Promise<RecommendationResult[]> {
  const service = RecommendationService.getInstance();
  return service.getRecommendationsByCategories(userId, categoryIds, userLocation, config);
}

/**
 * Get insights about user's recommendation profile (for debugging/analytics)
 */
export async function getRecommendationInsights(userId: string) {
  const service = RecommendationService.getInstance();
  return service.getRecommendationInsights(userId);
}

/**
 * Clear cached recommendations after user interacts with businesses
 */
export function invalidateRecommendationCache(userId: string): void {
  const service = RecommendationService.getInstance();
  service.clearUserCache(userId);
}

// =============================================================================
// UTILITY FUNCTIONS FOR UI INTEGRATION
// =============================================================================

/**
 * Format recommendation score for display
 */
export function formatRecommendationScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

/**
 * Get category name for a business
 */
export function getBusinessCategoryName(business: BusinessData): string {
  const { CATEGORIES } = require('@/constants/categories');
  const category = CATEGORIES.find((c: any) => c.id === business.categoryId);
  return category?.name || 'Other';
}

/**
 * Get category emoji for a business
 */
export function getBusinessCategoryEmoji(business: BusinessData): string {
  const { CATEGORIES } = require('@/constants/categories');
  const category = CATEGORIES.find((c: any) => c.id === business.categoryId);
  return category?.emoji || '➕';
}

/**
 * Check if user has a punch card for this business
 */
export function userHasPunchCard(business: BusinessData, userProfile: UserProfile): boolean {
  return userProfile.punchCards.some(card => card.businessId === business.id);
}

/**
 * Get simplified explanation for recommendation
 */
export function getSimpleRecommendationExplanation(result: RecommendationResult): string {
  const categoryName = getBusinessCategoryName(result.business);
  const score = Math.round(result.score * 100);
  
  if (result.categoryScore > 0.7) {
    return `Perfect ${categoryName.toLowerCase()} match (${score}% match)`;
  }
  
  if (result.distanceScore > 0.8) {
    return `Close ${categoryName.toLowerCase()} option (${score}% match)`;
  }
  
  return `Good ${categoryName.toLowerCase()} choice (${score}% match)`;
}