import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface SettingsState {
  firstTutorial : boolean;
  isSoundOn: boolean;
  isVibrationOn: boolean;
  toggoleCleared : () => void;
  toggleSound: () => void;
  toggleVibration: () => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      firstTutorial : false,
      isSoundOn: true,
      isVibrationOn: true,
      toggoleCleared : () => set((state) => ({ firstTutorial : true })),
      toggleSound: () => set((state) => ({ isSoundOn: !state.isSoundOn })),
      toggleVibration: () => set((state) => ({ isVibrationOn: !state.isVibrationOn })),
    }),
    {
      name: 'game-settings', 
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);