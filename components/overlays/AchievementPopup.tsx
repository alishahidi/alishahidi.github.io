'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAchievementStore } from '@/stores/achievementStore';

export function AchievementPopup() {
  const { recentUnlock, clearRecentUnlock } = useAchievementStore();

  useEffect(() => {
    if (recentUnlock) {
      const timer = setTimeout(() => {
        clearRecentUnlock();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [recentUnlock, clearRecentUnlock]);

  return (
    <AnimatePresence>
      {recentUnlock && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.9 }}
          transition={{ type: 'spring', damping: 20, stiffness: 300 }}
          className="fixed top-20 left-1/2 -translate-x-1/2 z-50"
        >
          <div
            className="bg-black/90 backdrop-blur-sm border border-[#ffff00]/50 rounded-lg px-6 py-4
              shadow-lg"
            style={{
              boxShadow: '0 0 30px rgba(255, 255, 0, 0.3)',
            }}
          >
            {/* Unlock animation */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1, type: 'spring', damping: 10 }}
              className="text-center mb-2"
            >
              <span className="text-4xl">{recentUnlock.icon}</span>
            </motion.div>

            {/* Achievement unlocked text */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-center"
            >
              <div className="text-[#ffff00] font-mono text-xs uppercase tracking-wider mb-1">
                Achievement Unlocked
              </div>
              <div className="text-white font-mono text-lg font-bold">
                {recentUnlock.name}
              </div>
              <div className="text-gray-400 font-mono text-sm mt-1">
                {recentUnlock.description}
              </div>

              {recentUnlock.reward && (
                <div className="text-[#00ff41] font-mono text-xs mt-2">
                  + {recentUnlock.reward}
                </div>
              )}
            </motion.div>

            {/* Progress bar animation */}
            <motion.div
              className="absolute bottom-0 left-0 h-1 bg-[#ffff00]"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 5, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
