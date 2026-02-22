import { create } from 'zustand';
import { TerminalHistoryEntry } from '@/types';

interface TerminalState {
  isOpen: boolean;
  history: TerminalHistoryEntry[];
  commandHistory: string[];
  commandIndex: number;
  inputValue: string;
  useCount: number;

  // Actions
  toggleTerminal: () => void;
  setOpen: (value: boolean) => void;
  addHistory: (entry: Omit<TerminalHistoryEntry, 'timestamp'>) => void;
  addCommandToHistory: (command: string) => void;
  getPreviousCommand: () => string;
  getNextCommand: () => string;
  setInputValue: (value: string) => void;
  clearHistory: () => void;
  incrementUseCount: () => void;
}

export const useTerminalStore = create<TerminalState>((set, get) => ({
  isOpen: false,
  history: [
    {
      type: 'system',
      content: 'Consciousness Terminal v1.0.0\nType "help" for available commands.\n',
      timestamp: Date.now(),
    },
  ],
  commandHistory: [],
  commandIndex: -1,
  inputValue: '',
  useCount: 0,

  toggleTerminal: () => set((state) => ({ isOpen: !state.isOpen })),

  setOpen: (value) => set({ isOpen: value }),

  addHistory: (entry) =>
    set((state) => ({
      history: [...state.history, { ...entry, timestamp: Date.now() }],
    })),

  addCommandToHistory: (command) =>
    set((state) => ({
      commandHistory: [...state.commandHistory, command],
      commandIndex: state.commandHistory.length + 1,
    })),

  getPreviousCommand: () => {
    const { commandHistory, commandIndex } = get();
    if (commandIndex > 0) {
      const newIndex = commandIndex - 1;
      set({ commandIndex: newIndex, inputValue: commandHistory[newIndex] });
      return commandHistory[newIndex];
    }
    return get().inputValue;
  },

  getNextCommand: () => {
    const { commandHistory, commandIndex } = get();
    if (commandIndex < commandHistory.length - 1) {
      const newIndex = commandIndex + 1;
      set({ commandIndex: newIndex, inputValue: commandHistory[newIndex] });
      return commandHistory[newIndex];
    }
    set({ commandIndex: commandHistory.length, inputValue: '' });
    return '';
  },

  setInputValue: (value) => set({ inputValue: value }),

  clearHistory: () =>
    set({
      history: [
        {
          type: 'system',
          content: 'Terminal cleared.\n',
          timestamp: Date.now(),
        },
      ],
    }),

  incrementUseCount: () =>
    set((state) => ({ useCount: state.useCount + 1 })),
}));
