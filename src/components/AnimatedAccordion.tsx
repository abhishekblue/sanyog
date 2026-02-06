import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Animated, LayoutChangeEvent, View } from 'react-native';

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
  const animValue = useRef(new Animated.Value(0)).current;
  const [contentHeight, setContentHeight] = useState(0);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const measuredHeight = event.nativeEvent.layout.height;
    if (measuredHeight > 0) {
      setContentHeight(measuredHeight);
    }
  }, []);

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: isExpanded ? 1 : 0,
      duration: DURATION,
      useNativeDriver: false,
    }).start();
  }, [isExpanded, animValue]);

  const animatedHeight = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight],
  });

  const animatedOpacity = animValue.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0, 0, 1],
  });

  return (
    <>
      <Animated.View
        style={{
          height: contentHeight > 0 ? animatedHeight : 0,
          opacity: contentHeight > 0 ? animatedOpacity : 0,
          overflow: 'hidden',
        }}
      >
        <View>{children}</View>
      </Animated.View>

      {/* Hidden measurer — renders off-screen to get content height */}
      {contentHeight === 0 && (
        <View
          style={{
            position: 'absolute',
            opacity: 0,
            pointerEvents: 'none',
          }}
          onLayout={onLayout}
        >
          {children}
        </View>
      )}
    </>
  );
}
