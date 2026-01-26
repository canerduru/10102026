export enum DefaultVendorCategory {
  VENUE = 'Venue',
  PHOTOGRAPHY = 'Photography',
  FLORISTRY = 'Floristry',
  CATERING = 'Catering',
  MUSIC = 'Music/DJ',
  VIDEOGRAPHY = 'Videography',
  HAIR_MAKEUP = 'Hair & Makeup',
  TRANSPORT = 'Transportation',
  ACCOMMODATION = 'Accommodation',
  INVITATIONS = 'Invitations',
  CAKE = 'Wedding Cake',
  ENTERTAINMENT = 'Entertainment',
  DECOR = 'Decorations',
  ATTIRE = 'Wedding Dress/Suits',
  LIGHTING = 'Lighting',
  OTHERS = 'Others'
}

export type VendorCategory = string;

export interface Vendor {
  id: string;
  name: string;
  category: VendorCategory;
  priceEstimate: number;
  rating: number; // 1-5
  reviewCount: number; // Total number of reviews
  location: string;
  available: boolean; // For 10.10.2026
  notes: string;
  portfolioUrl: string;
  status: 'contacted' | 'booked' | 'rejected' | 'favorite' | 'pending';
}

export interface BudgetItem {
  category: VendorCategory;
  allocated: number;
  spent: number;
  status: 'on-track' | 'over-budget' | 'under-budget';
  vendorId?: string;
}

export interface InspirationNote {
  id: string;
  content: string;
  category: string;
  aiSuggestion?: string;
  imageUrl?: string;
}

export interface AppState {
  vendors: Vendor[];
  budget: BudgetItem[];
  notes: InspirationNote[];
  categories: string[];
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  VENDORS = 'VENDORS',
  BUDGET = 'BUDGET',
  INSPIRATION = 'INSPIRATION',
  AI_CHAT = 'AI_CHAT'
}