/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/theme';

export function useTheme() {
  // Locked to light mode — the app is designed for a clean white background.
  const theme = 'light' as const;

  return Colors[theme];
}
