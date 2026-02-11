import { PurchasesPackage } from 'react-native-purchases';

export type SubscriptionTier = 'free' | 'premium';

export interface ISubscriptionInfo {
  tier: SubscriptionTier;
  productId: string | null;
  expiresAt: string | null;
  isActive: boolean;
}

export interface ISubscriptionPackage {
  label: string;
  duration: '1_month' | '6_months' | '3_years';
  pkg: PurchasesPackage;
}
