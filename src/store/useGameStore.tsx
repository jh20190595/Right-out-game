import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface StageProgress {
    cleared: boolean;
    stars: number;
}

interface GameState {
    // 구조: { '쉬움': { '1': { cleared: true, stars: 3 } } }
    progress: Record<string, Record<string, StageProgress>>;
    saveResult: (type: string, id: string, stars: number) => void;
    resetProgress: () => void;

    getStats: () => { totalStars: number; clearedCount: number };
}

export const useGameStore = create<GameState>()(
    persist(
        (set, get) => ({
            progress: {},

            saveResult: (type, id, stars) => {
                const currentProgress = get().progress;
                const categoryData = currentProgress[type] || {};
                const prevStars = categoryData[id]?.stars || 0;

                if (stars > prevStars) {
                    set({
                        progress: {
                            ...currentProgress,
                            [type]: {
                                ...categoryData,
                                [id]: { cleared: true, stars: stars }
                            }
                        }
                    });
                }
            },

            resetProgress: () => set({ progress: {} }),

            getStats: () => {
                const progress = get().progress;
                let totalStars = 0;
                let clearedCount = 0;

                Object.values(progress).forEach((category) => {
                    Object.values(category).forEach((stage) => {
                        if (stage.cleared) {
                            totalStars += stage.stars;
                            clearedCount += 1;
                        }
                    });
                });

                return { totalStars, clearedCount };
            },
        }),
        {
            name: 'light-out',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);