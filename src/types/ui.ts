/**
 * UI Feature Types used across MD Mobile Flagship Store components
 */

export interface FeaturedProduct {
  id: string;
  category: string[];
  name: string;
  image: string;
  specs: string[];
  rating: string;
  price: string;
  originalPrice?: string;
  blob: string;
  badge?: string;
}

export interface FlashSaleProduct {
  id: string;
  name: string;
  image: string;
  discount: string;
  price: string;
  oldPrice: string;
  sold: number;
  total: number;
  color: string;
  badge: string;
  specs: string;
}

export interface CustomerReview {
  id: string;
  name: string;
  role: string;
  avatarText: string;
  avatarColor: string;
  rating: number;
  product: string;
  content: string;
  verified: boolean;
}

export interface TechNews {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  summary: string;
  date: string;
  readTime: string;
}

export interface StoryChapter {
  kicker: string;
  heading: string;
  body: string;
  stats: { val: string; lbl: string }[];
  aura: string;
  badge: string;
  caption: string;
  code: string;
}

export interface HeroBannerItem {
  id: number;
  badge: string;
  title: string;
  subtitle: string;
  image: string;
  link: string;
  ctaText: string;
  accentColor: string;
}

