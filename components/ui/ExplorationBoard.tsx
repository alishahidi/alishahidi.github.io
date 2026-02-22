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
  const radius = 40;
  const stroke = 4;
  const size = 96;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <svg className="w-full h-full -rotate-90" viewBox={`0 0 ${size} ${size}`}>
        <circle cx={center} cy={center} r={radius} fill="none" stroke="#FDB81320" strokeWidth={stroke} />
        <circle
          cx={center} cy={center} r={radius} fill="none" stroke="#FDB813"
          strokeWidth={stroke} strokeDasharray={circumference} strokeDashoffset={offset}
          strokeLinecap="round" className="transition-all duration-700"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-mono font-bold text-[#FDB813]">{percent}%</span>
        <span className="text-[9px] font-mono text-gray-500 uppercase">Explored</span>
      </div>
    </div>
  );
}

function CategoryBar({ label, current, total, color }: { label: string; current: number; total: number; color: string }) {
  const percent = total > 0 ? Math.min((current / total) * 100, 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="text-[10px] sm:text-[11px] font-mono w-[70px] text-gray-400 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ backgroundColor: color }}
          initial={{ width: 0 }} animate={{ width: `${percent}%` }} transition={{ duration: 0.5, delay: 0.1 }}
        />
      </div>
      <span className="text-[10px] sm:text-[11px] font-mono w-7 text-right tabular-nums" style={{ color }}>{current}/{total}</span>
    </div>
  );
}

function OverviewTab() {
  const discoveredNodes = useDiscoveryStore((s) => s.discoveredNodes);
  const planetsVisited = useDiscoveryStore((s) => s.planetsVisited);
  const projectsVisited = useDiscoveryStore((s) => s.projectsVisited);
  const nebulaeVisited = useDiscoveryStore((s) => s.nebulaeVisited);
  const secretsFound = useDiscoveryStore((s) => s.secretsFound);

  const skillsDiscovered = useMemo(
    () => discoveredNodes.filter((id) => id.startsWith('skill-')).length,
    [discoveredNodes]
  );

  const totalDiscovered = planetsVisited.length + skillsDiscovered + projectsVisited.length + nebulaeVisited.length + secretsFound;
  const grandTotal = CATEGORY_TOTALS.planets + CATEGORY_TOTALS.skills + CATEGORY_TOTALS.projects + CATEGORY_TOTALS.philosophy + CATEGORY_TOTALS.secrets;
  const overallPercent = grandTotal > 0 ? Math.round((totalDiscovered / grandTotal) * 100) : 0;

  return (
    <div className="space-y-3">
      <ProgressRing percent={overallPercent} />
      <div className="space-y-1.5">
        <CategoryBar label="Planets" current={planetsVisited.length} total={CATEGORY_TOTALS.planets} color={CATEGORY_COLORS.planets} />
        <CategoryBar label="Skills" current={skillsDiscovered} total={CATEGORY_TOTALS.skills} color={CATEGORY_COLORS.skills} />
        <CategoryBar label="Projects" current={projectsVisited.length} total={CATEGORY_TOTALS.projects} color={CATEGORY_COLORS.projects} />
        <CategoryBar label="Philosophy" current={nebulaeVisited.length} total={CATEGORY_TOTALS.philosophy} color={CATEGORY_COLORS.philosophy} />
        <CategoryBar label="Secrets" current={secretsFound} total={CATEGORY_TOTALS.secrets} color={CATEGORY_COLORS.secrets} />
      </div>
    </div>
  );
}

