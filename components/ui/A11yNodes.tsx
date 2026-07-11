'use client';

import { useGraph } from '@/hooks/useGraph';

/**
 * The genuine text alternative + keyboard entry point for the WebGL scene.
 * The 3D bodies are canvas meshes (invisible to AT and the Tab order), so this
 * renders a visually-hidden but focusable list of every visible node: Tab to
 * one and Enter/Space focuses it in the scene. An aria-live region announces
 * the currently focused body. Together these close the "canvas is unusable by
 * keyboard / screen reader" gap without altering the visual experience.
 */
const TYPE_LABEL: Record<string, string> = {
  experience: 'Role',
  skill: 'Skill',
  project: 'Project',
  philosophy: 'Idea',
  secret: 'Secret',
  memory: 'Memory',
  core: 'Core',
};

export function A11yNodes() {
  const { nodes, focusedNode, handleNodeClick } = useGraph();

  return (
    <>
      <nav aria-label="Solar system bodies" className="sr-only">
        <p>
          Interactive 3D map of Ali Shahidi&apos;s career: companies are planets,
          skills are moons, projects are stations. Activate any item to focus it.
        </p>
        <ul>
          {nodes.map((n) => (
            <li key={n.id}>
              <button type="button" onClick={() => handleNodeClick(n.id)}>
                {TYPE_LABEL[n.type] ?? 'Body'}: {n.label}
                {n.description ? ` — ${n.description}` : ''}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div aria-live="polite" className="sr-only">
        {focusedNode ? `Focused: ${focusedNode.label}. ${focusedNode.description}` : ''}
      </div>
    </>
  );
}
