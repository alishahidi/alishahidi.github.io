export interface ParsedCommand {
  command: string;
  args: string[];
  flags: Record<string, string | boolean>;
}

export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim();
  if (!trimmed) {
    return { command: '', args: [], flags: {} };
  }

  const parts = trimmed.match(/(?:[^\s"]+|"[^"]*")+/g) || [];
  const command = parts[0]?.toLowerCase() || '';
  const args: string[] = [];
  const flags: Record<string, string | boolean> = {};

  for (let i = 1; i < parts.length; i++) {
    const part = parts[i];

    if (part.startsWith('--')) {
      const [key, value] = part.slice(2).split('=');
      flags[key] = value || true;
    } else if (part.startsWith('-')) {
      const key = part.slice(1);
      flags[key] = true;
    } else {
      // Remove quotes if present
      args.push(part.replace(/^"|"$/g, ''));
    }
  }

  return { command, args, flags };
}

export function tokenize(input: string): string[] {
  return input.trim().split(/\s+/).filter(Boolean);
}

export function autocomplete(
  input: string,
  commands: string[],
  nodes: string[]
): string[] {
  const parsed = parseCommand(input);
  const suggestions: string[] = [];

  if (parsed.args.length === 0 && !input.includes(' ')) {
    // Autocomplete command
    suggestions.push(
      ...commands.filter((cmd) =>
        cmd.toLowerCase().startsWith(parsed.command.toLowerCase())
      )
    );
  } else {
    // Autocomplete argument (likely a node name)
    const lastArg = parsed.args[parsed.args.length - 1] || '';
    suggestions.push(
      ...nodes.filter((node) =>
        node.toLowerCase().includes(lastArg.toLowerCase())
      )
    );
  }

  return suggestions.slice(0, 5);
}
