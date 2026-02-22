import { TerminalCommand, TerminalContext } from '@/types';
import { useDiscoveryStore } from '@/stores/discoveryStore';

export const commands: TerminalCommand[] = [
  // Navigation commands
  {
    name: 'focus',
    description: 'Navigate to a specific node',
    usage: 'focus <node-name>',
    hidden: false,
    execute: (args, ctx) => {
      if (args.length === 0) {
        return 'Usage: focus <node-name>\nExample: focus python';
      }
      const query = args.join(' ').toLowerCase();
      const nodes = ctx.getNodes();
      const node = nodes.find(
        (n) =>
          n.label.toLowerCase().includes(query) ||
          n.id.toLowerCase().includes(query)
      );
      if (node) {
        if (node.locked) {
          return `Node "${node.label}" is locked. Keep exploring to unlock it.`;
        }
        ctx.focusNode(node.id);
        return `Navigating to ${node.label}...`;
      }
      return `Node "${query}" not found. Try 'ls' to see available nodes.`;
    },
  },
  {
    name: 'explore',
    description: 'Navigate to a random unexplored node',
    usage: 'explore',
    hidden: false,
    execute: (args, ctx) => {
      const nodes = ctx.getNodes();
      const discovered = ctx.getDiscovered();
      const unexplored = nodes.filter(
        (n) => !n.locked && !discovered.includes(n.id)
      );
      if (unexplored.length === 0) {
        return 'All visible nodes have been discovered! Look for hidden ones...';
      }
      const random = unexplored[Math.floor(Math.random() * unexplored.length)];
      ctx.focusNode(random.id);
      return `Exploring ${random.label}...`;
    },
  },
  {
    name: 'home',
    description: 'Return to the center of the graph',
    usage: 'home',
    hidden: false,
    execute: (args, ctx) => {
      ctx.focusNode('project-consciousness-graph');
      return 'Returning home...';
    },
  },

  // Information commands
  {
    name: 'whoami',
    description: 'Learn about me',
    usage: 'whoami',
    hidden: false,
    execute: () => {
      return `
┌─────────────────────────────────────┐
│  Ali Shahidi                        │
│  Backend Developer                  │
│                                     │
│  Systems architect who believes     │
│  in simple solutions to complex     │
│  problems.                          │
│                                     │
│  Skills: Python, Go, TypeScript     │
│  Focus: Distributed Systems, APIs   │
│  Philosophy: Simplicity over clever │
└─────────────────────────────────────┘

Type 'ls skills' to see all skills.
Type 'focus <node>' to explore.
      `.trim();
    },
  },
  {
    name: 'ls',
    description: 'List nodes by category',
    usage: 'ls [category]',
    hidden: false,
    execute: (args, ctx) => {
      const nodes = ctx.getNodes();
      const category = args[0]?.toLowerCase();

      const categories: Record<string, string[]> = {
        skills: nodes.filter((n) => n.type === 'skill').map((n) => n.label),
        projects: nodes.filter((n) => n.type === 'project').map((n) => n.label),
        philosophy: nodes.filter((n) => n.type === 'philosophy').map((n) => n.label),
        experience: nodes.filter((n) => n.type === 'experience').map((n) => n.label),
      };

      if (!category) {
        return `Available categories:
  skills     - Technical skills and languages
  projects   - Things I've built
  philosophy - How I think
  experience - Where I've been

Usage: ls <category>`;
      }

      if (categories[category]) {
        return `${category.toUpperCase()}:\n${categories[category].map((n) => `  - ${n}`).join('\n')}`;
      }

      return `Unknown category: ${category}. Try: skills, projects, philosophy, experience`;
    },
  },
  {
    name: 'cat',
    description: 'Read node content',
    usage: 'cat <node-name>',
    hidden: false,
    execute: (args, ctx) => {
      if (args.length === 0) {
        return 'Usage: cat <node-name>';
      }
      const query = args.join(' ').toLowerCase();
      const nodes = ctx.getNodes();
      const node = nodes.find(
        (n) =>
          n.label.toLowerCase().includes(query) ||
          n.id.toLowerCase().includes(query)
      );
      if (!node) {
        return `Node "${query}" not found.`;
      }
      if (node.locked) {
        return `[ACCESS DENIED] Node is locked.`;
      }
      ctx.discoverNode(node.id);
      return `${node.label}\n${'─'.repeat(40)}\n${node.description}\n\nUse 'focus ${node.label}' to view full content.`;
    },
  },
  {
    name: 'search',
    description: 'Search for nodes',
    usage: 'search <query>',
    hidden: false,
    execute: (args, ctx) => {
      if (args.length === 0) {
        return 'Usage: search <query>';
      }
      const query = args.join(' ').toLowerCase();
      const nodes = ctx.getNodes();
      const matches = nodes.filter(
        (n) =>
          !n.locked &&
          (n.label.toLowerCase().includes(query) ||
            n.description.toLowerCase().includes(query) ||
            n.tags.some((t) => t.toLowerCase().includes(query)))
      );
      if (matches.length === 0) {
        return `No nodes found matching "${query}"`;
      }
      return `Found ${matches.length} node(s):\n${matches.map((n) => `  ${n.label} (${n.type})`).join('\n')}`;
    },
  },

  // Discovery commands
  {
    name: 'discovered',
    description: 'Show discovered nodes',
    usage: 'discovered',
    hidden: false,
    execute: (args, ctx) => {
      const discovered = ctx.getDiscovered();
      const nodes = ctx.getNodes();
      const discoveredNodes = nodes.filter((n) => discovered.includes(n.id));

      if (discoveredNodes.length === 0) {
        return 'No nodes discovered yet. Click on nodes or use "explore" to start.';
      }

      const byType = discoveredNodes.reduce((acc, n) => {
        acc[n.type] = acc[n.type] || [];
        acc[n.type].push(n.label);
        return acc;
      }, {} as Record<string, string[]>);

      let output = `Discovered: ${discoveredNodes.length}/${nodes.filter((n) => !n.locked).length}\n\n`;
      Object.entries(byType).forEach(([type, labels]) => {
        output += `${type.toUpperCase()}: ${labels.join(', ')}\n`;
      });

      return output.trim();
    },
  },
  {
    name: 'achievements',
    description: 'View your achievements',
    usage: 'achievements',
    hidden: false,
    execute: (args, ctx) => {
      const achievements = ctx.getAchievements();
      const unlocked = achievements.filter((a) => a.unlocked);
      const locked = achievements.filter((a) => !a.unlocked);

      let output = `ACHIEVEMENTS (${unlocked.length}/${achievements.length})\n${'─'.repeat(40)}\n\n`;

      if (unlocked.length > 0) {
        output += 'UNLOCKED:\n';
        unlocked.forEach((a) => {
          output += `  ${a.icon} ${a.name} - ${a.description}\n`;
        });
        output += '\n';
      }

      if (locked.length > 0) {
        output += 'LOCKED:\n';
        locked.forEach((a) => {
          output += `  🔒 ??? - Keep exploring...\n`;
        });
      }

      return output.trim();
    },
  },
  {
    name: 'progress',
    description: 'Show exploration progress',
    usage: 'progress',
    hidden: false,
    execute: (args, ctx) => {
      const discovered = ctx.getDiscovered();
      const nodes = ctx.getNodes();
      const total = nodes.filter((n) => !n.locked).length;
      const percent = Math.round((discovered.length / total) * 100);
      const bar = '█'.repeat(Math.floor(percent / 5)) + '░'.repeat(20 - Math.floor(percent / 5));

      return `
EXPLORATION PROGRESS
[${bar}] ${percent}%

Nodes discovered: ${discovered.length}/${total}
${percent === 100 ? '\n🎉 Complete! But are there hidden nodes?' : ''}
      `.trim();
    },
  },
  {
    name: 'stats',
    description: 'Show exploration statistics',
    usage: 'stats',
    hidden: false,
    execute: () => {
      const state = useDiscoveryStore.getState();
      const sessionDuration = state.getSessionDuration();
      const mins = Math.floor(sessionDuration / 60);
      const secs = sessionDuration % 60;
      const firstVisit = state.firstVisitDate
        ? new Date(state.firstVisitDate).toLocaleDateString()
        : 'This session';

      return `
EXPLORATION STATISTICS
${'─'.repeat(40)}

SESSION
  Time elapsed:     ${mins}m ${secs}s
  Total visits:     ${state.totalVisits}
  First visit:      ${firstVisit}

DISCOVERY
  Nodes discovered: ${state.discoveredNodes.length}
  Total clicks:     ${state.totalClicks}
  Terminal cmds:    ${state.terminalCommandsUsed}
  Connections:      ${state.connectionsFollowed}

CATEGORIES
  Planets visited:  ${state.planetsVisited.length}/5
  Projects visited: ${state.projectsVisited.length}/7
  Nebulae visited:  ${state.nebulaeVisited.length}/6
  Philosophy read:  ${state.philosophyRead}
  Secrets found:    ${state.secretsFound}
  Sun clicked:      ${state.sunClicked ? 'Yes' : 'No'}

SPEED
  Nodes/minute:     ${state.getNodesPerMinute()}
      `.trim();
    },
  },
  {
    name: 'secrets',
    description: 'Hints about hidden content',
    usage: 'secrets',
    hidden: false,
    execute: () => {
      return `
There are things hidden in this graph...

Hints:
  - Some nodes only appear after you've explored enough
  - The terminal has undocumented commands
  - Deep exploration reveals deeper truths
  - There is a core...

Keep searching.
      `.trim();
    },
  },

  // System commands
  {
    name: 'help',
    description: 'Show available commands',
    usage: 'help',
    hidden: false,
    execute: () => {
      return `
CONSCIOUSNESS TERMINAL v1.0.0
${'─'.repeat(40)}

NAVIGATION
  focus <node>    Navigate to a node
  explore         Go to random unexplored node
  home            Return to center

INFORMATION
  whoami          About me
  ls [category]   List nodes by category
  cat <node>      Read node summary
  search <query>  Find nodes

DISCOVERY
  discovered      Show found nodes
  achievements    View achievements
  progress        Exploration stats
  stats           Full statistics
  secrets         Hints for hidden content

SYSTEM
  help            This help message
  clear           Clear terminal
  theme <name>    Change theme (matrix/cyber/mono)
  matrix          Toggle matrix rain

Tip: There are hidden commands...
      `.trim();
    },
  },
  {
    name: 'clear',
    description: 'Clear terminal',
    usage: 'clear',
    hidden: false,
    execute: () => {
      return '__CLEAR__';
    },
  },
  {
    name: 'theme',
    description: 'Change color theme',
    usage: 'theme <name>',
    hidden: false,
    execute: (args, ctx) => {
      const themes = ['matrix', 'cyber', 'mono'];
      if (args.length === 0) {
        return `Available themes: ${themes.join(', ')}\nUsage: theme <name>`;
      }
      if (themes.includes(args[0].toLowerCase())) {
        ctx.setTheme(args[0].toLowerCase());
        return `Theme changed to ${args[0]}`;
      }
      return `Unknown theme. Available: ${themes.join(', ')}`;
    },
  },
  {
    name: 'matrix',
    description: 'Toggle matrix rain effect',
    usage: 'matrix',
    hidden: false,
    execute: (args, ctx) => {
      ctx.toggleMatrixRain();
      return 'Matrix rain toggled.';
    },
  },

  // Hidden commands
  {
    name: 'sudo',
    description: 'Gain root access',
    usage: 'sudo',
    hidden: true,
    execute: () => {
      return `
[sudo] password for visitor:
Access denied.

...just kidding. This is a portfolio, not a server.
But nice try. 😉

Achievement hint: Keep using the terminal.
      `.trim();
    },
  },
  {
    name: 'hack',
    description: 'Initialize hack sequence',
    usage: 'hack',
    hidden: true,
    execute: (args, ctx) => {
      ctx.triggerGlitch();
      return `
INITIALIZING HACK SEQUENCE...
▓▓▓▓▓▓▓▓▓░░░░░░░░░░░ 42%

ERROR: Firewall detected
ERROR: No vulnerabilities found
ERROR: This site was built with security in mind

Just kidding. There's nothing to hack here.
But you found a secret command! 🎉
      `.trim();
    },
  },
  {
    name: 'core',
    description: 'Find the core',
    usage: 'core',
    hidden: true,
    execute: (args, ctx) => {
      const discovered = ctx.getDiscovered();
      if (discovered.length < 20) {
        return `
The core is hidden...
You must explore more to find it.

Progress: ${discovered.length}/20 nodes discovered
        `.trim();
      }
      ctx.focusNode('core-self');
      return 'The core reveals itself...';
    },
  },
  {
    name: 'meaning',
    description: 'What is the meaning?',
    usage: 'meaning',
    hidden: true,
    execute: () => {
      return `
42?

No, that's too easy.

The meaning is what you make of it.
This graph, this exploration, this moment -
it means something different to everyone.

What does it mean to you?
      `.trim();
    },
  },
  {
    name: 'rm',
    description: 'Remove something',
    usage: 'rm',
    hidden: true,
    execute: (args) => {
      if (args.includes('-rf') && args.includes('/')) {
        return `Nice try. 🙃\n\nThis isn't a real filesystem.`;
      }
      return 'rm: what would you like to remove from a portfolio?';
    },
  },
  {
    name: 'exit',
    description: 'Exit terminal',
    usage: 'exit',
    hidden: true,
    execute: () => {
      return '__EXIT__';
    },
  },
];

export function executeCommand(
  input: string,
  context: TerminalContext
): string {
  const trimmed = input.trim().toLowerCase();
  if (!trimmed) return '';

  const parts = trimmed.split(/\s+/);
  const cmdName = parts[0];
  const args = parts.slice(1);

  const command = commands.find((c) => c.name === cmdName);
  if (!command) {
    return `Command not found: ${cmdName}\nType 'help' for available commands.`;
  }

  const result = command.execute(args, context);
  return typeof result === 'string' ? result : '';
}
