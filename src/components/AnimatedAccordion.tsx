import React, { useCallback, useEffect, useState } from 'react';
import { LayoutChangeEvent, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

// eslint-disable-next-line local-rules/no-inline-interfaces
interface IAnimatedAccordionProps {
  isExpanded: boolean;
  children: React.ReactNode;
}

const DURATION = 250;

export function AnimatedAccordion({
  isExpanded,
  children,
}: IAnimatedAccordionProps): React.JSX.Element {
  const height = useSharedValue(0);
  const opacity = useSharedValue(0);
  const [contentHeight, setContentHeight] = useState(0);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const measuredHeight = event.nativeEvent.layout.height;
    if (measuredHeight > 0) {
      setContentHeight(measuredHeight);
    }
  }, []);

  useEffect(() => {
    if (isExpanded && contentHeight > 0) {
      height.value = withTiming(contentHeight, { duration: DURATION });
      opacity.value = withTiming(1, { duration: DURATION });
    } else {
      height.value = withTiming(0, { duration: DURATION });
      opacity.value = withTiming(0, { duration: DURATION * 0.6 });
    }
  }, [isExpanded, contentHeight, height, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
    overflow: 'hidden' as const,
  }));

  return (
    <>
      <Animated.View style={animatedStyle}>
        <View>{children}</View>
      </Animated.View>

      {/* Hidden measurer — renders off-screen to get content height */}
      {contentHeight === 0 && (
        <View
          style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}
          onLayout={onLayout}
        >
          {children}
        </View>
      )}
    </>
  );
}
