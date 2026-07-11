'use client';

import { useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTerminalStore } from '@/stores/terminalStore';
import { useGraphStore } from '@/stores/graphStore';
import { useDiscoveryStore } from '@/stores/discoveryStore';
import { useAchievementStore } from '@/stores/achievementStore';
import { executeCommand } from '@/lib/terminal/commands';
import { TerminalContext } from '@/types';

interface TerminalProps {
  onGlitch?: () => void;
  onThemeChange?: (theme: string) => void;
  onMatrixToggle?: () => void;
}

export function Terminal({ onGlitch, onThemeChange, onMatrixToggle }: TerminalProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const {
    isOpen,
    history,
    inputValue,
    setInputValue,
    addHistory,
    addCommandToHistory,
    getPreviousCommand,
    getNextCommand,
    clearHistory,
    incrementUseCount,
  } = useTerminalStore();

  const { nodes, setFocusedNode } = useGraphStore();
  const { incrementTerminalCommands, discoveredNodes } = useDiscoveryStore();
  const { achievements, checkAndUnlock, unlockAchievement } = useAchievementStore();

  // Create terminal context
  const context: TerminalContext = {
    focusNode: (id: string) => setFocusedNode(id),
    getNodes: () => nodes,
    getDiscovered: () => discoveredNodes,
    getAchievements: () => achievements,
    discoverNode: (id: string) => useGraphStore.getState().discoverNode(id),
    unlockAchievement: (id: string) => unlockAchievement(id),
    setTheme: (theme: string) => onThemeChange?.(theme),
    toggleMatrixRain: () => onMatrixToggle?.(),
    triggerGlitch: () => onGlitch?.(),
  };

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // Focus input when terminal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const input = inputValue.trim();
      if (!input) return;

      // Add input to history
      addHistory({ type: 'input', content: `> ${input}` });
      addCommandToHistory(input);

      // Execute command
      const result = executeCommand(input, context);

      // Handle special outputs
      if (result === '__CLEAR__') {
        clearHistory();
      } else if (result === '__EXIT__') {
        useTerminalStore.getState().setOpen(false);
      } else if (result) {
        addHistory({ type: 'output', content: result });
      }

      // Track usage
      incrementUseCount();
      incrementTerminalCommands();

      // Check for terminal-related achievements
      const terminalCount = useDiscoveryStore.getState().terminalCommandsUsed + 1;
      checkAndUnlock('terminal', terminalCount);

      // Clear input
      setInputValue('');
    },
    [
      inputValue,
      addHistory,
      addCommandToHistory,
      clearHistory,
      incrementUseCount,
      incrementTerminalCommands,
      checkAndUnlock,
      setInputValue,
      context,
    ]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        getPreviousCommand();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        getNextCommand();
      }
    },
    [getPreviousCommand, getNextCommand]
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-0 left-0 right-0 sm:bottom-4 sm:left-4 sm:right-4 md:left-auto md:right-4 md:w-[600px] z-50"
        >
          <div
            className="bg-[#0E1428]/95 border-t sm:border border-[#FDB813]/30 rounded-t-xl sm:rounded-lg overflow-hidden backdrop-blur-sm"
            style={{
              boxShadow: '0 0 20px rgba(253, 184, 19, 0.2)',
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-[#FDB813]/25 bg-[#FDB813]/10">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                </div>
                <span className="text-[#FDB813] font-mono text-sm ml-2">
                  consciousness://terminal
                </span>
              </div>
              <button
                onClick={() => useTerminalStore.getState().setOpen(false)}
                aria-label="Close terminal"
                className="text-[#FDB813]/60 hover:text-[#FDB813] transition-colors"
              >
                [ESC]
              </button>
            </div>

            {/* Output */}
            <div
              ref={scrollRef}
              role="log"
              aria-live="polite"
              aria-relevant="additions"
              aria-label="Terminal output"
              className="h-48 sm:h-64 overflow-y-auto scroll-smooth p-3 sm:p-4 font-mono text-xs sm:text-sm overscroll-contain"
            >
              {history.map((entry, i) => (
                <div
                  key={i}
                  className={`mb-1 whitespace-pre-wrap ${
                    entry.type === 'input'
                      ? 'text-[#48DFE3]'
                      : entry.type === 'error'
                      ? 'text-[#FF6B6B]'
                      : entry.type === 'system'
                      ? 'text-[#FDB813]'
                      : 'text-[#48DFE3]'
                  }`}
                >
                  {entry.content}
                </div>
              ))}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-[#FDB813]/25">
              <div className="flex items-center px-3 sm:px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                <span className="text-[#FDB813] mr-2">{'>'}</span>
                <input
                  ref={inputRef}
                  type="text"
                  aria-label="Terminal command input"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1 bg-transparent text-[#48DFE3] font-mono text-sm rounded-sm outline-none placeholder-[#48DFE3]/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#FDB813] focus-visible:outline-offset-2"
                  placeholder="Type 'help' for commands..."
                  style={{ caretColor: '#FDB813' }}
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
            </form>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
