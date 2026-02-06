export const spacing = {
  // Base spacing units
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  screenHorizontal: 20,
  screenVertical: 24,

  cardPadding: 16,
  cardPaddingLarge: 20,

  buttonVertical: 14,
  buttonHorizontal: 24,

  borderRadiusSmall: 8,
  borderRadius: 12,
  borderRadiusLarge: 16,
  borderRadiusRound: 100, // For pills and circular elements
};

export const shadows = {
  subtle: {
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
  },
} as const;
