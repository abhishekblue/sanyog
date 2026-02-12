import Constants from 'expo-constants';
import Purchases, {
  CustomerInfo,
  LOG_LEVEL,
  PurchasesPackage,
} from 'react-native-purchases';

import { ISubscriptionInfo, ISubscriptionPackage } from './subscription.types';

const ENTITLEMENT_ID = 'premium';

const PRODUCT_DURATIONS: Record<string, ISubscriptionPackage['duration']> = {
  samvaad_1month: '1_month',
  samvaad_6month: '6_months',
  samvaad_lifetime: 'lifetime',
};

const DURATION_LABELS: Record<ISubscriptionPackage['duration'], string> = {
  '1_month': '1 Month',
  '6_months': '6 Months',
  lifetime: 'Lifetime',
};

export async function initializeSubscriptions(uid: string): Promise<void> {
  const apiKey = Constants.expoConfig?.extra?.revenueCatApiKey;
  if (!apiKey) {
    console.warn('RevenueCat API key not configured');
    return;
  }

  if (__DEV__) {
    Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  }

  Purchases.configure({ apiKey, appUserID: uid });
}

export function deriveSubscriptionInfo(customerInfo: CustomerInfo): ISubscriptionInfo {
  const entitlement = customerInfo.entitlements.active[ENTITLEMENT_ID];
  if (entitlement) {
    return {
      tier: 'premium',
      productId: entitlement.productIdentifier,
      expiresAt: entitlement.expirationDate,
      isActive: true,
    };
  }

  return { tier: 'free', productId: null, expiresAt: null, isActive: false };
}

export async function getSubscriptionPackages(): Promise<ISubscriptionPackage[]> {
  try {
    const offerings = await Purchases.getOfferings();
    const packages = offerings.current?.availablePackages ?? [];

    return packages
      .filter((pkg) => pkg.product.identifier in PRODUCT_DURATIONS)
      .map((pkg) => {
        const duration = PRODUCT_DURATIONS[pkg.product.identifier];
        return {
          label: DURATION_LABELS[duration],
          duration,
          pkg,
        };
      });
  } catch (error) {
    console.error('getSubscriptionPackages:', error);
    return [];
  }
}

export async function purchasePackage(
  pkg: PurchasesPackage
): Promise<ISubscriptionInfo> {
  const { customerInfo } = await Purchases.purchasePackage(pkg);
  return deriveSubscriptionInfo(customerInfo);
}

export async function restorePurchases(): Promise<ISubscriptionInfo> {
  const customerInfo = await Purchases.restorePurchases();
  return deriveSubscriptionInfo(customerInfo);
}

export async function getCustomerInfo(): Promise<ISubscriptionInfo> {
  const customerInfo = await Purchases.getCustomerInfo();
  return deriveSubscriptionInfo(customerInfo);
}
