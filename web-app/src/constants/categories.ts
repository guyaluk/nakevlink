export interface Category {
  id: number;
  name: string;
  description: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 1,
    name: 'Fitness',
    description: 'Gyms, fitness centers, personal training, and wellness services'
  },
  {
    id: 2,
    name: 'Coffee',
    description: 'Coffee shops, cafes, and espresso bars'
  },
  {
    id: 3,
    name: 'Cosmetics',
    description: 'Beauty products, skincare, makeup, and cosmetic services'
  },
  {
    id: 4,
    name: 'Ice Cream',
    description: 'Ice cream shops, gelato, frozen yogurt, and dessert stores'
  },
  {
    id: 5,
    name: 'Food',
    description: 'Restaurants, food delivery, catering, and dining establishments'
  },
  {
    id: 6,
    name: 'Wine',
    description: 'Wine bars, wine shops, vineyards, and wine tasting'
  },
  {
    id: 7,
    name: 'Drinks',
    description: 'Bars, cocktail lounges, breweries, and beverage establishments'
  }
];

export const getCategoryById = (id: number): Category | undefined => {
  return CATEGORIES.find(category => category.id === id);
};

export const getCategoryByName = (name: string): Category | undefined => {
  return CATEGORIES.find(category => category.name.toLowerCase() === name.toLowerCase());
};