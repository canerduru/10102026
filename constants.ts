import { BudgetItem, Vendor, DefaultVendorCategory, InspirationNote } from './types';

export const INITIAL_CATEGORIES: string[] = Object.values(DefaultVendorCategory);

export const INITIAL_BUDGET: BudgetItem[] = [
  { category: DefaultVendorCategory.VENUE, allocated: 0, spent: 0, status: 'on-track' },
  { category: DefaultVendorCategory.CATERING, allocated: 0, spent: 0, status: 'on-track' },
  { category: DefaultVendorCategory.PHOTOGRAPHY, allocated: 0, spent: 3500, status: 'on-track', vendorId: '2' },
  { category: DefaultVendorCategory.FLORISTRY, allocated: 0, spent: 0, status: 'on-track' },
  { category: DefaultVendorCategory.MUSIC, allocated: 0, spent: 0, status: 'on-track' },
  { category: DefaultVendorCategory.VIDEOGRAPHY, allocated: 0, spent: 0, status: 'on-track' },
  { category: DefaultVendorCategory.HAIR_MAKEUP, allocated: 0, spent: 0, status: 'on-track' },
  { category: DefaultVendorCategory.TRANSPORT, allocated: 0, spent: 0, status: 'on-track' },
  { category: DefaultVendorCategory.ACCOMMODATION, allocated: 0, spent: 0, status: 'on-track' },
  { category: DefaultVendorCategory.INVITATIONS, allocated: 0, spent: 0, status: 'on-track' },
  { category: DefaultVendorCategory.CAKE, allocated: 0, spent: 0, status: 'on-track' },
  { category: DefaultVendorCategory.ENTERTAINMENT, allocated: 0, spent: 0, status: 'on-track' },
  { category: DefaultVendorCategory.DECOR, allocated: 0, spent: 0, status: 'on-track' },
  { category: DefaultVendorCategory.ATTIRE, allocated: 0, spent: 0, status: 'on-track' },
  { category: DefaultVendorCategory.LIGHTING, allocated: 0, spent: 0, status: 'on-track' },
  { category: DefaultVendorCategory.OTHERS, allocated: 0, spent: 0, status: 'on-track' },
];

export const INITIAL_VENDORS: Vendor[] = [
  {
    id: '1',
    name: 'Kempinski Hotel Barbaros Bay',
    category: DefaultVendorCategory.VENUE,
    priceEstimate: 18000,
    rating: 0,
    reviewCount: 0,
    location: 'Kızılağaç, Bodrum',
    available: true,
    notes: 'Stunning sea view, infinity pool.',
    portfolioUrl: 'https://www.kempinski.com/en/bodrum/hotel-barbaros-bay',
    status: 'pending'
  },
  {
    id: '2',
    name: 'Aegean Light Photography',
    category: DefaultVendorCategory.PHOTOGRAPHY,
    priceEstimate: 3500,
    rating: 0,
    reviewCount: 0,
    location: 'Bodrum Center',
    available: true,
    notes: 'Good with sunset shots.',
    portfolioUrl: 'https://example.com/aegean-light',
    status: 'booked'
  },
  {
    id: '4',
    name: 'Mandarin Oriental',
    category: DefaultVendorCategory.VENUE,
    priceEstimate: 25000,
    rating: 0,
    reviewCount: 0,
    location: 'Göltürkbükü',
    available: true,
    notes: 'Very luxurious, high end.',
    portfolioUrl: 'https://www.mandarinoriental.com/en/bodrum/aegean-sea',
    status: 'contacted'
  }
];

export const INITIAL_NOTES: InspirationNote[] = [
  {
    id: 'n1',
    content: 'Serve signature cocktails named after Bodrum beaches.',
    category: 'Catering',
    imageUrl: 'https://picsum.photos/300/200?random=10'
  },
  {
    id: 'n2',
    content: 'Live Saxophone player during the sunset cocktail hour.',
    category: 'Music',
    imageUrl: 'https://picsum.photos/300/200?random=11',
    aiSuggestion: 'Great choice! Ensure the saxophonist has a portable setup. A great local vendor for this is "Bodrum Jazz Vibes". Budget approx $400-600.'
  }
];