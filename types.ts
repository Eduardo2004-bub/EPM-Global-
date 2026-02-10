
export enum Continent {
  GLOBAL = 'Global',
  AFRICA = 'Africa',
  ASIA = 'Asia',
  EUROPE = 'Europe',
  NORTH_AMERICA = 'North America',
  SOUTH_AMERICA = 'South America',
  OCEANIA = 'Oceania'
}

export enum TimeRange {
  TODAY = '24h',
  WEEK = '7d',
  MONTH = '30d'
}

export enum Category {
  GLOBAL = 'Global',
  BUSINESS = 'Business',
  TECHNOLOGY = 'Technology',
  ECONOMY = 'Economy',
  POLITICS = 'Politics',
  HEALTH = 'Health',
  CULTURE = 'Culture',
  MARKET_SENTIMENT = 'Market Sentiment',
  SPORTS = 'Sports',
  AGRIBUSINESS = 'Agribusiness', 
  TRAVEL = 'Travel',             
  MARKETING = 'Marketing'        
}

export enum Language {
  EN = 'en',
  PT = 'pt',
  ES = 'es',
  FR = 'fr',
  DE = 'de'
}

export enum AppView {
  FEED = 'feed',
  TV = 'tv',
  INNOVATION = 'innovation', 
  MARKET_PULSE = 'market_pulse', 
  ENTERPRISE = 'enterprise', 
  COMMUNITY = 'community',
  AI_CHAT = 'ai_chat',
  RISK_CENTER = 'risk_center',
  VERIFICATION = 'verification',
  ADMIN = 'admin' 
}

export enum BroadcastType {
  LIVE = 'LIVE',
  REPLAY = 'REPLAY'
}

export interface NewsArticle {
  id: string;
  title: string;
  summary: string;
  content: string;
  category: Category;
  subCategory?: string;
  continent: Continent;
  country?: string;
  timestamp: string;
  imageUrl: string;
  author: string;
  sourceUrl?: string;
  sentiment?: 'positive' | 'neutral' | 'negative';
  pros: string[];
  cons: string[];
  forecasts: string[];
  fetchTimestamp: number;
}

// B2B: Market Pulse Structure
export interface Competitor {
  name: string;
  movement: 'up' | 'down' | 'stable';
  marketShare: number;
  recentActivity: string;
  headquarters?: string; 
}

export interface MarketPulseReport {
  sector: string;
  region: string;
  sentimentScore: number; // 0-100
  shareOfVoice: Array<{ name: string; value: number }>;
  competitors: Competitor[];
  emergingTrend: string;
  strategicAction: string; // "Buy", "Hold", "Pivot"
  volatilityIndex: number;
  // New specific calculations
  specificMetrics: Array<{ label: string; value: string; trend: 'up' | 'down' | 'neutral' }>;
}

export interface MarketTrend {
  region: string;
  priceIndex: number;
  growth: number;
  topIndustry: string;
  avgPriceChange: number;
  sentiment: string;
}

export interface BusinessValidation {
  score: number;
  analysis: string;
  risks: string[];
  opportunities: string[];
  marketSizeEstimate?: string; 
  competitorLandscape?: string[]; 
}

export interface UserLocation {
  country?: string;
  state?: string;
  city?: string;
  detected: boolean;
}

export interface BroadcastProgram {
  id: string;
  title: string;
  description: string;
  location: string;
  continent: Continent;
  type: BroadcastType;
  thumbnail: string;
  category: Category;
  videoUrl?: string;
  source?: string;
}

export interface SocialUser {
  id: string;
  name: string;
  avatar: string;
  status: 'online' | 'offline';
  isFriend: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  timestamp: number;
  isAi?: boolean;
}

// === NEW B2B TYPES ===

export interface CorporateProfile {
  companyName: string;
  sector: string;
  keyLocations: string[];
  supplyChainFocus: string;
}

export interface RiskAlert {
  id: string;
  title: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  impactAnalysis: string;
  mitigationSuggestion: string;
}

export interface CorporateRiskReport {
  overallRiskScore: number; // 0-100
  sectorTrend: 'Stabilizing' | 'Volatile' | 'Collapsing' | 'Booming';
  activeAlerts: RiskAlert[];
  executiveBrief: string;
  lastUpdated: number;
}

// === AUTH TYPES ===

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'reader' | 'journalist_pending' | 'journalist_approved' | 'admin';
  avatar?: string;
  joinedAt: number;
  status?: 'pending_verification' | 'active'; // Added
  verificationCode?: string; // Added (mock)
}
