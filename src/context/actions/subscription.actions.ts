import { PurchasesPackage } from 'react-native-purchases';

import {
  getCustomerInfo,
  getSubscriptionPackages,
  purchasePackage,
  restorePurchases,
} from '../../services/subscription/subscription';
import {
  ISubscriptionInfo,
  ISubscriptionPackage,
  SubscriptionTier,
} from '../../services/subscription/subscription.types';
interface ISubscriptionSetters {
  setSubscriptionTierState: (tier: SubscriptionTier) => void;
  setIsPremiumState: (premium: boolean) => void;
}

export interface ISubscriptionActions {
  fetchPackages: () => Promise<ISubscriptionPackage[]>;
  purchase: (pkg: PurchasesPackage) => Promise<ISubscriptionInfo>;
  restore: () => Promise<ISubscriptionInfo>;
  refreshSubscriptionStatus: () => Promise<void>;
}

function applySubscription(info: ISubscriptionInfo, setters: ISubscriptionSetters): void {
  setters.setSubscriptionTierState(info.tier);
  setters.setIsPremiumState(info.tier !== 'free');
}

export function createSubscriptionActions(setters: ISubscriptionSetters): ISubscriptionActions {
  const fetchPackages = async (): Promise<ISubscriptionPackage[]> => {
    return getSubscriptionPackages();
  };

  const purchase = async (pkg: PurchasesPackage): Promise<ISubscriptionInfo> => {
    const info = await purchasePackage(pkg);
    applySubscription(info, setters);
    return info;
  };

  const restore = async (): Promise<ISubscriptionInfo> => {
    const info = await restorePurchases();
    applySubscription(info, setters);
    return info;
  };

  const refreshSubscriptionStatus = async (): Promise<void> => {
    try {
      const info = await getCustomerInfo();
      applySubscription(info, setters);
    } catch (error) {
      console.error('refreshSubscriptionStatus:', error);
    }
  };

  return { fetchPackages, purchase, restore, refreshSubscriptionStatus };
}
