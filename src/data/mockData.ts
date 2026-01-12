import { Product } from "../types";
import { projectId, publicAnonKey } from "/utils/supabase/info";

// Mock data as fallback
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Premium Wireless Headphones",
    description: "Experience crystal clear sound with our premium noise-cancelling headphones. Perfect for travel and work.",
    price: 299.99,
    image: "https://images.unsplash.com/photo-1674658556545-f18d4080ab6c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoZWFkcGhvbmVzJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjgxNTcxNjJ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Electronics",
    rating: 4.8,
    reviewCount: 124
  },
  {
    id: "2",
    name: "Urban Runner Sneakers",
    description: "Lightweight, breathable, and stylish. The Urban Runner is designed for the modern city dweller.",
    price: 89.95,
    image: "https://images.unsplash.com/photo-1622760807301-4d2351a5a942?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbmVha2VycyUyMHByb2R1Y3R8ZW58MXx8fHwxNzY4MjA1MDE5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Fashion",
    rating: 4.5,
    reviewCount: 89
  },
  {
    id: "3",
    name: "Smart Watch Series 5",
    description: "Track your fitness, notifications, and more with the new Series 5 Smart Watch. 48-hour battery life.",
    price: 199.50,
    image: "https://images.unsplash.com/photo-1714218707756-173966d250b7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzbWFydCUyMHdhdGNoJTIwcHJvZHVjdHxlbnwxfHx8fDE3NjgyMDgxODF8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral",
    category: "Electronics",
    rating: 4.9,
    reviewCount: 230
  },
  {
    id: "4",
    name: "Everyday Backpack",
    description: "Durable, water-resistant, and plenty of pockets. The only backpack you'll ever need.",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&q=80&w=800",
    category: "Accessories",
    rating: 4.6,
    reviewCount: 56
  },
  {
    id: "5",
    name: "Minimalist Leather Wallet",
    description: "Hand-crafted from genuine leather. Slim profile that fits perfectly in any pocket.",
    price: 45.00,
    image: "https://images.unsplash.com/photo-1627123424574-181ce5171bf3?auto=format&fit=crop&q=80&w=800",
    category: "Accessories",
    rating: 4.7,
    reviewCount: 42
  },
  {
    id: "6",
    name: "Professional Camera Lens",
    description: "Capture stunning portraits and landscapes with this versatile 50mm lens.",
    price: 450.00,
    image: "https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&q=80&w=800",
    category: "Electronics",
    rating: 4.9,
    reviewCount: 15
  }
];

// Fetch products from API with fallback to mock data
export async function fetchProducts(): Promise<Product[]> {
  try {
    const response = await fetch(
      `https://${projectId}.supabase.co/functions/v1/make-server-f0d6b019/products`,
      {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
        },
      }
    );
    
    if (!response.ok) {
      console.warn(`⚠️ API returned ${response.status}, using mock data`);
      return MOCK_PRODUCTS;
    }
    
    const data = await response.json();
    
    // If API returns empty array, use mock data
    if (!data || data.length === 0) {
      console.log('📦 No products in database, using mock data');
      return MOCK_PRODUCTS;
    }
    
    console.log(`✅ Loaded ${data.length} products from database`);
    return data;
  } catch (error) {
    console.warn('⚠️ Failed to fetch from API, using mock data:', error);
    return MOCK_PRODUCTS;
  }
}

// Export mock data for backward compatibility
export const PRODUCTS = MOCK_PRODUCTS;