import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useApp } from '../context/AppContext';
import { ISubscriptionPackage } from '../services/subscription/subscription.types';

import { styles } from './PaywallModal.styles';

// eslint-disable-next-line local-rules/no-inline-interfaces
interface IPaywallModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PaywallModal({ visible, onClose }: IPaywallModalProps): React.JSX.Element {
  const { translator, fetchPackages, purchase, restore } = useApp();
  const [packages, setPackages] = useState<ISubscriptionPackage[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const loadPackages = useCallback(async () => {
    const pkgs = await fetchPackages();
    setPackages(pkgs);
  }, [fetchPackages]);

  useEffect(() => {
    if (visible) {
      loadPackages();
    }
  }, [visible, loadPackages]);

  const handlePurchase = async (): Promise<void> => {
    const selected = packages[selectedIndex];
    if (!selected) return;

    setLoading(true);
    try {
      await purchase(selected.pkg);
      onClose();
    } catch {
      // RevenueCat handles user-cancel silently
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (): Promise<void> => {
    setRestoring(true);
    try {
      const info = await restore();
      if (info.tier === 'premium') {
        onClose();
      }
    } catch {
      // ignore
    } finally {
      setRestoring(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.container}>
              <View style={styles.handle} />

              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeButtonText}>×</Text>
              </TouchableOpacity>

              <Text style={styles.title}>{translator.t('paywall.title')}</Text>
              <Text style={styles.description}>{translator.t('paywall.description')}</Text>

              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>✓</Text>
                  <Text style={styles.featureText}>
                    {translator.t('paywall.features.unlimitedChat')}
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>✓</Text>
                  <Text style={styles.featureText}>
                    {translator.t('paywall.features.allQuestions')}
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>✓</Text>
                  <Text style={styles.featureText}>
                    {translator.t('paywall.features.analysis')}
                  </Text>
                </View>
              </View>

              <View style={styles.planCards}>
                {packages.map((pkg, index) => (
                  <TouchableOpacity
                    key={pkg.duration}
                    style={[
                      styles.planCard,
                      selectedIndex === index && styles.planCardSelected,
                    ]}
                    onPress={() => setSelectedIndex(index)}
                  >
                    <Text
                      style={[
                        styles.planDuration,
                        selectedIndex === index && styles.planDurationSelected,
                      ]}
                    >
                      {pkg.label}
                    </Text>
                    <Text
                      style={[
                        styles.planPrice,
                        selectedIndex === index && styles.planPriceSelected,
                      ]}
                    >
                      {pkg.pkg.product.priceString}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                style={styles.subscribeButton}
                onPress={handlePurchase}
                disabled={loading || packages.length === 0}
              >
                {loading ? (
                  <ActivityIndicator color="#FFFFFF" />
                ) : (
                  <Text style={styles.subscribeButtonText}>
                    {translator.t('paywall.subscribe')}
                  </Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity onPress={handleRestore} disabled={restoring}>
                <Text style={styles.restoreText}>
                  {restoring
                    ? translator.t('paywall.restoring')
                    : translator.t('paywall.restore')}
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
