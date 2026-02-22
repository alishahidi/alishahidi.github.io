'use client';

import { useEffect, useCallback } from 'react';
import { useTerminalStore } from '@/stores/terminalStore';
import { useGraphStore } from '@/stores/graphStore';
import { useNavigationStore } from '@/stores/navigationStore';

interface UseKeyboardOptions {
  enabled?: boolean;
}

export function useKeyboard(options: UseKeyboardOptions = {}) {
  const { enabled = true } = options;

  const { toggleTerminal, isOpen: terminalOpen } = useTerminalStore();
  const { setFocusedNode, focusedNodeId } = useGraphStore();
  const { goBack, goForward, toggleMiniMap, toggleExplorationBoard } = useNavigationStore();

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (!enabled) return;

      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        // Allow Escape to close terminal even when focused on input
        if (event.key === 'Escape' && terminalOpen) {
          toggleTerminal();
          event.preventDefault();
        }
        return;
      }

      switch (event.key) {
        case '`':
        case '~':
          // Toggle terminal
          toggleTerminal();
          event.preventDefault();
          break;

        case 'Escape':
          // Close focused node or terminal
          if (terminalOpen) {
            toggleTerminal();
          } else if (focusedNodeId) {
            setFocusedNode(null);
          }
          event.preventDefault();
          break;

        case 'ArrowLeft':
          // Go back in history
          if (event.metaKey || event.ctrlKey) {
            const prevNodeId = goBack();
            if (prevNodeId) {
              setFocusedNode(prevNodeId);
            }
            event.preventDefault();
          }
          break;

        case 'ArrowRight':
          // Go forward in history
          if (event.metaKey || event.ctrlKey) {
            const nextNodeId = goForward();
            if (nextNodeId) {
              setFocusedNode(nextNodeId);
            }
            event.preventDefault();
          }
          break;

        case 'm':
          // Toggle mini-map
          if (event.metaKey || event.ctrlKey) {
            toggleMiniMap();
            event.preventDefault();
          }
          break;

        case 'l':
          // Toggle exploration board
          toggleExplorationBoard();
          event.preventDefault();
          break;

        case '?':
          // Show help (open terminal with help command)
          if (!terminalOpen) {
            toggleTerminal();
          }
          break;
      }
    },
    [
      enabled,
      terminalOpen,
      focusedNodeId,
      toggleTerminal,
      setFocusedNode,
      goBack,
      goForward,
      toggleMiniMap,
      toggleExplorationBoard,
    ]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return {
    toggleTerminal,
    terminalOpen,
  };
}

// Konami code detector
export function useKonamiCode(callback: () => void) {
  const sequence = useCallback(() => {
    const code = [
      'ArrowUp',
      'ArrowUp',
      'ArrowDown',
      'ArrowDown',
      'ArrowLeft',
      'ArrowRight',
      'ArrowLeft',
      'ArrowRight',
      'KeyB',
      'KeyA',
    ];
    let index = 0;

    return (event: KeyboardEvent) => {
      if (event.code === code[index]) {
        index++;
        if (index === code.length) {
          callback();
          index = 0;
        }
      } else {
        index = 0;
      }
    };
  }, [callback]);

  useEffect(() => {
    const handler = sequence();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [sequence]);
}
