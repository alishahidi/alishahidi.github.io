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
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [recentUnlock, clearRecentUnlock]);

  return (
    <AnimatePresence>
      {recentUnlock && (
        <motion.div
          initial={{ opacity: 0, y: -30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 350 }}
          className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1rem)] sm:w-auto"
        >
          <div
            className="relative bg-black/90 backdrop-blur-sm border border-[#FDB813]/40 rounded-lg
              px-3 py-2 flex items-center gap-2.5 overflow-hidden"
            style={{ boxShadow: '0 0 20px rgba(253,184,19,0.15)' }}
          >
            {/* Icon */}
            <span className="text-xl leading-none shrink-0">{recentUnlock.icon}</span>

            {/* Text */}
            <div className="min-w-0">
              <div className="text-[9px] font-mono text-[#FDB813]/70 uppercase tracking-wider">
                Achievement Unlocked
              </div>
              <div className="text-white font-mono text-xs sm:text-sm font-bold truncate">
                {recentUnlock.name}
              </div>
            </div>

            {/* Timer bar */}
            <motion.div
              className="absolute bottom-0 left-0 h-0.5 bg-[#FDB813]"
              initial={{ width: '100%' }}
              animate={{ width: '0%' }}
              transition={{ duration: 4, ease: 'linear' }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
