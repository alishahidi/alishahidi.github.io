'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useAchievementStore } from '@/stores/achievementStore';
import { useNavigationStore } from '@/stores/navigationStore';

type Tab = 'overview' | 'achievements' | 'stats';

const CATEGORY_COLORS = {
  planets: '#FDB813',
  skills: '#00ffff',
  projects: '#00ff41',
  philosophy: '#ff00ff',
  secrets: '#ff0055',
};

const CATEGORY_TOTALS = {
  planets: 5,
  skills: 12,
  projects: 7,
  philosophy: 6,
  secrets: 5,
};

function ProgressRing({ percent }: { percent: number }) {
  const radius = 52;
  const stroke = 6;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative w-32 h-32 mx-auto">
      <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#FDB81320"
          strokeWidth={stroke}
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="#FDB813"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-mono font-bold text-[#FDB813]">
          {percent}%
        </span>
        <span className="text-[10px] font-mono text-gray-500 uppercase">
          Explored
        </span>
      </div>
    </div>
  );
}

function CategoryBar({
  label,
  current,
  total,
  color,
}: {
  label: string;
  current: number;
  total: number;
  color: string;
}) {
  const percent = total > 0 ? Math.min((current / total) * 100, 100) : 0;

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs font-mono w-24 text-gray-400 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-2 bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color }}
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.5, delay: 0.1 }}
        />
      </div>
      <span className="text-xs font-mono w-10 text-right" style={{ color }}>
        {current}/{total}
      </span>
    </div>
  );
}

function OverviewTab() {
  const discoveredNodes = useDiscoveryStore((s) => s.discoveredNodes);
  const planetsVisited = useDiscoveryStore((s) => s.planetsVisited);
  const projectsVisited = useDiscoveryStore((s) => s.projectsVisited);
  const nebulaeVisited = useDiscoveryStore((s) => s.nebulaeVisited);
  const secretsFound = useDiscoveryStore((s) => s.secretsFound);

  // Count discovered skills from discovered nodes
  const skillsDiscovered = useMemo(
    () => discoveredNodes.filter((id) => id.startsWith('skill-')).length,
    [discoveredNodes]
  );

  const totalDiscovered =
    planetsVisited.length +
    skillsDiscovered +
    projectsVisited.length +
    nebulaeVisited.length +
    secretsFound;

  const grandTotal =
    CATEGORY_TOTALS.planets +
    CATEGORY_TOTALS.skills +
    CATEGORY_TOTALS.projects +
    CATEGORY_TOTALS.philosophy +
    CATEGORY_TOTALS.secrets;

  const overallPercent =
    grandTotal > 0 ? Math.round((totalDiscovered / grandTotal) * 100) : 0;

  return (
    <div className="space-y-6">
      <ProgressRing percent={overallPercent} />

      <div className="space-y-3">
        <h4 className="text-[10px] font-mono text-gray-500 uppercase tracking-wider">
          Category Breakdown
        </h4>
        <CategoryBar
          label="Planets"
          current={planetsVisited.length}
          total={CATEGORY_TOTALS.planets}
          color={CATEGORY_COLORS.planets}
        />
        <CategoryBar
          label="Skills"
          current={skillsDiscovered}
          total={CATEGORY_TOTALS.skills}
          color={CATEGORY_COLORS.skills}
        />
        <CategoryBar
          label="Projects"
          current={projectsVisited.length}
          total={CATEGORY_TOTALS.projects}
          color={CATEGORY_COLORS.projects}
        />
        <CategoryBar
          label="Philosophy"
          current={nebulaeVisited.length}
          total={CATEGORY_TOTALS.philosophy}
          color={CATEGORY_COLORS.philosophy}
        />
        <CategoryBar
          label="Secrets"
          current={secretsFound}
          total={CATEGORY_TOTALS.secrets}
          color={CATEGORY_COLORS.secrets}
        />
      </div>
    </div>
  );
}