function AchievementsTab() {
  const achievements = useAchievementStore((s) => s.achievements);
  const unlockedCount = useAchievementStore((s) => s.getUnlockedCount());

  return (
    <div className="space-y-2">
      <div className="text-center">
        <span className="text-[11px] font-mono text-[#FDB813]">{unlockedCount}/{achievements.length} UNLOCKED</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5">
        {achievements.map((a) => (
          <div
            key={a.id}
            className="px-2 py-1.5 rounded border"
            style={{
              borderColor: a.unlocked ? '#FDB81360' : '#282828',
              backgroundColor: a.unlocked ? '#FDB81308' : '#0c0c0c',
              boxShadow: a.unlocked ? '0 0 8px #FDB81315' : 'none',
            }}
          >
            <div className="flex items-center gap-1.5">
              <span className="text-sm leading-none shrink-0">{a.unlocked ? a.icon : '\uD83D\uDD12'}</span>
              <div className="min-w-0">
                <p className="text-[10px] font-mono font-bold truncate" style={{ color: a.unlocked ? '#FDB813' : '#444' }}>
                  {a.unlocked ? a.name : '???'}
                </p>
                <p className="text-[9px] font-mono text-gray-600 leading-tight truncate">
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
  const firstVisit = firstVisitDate ? new Date(firstVisitDate).toLocaleDateString() : 'Now';

  const sections = [
    { title: 'SESSION', items: [
      { l: 'Time', v: `${mins}m ${secs}s` }, { l: 'Visits', v: totalVisits }, { l: 'First', v: firstVisit },
    ]},
    { title: 'ACTIVITY', items: [
      { l: 'Discovered', v: discoveredNodes.length }, { l: 'Clicks', v: totalClicks },
      { l: 'Terminal', v: terminalCommandsUsed }, { l: 'Links', v: connectionsFollowed },
    ]},
    { title: 'FINDS', items: [
      { l: 'Secrets', v: secretsFound }, { l: 'Philosophy', v: philosophyRead },
      { l: 'Speed', v: `${getNodesPerMinute()}/min` }, { l: 'Sun', v: sunClicked ? 'Yes' : 'No' },
    ]},
  ];

  return (
    <div className="space-y-2">
      {sections.map((s) => (
        <div key={s.title}>
          <div className="text-[9px] font-mono text-gray-600 uppercase tracking-wider mb-0.5">{s.title}</div>
          <div className="grid grid-cols-2 gap-x-4 gap-y-0.5">
            {s.items.map((item) => (
              <div key={item.l} className="flex justify-between">
                <span className="text-[10px] font-mono text-gray-500">{item.l}</span>
                <span className="text-[10px] font-mono text-[#FDB813] tabular-nums">{String(item.v)}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
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
        <>
          {/* Backdrop — tap to close */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 z-[44]"
            onClick={toggleBoard}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-0 left-0 right-0
              sm:bottom-auto sm:top-4 sm:left-auto sm:right-4
              w-full sm:w-[380px]
              z-[45] pointer-events-auto"
          >
            <div className="bg-black/95 backdrop-blur-md border-t sm:border border-[#FDB813]/30 sm:rounded-lg rounded-t-2xl overflow-hidden shadow-2xl">
              {/* Drag handle on mobile */}
              <div className="sm:hidden flex justify-center pt-2">
                <div className="w-8 h-0.5 rounded-full bg-gray-600" />
              </div>

              {/* Header */}
              <div className="px-4 py-2 border-b border-[#FDB813]/20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FDB813] animate-pulse" />
                  <h2 className="font-mono text-[11px] sm:text-xs font-bold text-[#FDB813] uppercase tracking-wider">
                    Exploration Log
                  </h2>
                </div>
                <button onClick={toggleBoard} className="text-gray-600 hover:text-white transition-colors font-mono text-[10px] p-1">
                  [x]
                </button>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-[#FDB813]/10">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex-1 py-2 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider transition-all active:bg-[#FDB81310]"
                    style={{
                      color: activeTab === tab.id ? '#FDB813' : '#555',
                      borderBottom: activeTab === tab.id ? '2px solid #FDB813' : '2px solid transparent',
                      backgroundColor: activeTab === tab.id ? '#FDB81308' : 'transparent',
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content — compact height */}
              <div className="px-4 py-3 overflow-y-auto max-h-[55vh] sm:max-h-[65vh] scrollbar-thin overscroll-contain">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.1 }}
                  >
                    {activeTab === 'overview' && <OverviewTab />}
                    {activeTab === 'achievements' && <AchievementsTab />}
                    {activeTab === 'stats' && <StatsTab />}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Safe area for home indicator */}
              <div className="h-[env(safe-area-inset-bottom,0px)]" />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
