# alishahidi.net

Interactive 3D solar system portfolio — each planet is a company I've worked at, moons are the technologies I used there, and asteroids are the projects I've built.

**Live:** [alishahidi.net](https://alishahidi.net)

## What is this?

A portfolio website disguised as a solar system. Instead of a flat list of jobs and skills, you explore an orbital visualization where everything is connected — companies orbit a central sun, skills orbit those companies as moons, and projects float in an asteroid belt between them.

Click any object to learn more. Open the terminal (`~` key) to navigate like a developer. Discover hidden comets and nebulae for the full story.

## Features

| Feature | Description |
|---|---|
| 3D Solar System | Planets (companies), moons (skills), asteroids (projects) |
| Interactive Camera | Click any object to fly to it, scroll to zoom |
| Terminal | Built-in CLI with commands like `ls`, `cd`, `cat`, `help` |
| Node Detail Panel | Markdown content for every node |
| Connection Lines | Visualize relationships between skills, projects, and companies |
| Achievement System | Unlock achievements by exploring |
| Nebulae | Philosophy nodes as distant glowing clouds |
| Comets | Hidden "secret" nodes that sweep through the system |
| Mini-map | Radar-style overview of the whole system |
| Welcome Screen | Animated intro with typewriter effect |
| SEO | Full metadata, JSON-LD, sitemap, robots.txt |
| Responsive | Works on desktop and mobile |

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16, React 19 |
| 3D Engine | Three.js via React Three Fiber + Drei |
| State | Zustand |
| Styling | Tailwind CSS 4 |
| Animation | Framer Motion |
| Language | TypeScript |
| Font | Geist Mono |

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout, metadata, JSON-LD
│   ├── page.tsx            # Main page (loads solar system)
│   ├── globals.css         # Global styles
│   ├── node/[id]/page.tsx  # Static pages per node (SEO)
│   ├── sitemap.ts          # Dynamic sitemap
│   └── robots.ts           # Robots config
├── components/
│   ├── canvas/             # 3D components (Scene, Sun, Planet, Moon, etc.)
│   ├── ui/                 # 2D overlays (HUD, Terminal, NodeDetail, etc.)
│   └── overlays/           # Welcome screen, legends
├── data/
│   ├── solarSystem.ts      # Orbital config (planets, moons, asteroids, comets)
│   ├── content/            # JSON content (experience, skills, projects, etc.)
│   └── nodes/              # Node loaders
├── stores/                 # Zustand stores
├── hooks/                  # Custom hooks (useSolarSystem, useCamera, etc.)
├── lib/                    # Utilities
└── types/                  # TypeScript types
```

## Getting Started

```bash
# Clone
git clone https://github.com/alishahidi/alishahidinet.git
cd alishahidinet

# Install
npm install

# Dev
npm run dev

# Build
npm run build
```

Open [http://localhost:3000](http://localhost:3000).

## Customization

To use this as your own portfolio:

1. **Companies/Jobs:** Edit `data/solarSystem.ts` — each planet is a company, with `roles[]` for positions held there and `moons[]` for skills used
2. **Content:** Edit JSON files in `data/content/` — experience, skills, projects, philosophy, secrets
3. **Connections:** Edit `data/content/connections.json` to define relationships between nodes
4. **Metadata:** Update `app/layout.tsx` with your name, description, and social links
5. **Theme:** Colors are defined in `data/solarSystem.ts` and `app/globals.css`

## License

MIT
