/**
 * Recommendation Algorithm Usage Examples and Documentation
 * 
 * This file provides comprehensive examples of how to use the Nakevlink
 * recommendation system in various scenarios.
 */

import { 
  getPersonalizedRecommendations,
  getCategoryRecommendations,
  getRecommendationInsights,
  invalidateRecommendationCache,
  formatRecommendationScore,
  getSimpleRecommendationExplanation,
  type RecommendationResult,
  type UserLocation,
  type RecommendationConfig 
} from '@/services/recommendationService';

// =============================================================================
// EXAMPLE 1: BASIC PERSONALIZED RECOMMENDATIONS
// =============================================================================

/**
 * Example: Get basic personalized recommendations for a user
 * This is the most common use case for the DiscoveryScreen component
 */
export async function example1_BasicRecommendations() {
  const userId = "firebase-user-id-123";
  
  try {
    // Get recommendations without location
    const recommendations = await getPersonalizedRecommendations(userId);
    
    console.log(`Found ${recommendations.length} recommendations:`);
    recommendations.slice(0, 3).forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.business.name}`);
      console.log(`   Score: ${formatRecommendationScore(rec.score)}`);
      console.log(`   Explanation: ${getSimpleRecommendationExplanation(rec)}`);
      console.log(`   Category: ${rec.business.categoryId}`);
      console.log('');
    });
    
    return recommendations;
  } catch (error) {
    console.error('Error getting basic recommendations:', error);
    return [];
  }
}

// =============================================================================
// EXAMPLE 2: LOCATION-BASED RECOMMENDATIONS
// =============================================================================

/**
 * Example: Get recommendations with user location for distance-based scoring
 * Use this when user grants location permission
 */
export async function example2_LocationBasedRecommendations() {
  const userId = "firebase-user-id-123";
  
  // Example: User in Tel Aviv, Israel
  const userLocation: UserLocation = {
    latitude: 32.0853,
    longitude: 34.7818
  };
  
  // Custom configuration for location-based recommendations
  const config: RecommendationConfig = {
    maxDistance: 5, // 5km radius instead of default 10km
    maxResults: 15,
    distanceWeight: 0.4, // Increase distance importance
    categoryWeight: 0.6, // Decrease category importance slightly
  };
  
  try {
    const recommendations = await getPersonalizedRecommendations(
      userId, 
      userLocation, 
      config
    );
    
    console.log('Location-based recommendations:');
    recommendations.slice(0, 5).forEach((rec, index) => {
      console.log(`${index + 1}. ${rec.business.name}`);
      console.log(`   Overall Score: ${formatRecommendationScore(rec.score)}`);
      console.log(`   Distance Score: ${formatRecommendationScore(rec.distanceScore)}`);
      console.log(`   Category Score: ${formatRecommendationScore(rec.categoryScore)}`);
      console.log(`   Address: ${rec.business.address || 'No address'}`);
      console.log('');
    });
    
    return recommendations;
  } catch (error) {
    console.error('Error getting location-based recommendations:', error);
    return [];
  }
}

// =============================================================================
// EXAMPLE 3: CATEGORY-SPECIFIC RECOMMENDATIONS
// =============================================================================

/**
 * Example: Get recommendations for specific categories
 * Use this for category filter functionality
 */
export async function example3_CategorySpecificRecommendations() {
  const userId = "firebase-user-id-123";
  
  // User wants coffee and food recommendations
  const categoryIds = [2, 5]; // Coffee = 2, Food = 5
  
  try {
    const recommendations = await getCategoryRecommendations(
      userId,
      categoryIds,
      undefined, // No location
      {
        maxResults: 10,
        categoryWeight: 0.8, // High category weight since user filtered by category
        distanceWeight: 0.2   // Lower distance weight for category filtering
      }
    );
    
    console.log('Category-specific recommendations (Coffee & Food):');
    recommendations.forEach((rec, index) => {
      const categoryName = rec.business.categoryId === 2 ? 'Coffee' : 'Food';
      console.log(`${index + 1}. ${rec.business.name} (${categoryName})`);
      console.log(`   Score: ${formatRecommendationScore(rec.score)}`);
      console.log(`   ${rec.business.description || 'No description'}`);
      console.log('');
    });
    
    return recommendations;
  } catch (error) {
    console.error('Error getting category recommendations:', error);
    return [];
  }
}

// =============================================================================
// EXAMPLE 4: NEW USER RECOMMENDATIONS
// =============================================================================

/**
 * Example: Handle recommendations for new users with no punch cards
 * The algorithm automatically provides fallback logic for new users
 */
export async function example4_NewUserRecommendations() {
  const newUserId = "firebase-new-user-456";
  
  // Configuration optimized for new users
  const newUserConfig: RecommendationConfig = {
    maxResults: 20,
    categoryWeight: 0.5, // Lower category weight since no behavioral data
    distanceWeight: 0.5, // Equal weight to distance for exploration
  };
  
  try {
    const recommendations = await getPersonalizedRecommendations(
      newUserId,
      undefined,
      newUserConfig
    );
    
    console.log('New user recommendations (by category):');
    
    // Group by category to show variety
    const byCategory: { [category: number]: RecommendationResult[] } = {};
    recommendations.forEach(rec => {
      if (!byCategory[rec.business.categoryId]) {
        byCategory[rec.business.categoryId] = [];
      }
      byCategory[rec.business.categoryId].push(rec);
    });
    
    Object.entries(byCategory).forEach(([categoryId, recs]) => {
      const categoryName = getCategoryName(parseInt(categoryId));
      console.log(`\n${categoryName} (${recs.length} businesses):`);
      recs.slice(0, 2).forEach(rec => {
        console.log(`  • ${rec.business.name} - ${formatRecommendationScore(rec.score)}`);
      });
    });
    
    return recommendations;
  } catch (error) {
    console.error('Error getting new user recommendations:', error);
    return [];
  }
}

// =============================================================================
// EXAMPLE 5: RECOMMENDATION INSIGHTS AND ANALYTICS
// =============================================================================

/**
 * Example: Get detailed insights about user preferences and recommendation logic
 * Use this for debugging, analytics, or showing users why they got certain recommendations
 */
export async function example5_RecommendationInsights() {
  const userId = "firebase-user-id-123";
  
  try {
    const insights = await getRecommendationInsights(userId);
    
    console.log('=== USER RECOMMENDATION INSIGHTS ===');
    console.log('\nUser Profile:');
    console.log(`- User ID: ${insights.userProfile.id}`);
    console.log(`- Declared Favorite Category: ${insights.userProfile.favoriteCategory || 'None'}`);
    console.log(`- Total Punch Cards: ${insights.userProfile.punchCards.length}`);
    
    console.log('\nBehavioral Analysis:');
    const cardsByCategory: { [category: number]: number } = {};
    insights.userProfile.punchCards.forEach(card => {
      cardsByCategory[card.business.categoryId] = (cardsByCategory[card.business.categoryId] || 0) + 1;
    });
    
    Object.entries(cardsByCategory).forEach(([categoryId, count]) => {
      const categoryName = getCategoryName(parseInt(categoryId));
      console.log(`- ${categoryName}: ${count} punch cards`);
    });
    
    console.log('\nCalculated Category Weights:');
    Object.entries(insights.stats.userCategoryWeights).forEach(([category, weight]) => {
      console.log(`- ${category}: ${(weight as number * 100).toFixed(1)}%`);
    });
    
    console.log('\nRecommendation Statistics:');
    console.log(`- Total Recommendations: ${insights.stats.totalBusinesses}`);
    console.log(`- Average Score: ${(insights.stats.avgScore * 100).toFixed(1)}%`);
    
    console.log('\nCategory Distribution in Results:');
    Object.entries(insights.stats.categoryDistribution).forEach(([category, count]) => {
      console.log(`- ${category}: ${count} businesses`);
    });
    
    console.log('\nTop 5 Recommendation Explanations:');
    insights.explanations.forEach((explanation, index) => {
      console.log(`${index + 1}. ${explanation}\n`);
    });
    
    return insights;
  } catch (error) {
    console.error('Error getting recommendation insights:', error);
    throw error;
  }
}

// =============================================================================
// EXAMPLE 6: INTEGRATION WITH REACT COMPONENT
// =============================================================================

/**
 * Example: How to integrate recommendations into a React component
 * This shows the pattern for DiscoveryScreen or similar components
 */
export class RecommendationComponentExample {
  /**
   * React hook pattern for loading recommendations
   */
  static getReactHookExample() {
    return `
import { useState, useEffect } from 'react';
import { getPersonalizedRecommendations, invalidateRecommendationCache } from '@/services/recommendationService';
import { useAuth } from '@/contexts/AuthContext';

export function usePersonalizedRecommendations(userLocation?: UserLocation) {
  const { user } = useAuth();
  const [recommendations, setRecommendations] = useState<RecommendationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecommendations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const recs = await getPersonalizedRecommendations(
        user.uid,
        userLocation,
        {
          maxResults: 15
        }
      );
      
      setRecommendations(recs);
    } catch (err) {
      setError('Failed to load recommendations');
      console.error('Recommendation error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load recommendations on mount and when user/location changes
  useEffect(() => {
    loadRecommendations();
  }, [user?.uid, userLocation?.latitude, userLocation?.longitude]);

  // Refresh recommendations after user creates new punch card
  const refreshRecommendations = () => {
    if (user) {
      invalidateRecommendationCache(user.uid);
      loadRecommendations();
    }
  };

  return { recommendations, loading, error, refreshRecommendations };
}
    `;
  }

  /**
   * Component usage example
   */
  static getComponentExample() {
    return `
import React from 'react';
import { usePersonalizedRecommendations } from './hooks/usePersonalizedRecommendations';
import { formatRecommendationScore, getSimpleRecommendationExplanation } from '@/services/recommendationService';

export function RecommendedBusinessesList({ userLocation }: { userLocation?: UserLocation }) {
  const { recommendations, loading, error } = usePersonalizedRecommendations(userLocation);

  if (loading) return <div>Loading personalized recommendations...</div>;
  if (error) return <div>Error: {error}</div>;
  if (recommendations.length === 0) return <div>No recommendations available</div>;

  return (
    <div className="recommended-businesses">
      <h2>Recommended for You</h2>
      
      {recommendations.map((rec, index) => (
        <div key={rec.business.id} className="business-card">
          <div className="business-header">
            <h3>{rec.business.name}</h3>
            <span className="match-score">
              {formatRecommendationScore(rec.score)} match
            </span>
          </div>
          
          <p className="business-description">
            {rec.business.description || 'No description available'}
          </p>
          
          <div className="recommendation-explanation">
            {getSimpleRecommendationExplanation(rec)}
          </div>
          
          <div className="business-details">
            <span>Punches needed: {rec.business.punchNum || 'Unknown'}</span>
            <span>Category: {getCategoryName(rec.business.categoryId)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
    `;
  }
}

// =============================================================================
// EXAMPLE 7: CACHE MANAGEMENT
// =============================================================================

/**
 * Example: How to manage recommendation cache for optimal performance
 */
export async function example7_CacheManagement() {
  const userId = "firebase-user-id-123";
  
  console.log('=== CACHE MANAGEMENT EXAMPLE ===');
  
  // 1. Get initial recommendations (will be cached)
  console.log('1. Getting initial recommendations...');
  const recs1 = await getPersonalizedRecommendations(userId);
  console.log(`   Found ${recs1.length} recommendations (cached for 5 minutes)`);
  
  // 2. Get recommendations again (should use cache)
  console.log('2. Getting recommendations again (should use cache)...');
  const recs2 = await getPersonalizedRecommendations(userId);
  console.log(`   Found ${recs2.length} recommendations (from cache)`);
  
  // 3. User creates a new punch card - invalidate cache
  console.log('3. User created new punch card - invalidating cache...');
  invalidateRecommendationCache(userId);
  
  // 4. Get fresh recommendations
  console.log('4. Getting fresh recommendations...');
  const recs3 = await getPersonalizedRecommendations(userId);
  console.log(`   Found ${recs3.length} recommendations (fresh data)`);
  
  return { initial: recs1, cached: recs2, fresh: recs3 };
}

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function getCategoryName(categoryId: number): string {
  const categories = {
    1: 'Fitness',
    2: 'Coffee', 
    3: 'Cosmetics',
    4: 'Ice Cream',
    5: 'Food',
    6: 'Wine',
    7: 'Beverages',
    8: 'Other'
  };
  return categories[categoryId as keyof typeof categories] || 'Unknown';
}

// =============================================================================
// TESTING AND DEVELOPMENT UTILITIES
// =============================================================================

/**
 * Run all examples for testing and demonstration
 */
export async function runAllExamples() {
  console.log('=== RUNNING ALL RECOMMENDATION EXAMPLES ===\n');
  
  try {
    await example1_BasicRecommendations();
    console.log('\n' + '='.repeat(60) + '\n');
    
    await example2_LocationBasedRecommendations();
    console.log('\n' + '='.repeat(60) + '\n');
    
    await example3_CategorySpecificRecommendations();
    console.log('\n' + '='.repeat(60) + '\n');
    
    await example4_NewUserRecommendations();
    console.log('\n' + '='.repeat(60) + '\n');
    
    await example5_RecommendationInsights();
    console.log('\n' + '='.repeat(60) + '\n');
    
    await example7_CacheManagement();
    
    console.log('\n=== ALL EXAMPLES COMPLETED ===');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

/**
 * Performance testing utility
 */
export async function performanceTest(userId: string, iterations: number = 10) {
  console.log(`=== PERFORMANCE TEST (${iterations} iterations) ===`);
  
  const times: number[] = [];
  
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    await getPersonalizedRecommendations(userId);
    const end = Date.now();
    times.push(end - start);
    console.log(`Iteration ${i + 1}: ${end - start}ms`);
  }
  
  const avgTime = times.reduce((sum, time) => sum + time, 0) / times.length;
  const minTime = Math.min(...times);
  const maxTime = Math.max(...times);
  
  console.log('\nPerformance Results:');
  console.log(`- Average time: ${avgTime.toFixed(2)}ms`);
  console.log(`- Min time: ${minTime}ms`);
  console.log(`- Max time: ${maxTime}ms`);
  console.log(`- Cache hits: ${times.filter(time => time < 50).length}/${iterations}`);
  
  return { avgTime, minTime, maxTime, times };
}