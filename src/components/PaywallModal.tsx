import React from 'react';
import {
  Modal,
  Platform,
  Text,
  ToastAndroid,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { useApp } from '../context/AppContext';

import { styles } from './PaywallModal.styles';

// eslint-disable-next-line local-rules/no-inline-interfaces
interface IPaywallModalProps {
  visible: boolean;
  onClose: () => void;
}

export function PaywallModal({ visible, onClose }: IPaywallModalProps): React.JSX.Element {
  const { translator } = useApp();

  const handleUnlock = (): void => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(translator.t('paywall.comingSoon'), ToastAndroid.SHORT);
    }
    onClose();
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

              <Text style={styles.icon}>✨</Text>
              <Text style={styles.title}>{translator.t('paywall.title')}</Text>
              <Text style={styles.description}>{translator.t('paywall.description')}</Text>

              <View style={styles.featuresList}>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>✓</Text>
                  <Text style={styles.featureText}>
                    {translator.t('paywall.features.unlimited')}
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>✓</Text>
                  <Text style={styles.featureText}>
                    {translator.t('paywall.features.cultural')}
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>✓</Text>
                  <Text style={styles.featureText}>
                    {translator.t('paywall.features.analysis')}
                  </Text>
                </View>
                <View style={styles.featureItem}>
                  <Text style={styles.featureIcon}>✓</Text>
                  <Text style={styles.featureText}>
                    {translator.t('paywall.features.followup')}
                  </Text>
                </View>
              </View>

              <TouchableOpacity style={styles.unlockButton} onPress={handleUnlock}>
                <Text style={styles.unlockButtonText}>{translator.t('paywall.unlock')}</Text>
              </TouchableOpacity>
              <Text style={styles.comingSoonText}>{translator.t('paywall.comingSoon')}</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
