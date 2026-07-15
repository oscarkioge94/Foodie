export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  category: string;
  categoryLabel: string;
  price: number;
  image: string;
  nutrition: NutritionInfo;
  ingredients: string[];
  sourcing: {
    item: string;
    origin: string;
    partner: string;
  };
  signature: boolean;
  recipeSteps?: string[]; // Optional cooking steps for recipes
  prepTime?: string;     // Optional prep time
  cookTime?: string;     // Optional cook time
  servings?: string;     // Optional servings info
}

export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  image: string;
  readTime: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface Reservation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  guests: number;
  zone: "solarium" | "hearth" | "counter";
  dietaryNotes?: string;
  createdAt: string;
}

export interface CateringProposal {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  guestCount: number;
  serviceType: "plated" | "family" | "canapes";
  dietaryPreferences: string[];
  notes?: string;
  estimatedCost: number;
}

export interface SourcingPartner {
  id: string;
  name: string;
  type: string;
  description: string;
  location: string;
  partnerName: string;
  ingredients: string[];
  image: string;
  coords: { x: number; y: number }; // Percentage for illustrative map overlay
}
