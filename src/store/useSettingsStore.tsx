import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsState {
  isSoundOn: boolean;
  isVibrationOn: boolean;
  toggleSound: () => void;
  toggleVibration: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      isSoundOn: true,
      isVibrationOn: true,
      toggleSound: () => set((state) => ({ isSoundOn: !state.isSoundOn })),
      toggleVibration: () => set((state) => ({ isVibrationOn: !state.isVibrationOn })),
    }),
    {
      name: 'game-settings', 
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);