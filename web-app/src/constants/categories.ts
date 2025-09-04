export interface Category {
  id: number;
  name: string;
  description: string;
  emoji: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Fitness',
    description: 'Gyms, fitness centers, personal training, and wellness services',
    emoji: '💪'
  },
  {
    id: 2,
    name: 'Coffee',
    description: 'Coffee shops, cafes, and espresso bars',
    emoji: '☕'
  },
  {
    id: 3,
    name: 'Cosmetics',
    description: 'Beauty products, skincare, makeup, and cosmetic services',
    emoji: '💄'
  },
  {
    id: 4,
    name: 'Ice Cream',
    description: 'Ice cream shops, gelato, frozen yogurt, and dessert stores',
    emoji: '🍦'
  },
  {
    id: 5,
    name: 'Food',
    description: 'Restaurants, food delivery, catering, and dining establishments',
    emoji: '🍽️'
  },
  {
    id: 6,
    name: 'Wine',
    description: 'Wine bars, wine shops, vineyards, and wine tasting',
    emoji: '🍷'
  },
  {
    id: 7,
    name: 'Beverages',
    description: 'Bars, cocktail lounges, breweries, and beverage establishments',
    emoji: '🥤'
  },
  {
    id: 8,
    name: 'Other',
    description: 'Other business types and services',
    emoji: '➕'
  }
];

export const getCategoryById = (id: number): Category | undefined => {
  return CATEGORIES.find(category => category.id === id);
};

export const getCategoryByName = (name: string): Category | undefined => {
  return CATEGORIES.find(category => category.name.toLowerCase() === name.toLowerCase());
};