function AchievementsTab() {
  const achievements = useAchievementStore((s) => s.achievements);
  const unlockedCount = useAchievementStore((s) => s.getUnlockedCount());

  return (
    <div className="space-y-4">
      <div className="text-center">
        <span className="text-xs font-mono text-[#FDB813]">
          {unlockedCount}/{achievements.length} UNLOCKED
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {achievements.map((a) => (
          <div
            key={a.id}
            className="p-2.5 rounded border transition-all"
            style={{
              borderColor: a.unlocked ? '#FDB81360' : '#333',
              backgroundColor: a.unlocked ? '#FDB81308' : '#111',
              boxShadow: a.unlocked ? '0 0 12px #FDB81320' : 'none',
            }}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg leading-none">
                {a.unlocked ? a.icon : '\uD83D\uDD12'}
              </span>
              <div className="min-w-0">
                <p
                  className="text-xs font-mono font-bold truncate"
                  style={{ color: a.unlocked ? '#FDB813' : '#555' }}
                >
                  {a.unlocked ? a.name : '???'}
                </p>
                <p className="text-[10px] font-mono text-gray-500 leading-tight mt-0.5">
                  {a.unlocked ? a.description : 'Keep exploring...'}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatsTab() {
  const totalClicks = useDiscoveryStore((s) => s.totalClicks);
  const terminalCommandsUsed = useDiscoveryStore((s) => s.terminalCommandsUsed);
  const connectionsFollowed = useDiscoveryStore((s) => s.connectionsFollowed);
  const secretsFound = useDiscoveryStore((s) => s.secretsFound);
  const philosophyRead = useDiscoveryStore((s) => s.philosophyRead);
  const totalVisits = useDiscoveryStore((s) => s.totalVisits);
  const firstVisitDate = useDiscoveryStore((s) => s.firstVisitDate);
  const sunClicked = useDiscoveryStore((s) => s.sunClicked);
  const discoveredNodes = useDiscoveryStore((s) => s.discoveredNodes);
  const getSessionDuration = useDiscoveryStore((s) => s.getSessionDuration);
  const getNodesPerMinute = useDiscoveryStore((s) => s.getNodesPerMinute);

  const sessionDuration = getSessionDuration();
  const mins = Math.floor(sessionDuration / 60);
  const secs = sessionDuration % 60;
  const firstVisit = firstVisitDate
    ? new Date(firstVisitDate).toLocaleDateString()
    : 'This session';

  const stats = [
    { label: 'Session Time', value: `${mins}m ${secs}s`, color: '#FDB813' },
    { label: 'Total Visits', value: String(totalVisits), color: '#FDB813' },
    { label: 'First Visit', value: firstVisit, color: '#FDB813' },
    { label: '', value: '', color: '' }, // spacer
    { label: 'Nodes Discovered', value: String(discoveredNodes.length), color: '#00ffff' },
    { label: 'Total Clicks', value: String(totalClicks), color: '#00ffff' },
    { label: 'Terminal Commands', value: String(terminalCommandsUsed), color: '#00ffff' },
    { label: 'Connections Followed', value: String(connectionsFollowed), color: '#00ffff' },
    { label: '', value: '', color: '' }, // spacer
    { label: 'Secrets Found', value: String(secretsFound), color: '#ff0055' },
    { label: 'Philosophy Read', value: String(philosophyRead), color: '#ff00ff' },
    { label: 'Nodes/Minute', value: String(getNodesPerMinute()), color: '#00ff41' },
    { label: 'Sun Clicked', value: sunClicked ? 'Yes' : 'No', color: '#FDB813' },
  ];

  return (
    <div className="space-y-1.5">
      {stats.map((stat, i) =>
        stat.label === '' ? (
          <div key={i} className="h-2" />
        ) : (
          <div key={stat.label} className="flex items-center justify-between py-1 px-1">
            <span className="text-xs font-mono text-gray-400">{stat.label}</span>
            <span className="text-xs font-mono font-bold" style={{ color: stat.color }}>
              {stat.value}
            </span>
          </div>
        )
      )}
    </div>
  );
}

export function ExplorationBoard() {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const showBoard = useNavigationStore((s) => s.showExplorationBoard);
  const toggleBoard = useNavigationStore((s) => s.toggleExplorationBoard);

  const tabs: { id: Tab; label: string }[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'achievements', label: 'Achievements' },
    { id: 'stats', label: 'Stats' },
  ];

  return (
    <AnimatePresence>
      {showBoard && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.25 }}
          className="fixed top-4 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 w-[calc(100%-2rem)] sm:w-[440px] max-h-[80vh] z-45 overflow-hidden pointer-events-auto"
        >
          <div className="bg-black/95 backdrop-blur-md border border-[#FDB813]/30 rounded-lg overflow-hidden shadow-2xl">
            {/* Header */}
            <div className="px-4 py-3 border-b border-[#FDB813]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-[#FDB813] animate-pulse" />
                <h2 className="font-mono text-sm font-bold text-[#FDB813] uppercase tracking-wider">
                  Exploration Log
                </h2>
              </div>
              <button
                onClick={toggleBoard}
                className="text-gray-500 hover:text-white transition-colors font-mono text-xs"
              >
                [x]
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[#FDB813]/10">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex-1 py-2 text-xs font-mono uppercase tracking-wider transition-all"
                  style={{
                    color: activeTab === tab.id ? '#FDB813' : '#666',
                    borderBottom:
                      activeTab === tab.id ? '2px solid #FDB813' : '2px solid transparent',
                    backgroundColor: activeTab === tab.id ? '#FDB81308' : 'transparent',
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="p-4 overflow-y-auto max-h-[calc(80vh-6rem)] scrollbar-thin">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  {activeTab === 'overview' && <OverviewTab />}
                  {activeTab === 'achievements' && <AchievementsTab />}
                  {activeTab === 'stats' && <StatsTab />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Footer hint */}
            <div className="px-4 py-2 border-t border-[#FDB813]/10 text-center">
              <span className="text-[10px] font-mono text-gray-600">
                Press L to toggle
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
