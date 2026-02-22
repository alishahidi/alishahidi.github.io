import { create } from 'zustand';
import { CameraState } from '@/types';

interface NavigationState {
  cameraState: CameraState;
  isTransitioning: boolean;
  history: string[];
  historyIndex: number;
  showMiniMap: boolean;
  showExplorationBoard: boolean;
  focusMode: 'overview' | 'planet' | 'detail';
  trackedBodyId: string | null;

  // Actions
  setCameraState: (state: Partial<CameraState>) => void;
  setTransitioning: (value: boolean) => void;
  pushHistory: (nodeId: string) => void;
  goBack: () => string | null;
  goForward: () => string | null;
  toggleMiniMap: () => void;
  toggleExplorationBoard: () => void;
  resetCamera: () => void;
  setFocusMode: (mode: 'overview' | 'planet' | 'detail') => void;
  setTrackedBody: (id: string | null) => void;
}

const initialCameraState: CameraState = {
  position: [0, 30, 80],
  target: [0, 0, 0],
  fov: 60,
};

export const useNavigationStore = create<NavigationState>((set, get) => ({
  cameraState: initialCameraState,
  isTransitioning: false,
  history: [],
  historyIndex: -1,
  showMiniMap: false,
  showExplorationBoard: false,
  focusMode: 'overview',
  trackedBodyId: null,

  setCameraState: (newState) =>
    set((state) => ({
      cameraState: { ...state.cameraState, ...newState },
    })),

  setTransitioning: (value) => set({ isTransitioning: value }),

  pushHistory: (nodeId) =>
    set((state) => {
      const newHistory = state.history.slice(0, state.historyIndex + 1);
      newHistory.push(nodeId);
      return {
        history: newHistory,
        historyIndex: newHistory.length - 1,
      };
    }),

  goBack: () => {
    const { history, historyIndex } = get();
    if (historyIndex > 0) {
      set({ historyIndex: historyIndex - 1 });
      return history[historyIndex - 1];
    }
    return null;
  },

  goForward: () => {
    const { history, historyIndex } = get();
    if (historyIndex < history.length - 1) {
      set({ historyIndex: historyIndex + 1 });
      return history[historyIndex + 1];
    }
    return null;
  },

  toggleMiniMap: () => set((state) => ({ showMiniMap: !state.showMiniMap })),

  toggleExplorationBoard: () =>
    set((state) => ({ showExplorationBoard: !state.showExplorationBoard })),

  resetCamera: () =>
    set({
      cameraState: initialCameraState,
      focusMode: 'overview',
      trackedBodyId: null,
    }),

  setFocusMode: (mode) => set({ focusMode: mode }),

  setTrackedBody: (id) => set({ trackedBodyId: id }),
}));
