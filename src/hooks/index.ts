// src/hooks/index.ts - Barrel Export

export { useClients } from './useClients';
export { useLocalStorage } from './useLocalStorage';
export { useTimer } from './useTimer';
export { useDebounce } from './useDebounce';
export { useToggle } from './useToggle';
export { useApi } from './useApi';
export { useKeyPress } from './useKeyPress';
export { useWindowSize } from './useWindowSize';
export { useClickOutside } from './useClickOutside';
export { useInterval } from './useInterval';
export { usePrevious } from './usePrevious';
export { useMediaQuery } from './useMediaQuery';
export { useTheme } from './useTheme';

// Re-export types
export type { UseClientsReturn, LocalStorageValue } from '../types';
