
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "snacks" | "fresh";
  isAvailable: boolean;
  isPreOrder?: boolean;
  deliveryEstimate?: string;
  shipping?: {
    domestic: boolean;
    international: boolean;
  };
  preparation?: string;
  ingredients?: string[];
}

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  category: "snacks" | "fresh";
}

export type User = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Sample product data
export const PRODUCTS: Product[] = [
  {
    id: "trad-001",
    name: "Homemade Chakli",
    description: "Crispy spiral-shaped snack made from rice flour, gram flour, and spices.",
    price: 299,
    image: "https://images.unsplash.com/photo-1589496933738-f5c27bc146e7?q=80&w=3087&auto=format&fit=crop",
    category: "snacks",
    isAvailable: true,
    shipping: {
      domestic: true,
      international: true,
    },
    ingredients: ["Rice flour", "Gram flour", "Cumin seeds", "Sesame seeds", "Salt", "Vegetable oil"]
  },
  {
    id: "trad-002",
    name: "Besan Ladoo",
    description: "Sweet round balls made from gram flour, ghee, sugar, and cardamom.",
    price: 399,
    image: "https://images.unsplash.com/photo-1590331029963-b7e1a29b8517?q=80&w=3087&auto=format&fit=crop",
    category: "snacks",
    isAvailable: true,
    shipping: {
      domestic: true,
      international: true,
    },
    ingredients: ["Gram flour", "Ghee", "Sugar", "Cardamom powder", "Cashews", "Raisins"]
  },
  {
    id: "trad-003",
    name: "Butter Murukku",
    description: "Crunchy twisted snack made with rice flour, butter, and authentic spices.",
    price: 349,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?q=80&w=3069&auto=format&fit=crop",
    category: "snacks",
    isAvailable: true,
    shipping: {
      domestic: true,
      international: true,
    },
    ingredients: ["Rice flour", "Butter", "Salt", "Cumin", "Black pepper", "Vegetable oil"]
  },
  {
    id: "trad-004",
    name: "Masala Mathri",
    description: "Flaky and crispy savory crackers flavored with carom seeds and spices.",
    price: 249,
    image: "https://images.unsplash.com/photo-1558138838-76294be30005?q=80&w=3087&auto=format&fit=crop",
    category: "snacks",
    isAvailable: false,
    shipping: {
      domestic: true,
      international: false,
    },
    ingredients: ["All-purpose flour", "Semolina", "Vegetable oil", "Carom seeds", "Red chili powder", "Salt"]
  },
  {
    id: "fresh-001",
    name: "Rainbow Fruit Bowl",
    description: "Freshly cut seasonal fruits arranged in a colorful, Instagram-worthy bowl.",
    price: 179,
    image: "https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?q=80&w=3024&auto=format&fit=crop",
    category: "fresh",
    isAvailable: true,
    isPreOrder: true,
    deliveryEstimate: "next morning",
    preparation: "Freshly prepared every morning",
    ingredients: ["Mango", "Strawberry", "Blueberry", "Kiwi", "Pineapple", "Pomegranate"]
  },
  {
    id: "fresh-002",
    name: "Overnight Oats",
    description: "Protein-packed overnight oats with chia seeds, nuts, and honey.",
    price: 149,
    image: "https://images.unsplash.com/photo-1641655944278-48e39d3d9096?q=80&w=3069&auto=format&fit=crop",
    category: "fresh",
    isAvailable: true,
    deliveryEstimate: "2-4 hours",
    preparation: "Prepared 8 hours before delivery",
    ingredients: ["Rolled oats", "Almond milk", "Chia seeds", "Honey", "Mixed nuts", "Cinnamon"]
  },
  {
    id: "fresh-003",
    name: "Detox Green Smoothie",
    description: "Refreshing green smoothie with spinach, cucumber, mint, and lemon.",
    price: 129,
    image: "https://images.unsplash.com/photo-1619898804693-464a99e95475?q=80&w=3024&auto=format&fit=crop",
    category: "fresh",
    isAvailable: true,
    deliveryEstimate: "1-2 hours",
    preparation: "Made fresh upon order",
    ingredients: ["Spinach", "Cucumber", "Green apple", "Mint", "Lemon", "Ginger"]
  },
  {
    id: "fresh-004",
    name: "Protein Yogurt Parfait",
    description: "Greek yogurt parfait with homemade granola, berries, and honey.",
    price: 159,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?q=80&w=3087&auto=format&fit=crop",
    category: "fresh",
    isAvailable: true,
    isPreOrder: true,
    deliveryEstimate: "tomorrow",
    preparation: "Prepared 2 hours before delivery",
    ingredients: ["Greek yogurt", "Granola", "Mixed berries", "Honey", "Chia seeds", "Mint leaves"]
  }
];
