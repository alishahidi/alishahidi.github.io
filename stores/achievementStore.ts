import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Achievement } from '@/types';
import { achievements as achievementData } from '@/data/loaders';

interface AchievementState {
  achievements: Achievement[];
  recentUnlock: Achievement | null;

  // Actions
  checkAndUnlock: (condition: string, value: number) => Achievement | null;
  unlockAchievement: (id: string) => void;
  clearRecentUnlock: () => void;
  getUnlockedCount: () => number;
  reset: () => void;
}

export const useAchievementStore = create<AchievementState>()(
  persist(
    (set, get) => ({
      achievements: achievementData,
      recentUnlock: null,

      checkAndUnlock: (condition, value) => {
        const { achievements } = get();
        for (const achievement of achievements) {
          if (achievement.unlocked) continue;

          const [type, threshold] = achievement.condition.split(':');
          const thresholdNum = parseInt(threshold, 10);

          if (type === condition && value >= thresholdNum) {
            get().unlockAchievement(achievement.id);
            return achievement;
          }
        }
        return null;
      },

      unlockAchievement: (id) =>
        set((state) => {
          const achievement = state.achievements.find((a) => a.id === id);
          if (!achievement || achievement.unlocked) return state;

          return {
            achievements: state.achievements.map((a) =>
              a.id === id ? { ...a, unlocked: true } : a
            ),
            recentUnlock: achievement,
          };
        }),

      clearRecentUnlock: () => set({ recentUnlock: null }),

      getUnlockedCount: () =>
        get().achievements.filter((a) => a.unlocked).length,

      reset: () =>
        set({
          achievements: achievementData.map((a) => ({ ...a, unlocked: false })),
          recentUnlock: null,
        }),
    }),
    {
      name: 'consciousness-achievements-storage',
      partialize: (state) => ({
        achievements: state.achievements.map((a) => ({
          id: a.id,
          unlocked: a.unlocked,
        })),
      }),
      merge: (persisted, current) => {
        const persistedAchievements = (persisted as { achievements?: Array<{ id: string; unlocked: boolean }> })?.achievements || [];
        return {
          ...current,
          achievements: current.achievements.map((achievement) => {
            const saved = persistedAchievements.find((a) => a.id === achievement.id);
            return saved ? { ...achievement, unlocked: saved.unlocked } : achievement;
          }),
        };
      },
    }
  )
);
