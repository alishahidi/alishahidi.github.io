// ============================================================================
// ORBITAL PORTFOLIO CONFIG
// ============================================================================
// Each planet = a company/organization you worked at
// Each planet can have multiple roles (positions you held there)
// Moons = skills/tech you used at that company
//
// TO ADD A NEW COMPANY:
//   1. Add a new entry to `planets` array below
//   2. Create a matching node in `data/nodes/experience.ts` with the same `id`
//   3. That's it — it'll appear in the visualization automatically
//
// TO REORDER:
//   Just change `orbitRadius` (distance from center) and `startAngle`
//   Closer to center = appears inner, further = outer
// ============================================================================

export interface RoleConfig {
  title: string;
  duration: string;       // e.g. "2022 - Present"
}

export interface PlanetConfig {
  id: string;              // must match an experience node id in graphStore
  name: string;            // company/org name shown as label
  description?: string;    // short subtitle shown under the name
  roles: RoleConfig[];     // positions held at this company
  orbitRadius: number;     // distance from center (bigger = further out)
  size: number;            // planet visual size (1-3 range works well)
  color: string;           // hex color
  orbitSpeed: number;      // how fast it orbits (lower = slower, 0.03-0.15)
  rotationSpeed: number;   // self-rotation speed
  tilt: number;            // orbit plane tilt in radians (0 = flat, 0.1-0.2 subtle)
  hasRing: boolean;        // show a Saturn-like ring
  ringColor?: string;      // ring color (with alpha, e.g. '#E67E2240')
  moons: MoonConfig[];     // skills/tech used at this company
  startAngle: number;      // where on the orbit it starts (0-6.28 = full circle)
}

export interface MoonConfig {
  nodeId: string;          // must match a skill node id (e.g. 'skill-python')
  label: string;           // display name
  orbitRadius: number;     // distance from parent planet
  size: number;            // moon visual size (0.2-0.5)
  color: string;           // hex color
  orbitSpeed: number;      // orbit speed around planet
  startAngle: number;      // initial position on orbit
}

export interface AsteroidConfig {
  nodeId: string;
  label: string;
  orbitRadius: number;
  size: number;
  color: string;
  angle: number;
  height: number;
}

export interface NebulaConfig {
  nodeId: string;
  label: string;
  position: [number, number, number];
  color: string;
  size: number;
  opacity: number;
}

export interface CometConfig {
  nodeId: string;
  label: string;
  color: string;
  speed: number;
  orbitRadius: number;
  tilt: number;
  eccentricity: number;
  startAngle: number;
}

// ============================================================================
// PLANETS — Your companies/organizations
// ============================================================================
// Edit these to match your real career history.
// The `id` must match a node in data/nodes/experience.ts
// ============================================================================

export const planets: PlanetConfig[] = [
  // --- Education (innermost orbit) ---
  {
    id: 'experience-education',
    name: 'University',
    description: 'Computer Engineering',
    roles: [
      { title: 'CE Student — Khayyam Univ.', duration: '2021 - 2024' },
      { title: 'CE Student — Azad Univ.', duration: '2025 - Present' },
    ],
    orbitRadius: 12,
    size: 1.1,
    color: '#D2691E',
    orbitSpeed: 0.04,
    rotationSpeed: 0.3,
    tilt: 0.1,
    hasRing: false,
    startAngle: 0,
    moons: [
      { nodeId: 'skill-linux', label: 'Linux', orbitRadius: 2.5, size: 0.3, color: '#FCC624', orbitSpeed: 0.25, startAngle: 0 },
      { nodeId: 'skill-git', label: 'Git', orbitRadius: 3.2, size: 0.25, color: '#F05032', orbitSpeed: 0.2, startAngle: 2.1 },
    ],
  },

  // --- Freelance PHP ---
  {
    id: 'experience-freelance',
    name: 'Freelance',
    description: 'PHP Developer',
    roles: [
      { title: 'PHP Developer (Freelancer)', duration: 'Feb 2019 - Jan 2022' },
    ],
    orbitRadius: 20,
    size: 1.5,
    color: '#5BA3EC',
    orbitSpeed: 0.025,
    rotationSpeed: 0.2,
    tilt: 0.05,
    hasRing: false,
    startAngle: 1.2,
    moons: [
      { nodeId: 'skill-php', label: 'PHP/Laravel', orbitRadius: 2.8, size: 0.35, color: '#8B93FF', orbitSpeed: 0.3, startAngle: 0.5 },
      { nodeId: 'skill-mysql', label: 'MySQL', orbitRadius: 3.5, size: 0.3, color: '#4DB8D0', orbitSpeed: 0.22, startAngle: 1.8 },
      { nodeId: 'skill-linux', label: 'Linux', orbitRadius: 4.2, size: 0.28, color: '#FCC624', orbitSpeed: 0.18, startAngle: 3.2 },
      { nodeId: 'skill-git', label: 'Git', orbitRadius: 4.8, size: 0.25, color: '#F05032', orbitSpeed: 0.15, startAngle: 5.0 },
    ],
  },

  // --- LaunchingMax ---
  {
    id: 'experience-launchingmax',
    name: 'LaunchingMax',
    description: 'Frontend Focus',
    roles: [
      { title: 'Software Developer', duration: 'Dec 2021 - Feb 2022' },
    ],
    orbitRadius: 27,
    size: 1.1,
    color: '#3DEB88',
    orbitSpeed: 0.02,
    rotationSpeed: 0.35,
    tilt: 0.12,
    hasRing: false,
    startAngle: 3.5,
    moons: [
      { nodeId: 'skill-javascript', label: 'JavaScript', orbitRadius: 2.2, size: 0.3, color: '#F7DF1E', orbitSpeed: 0.3, startAngle: 1.0 },
      { nodeId: 'skill-api-design', label: 'REST API', orbitRadius: 3.0, size: 0.25, color: '#00E5FF', orbitSpeed: 0.22, startAngle: 3.5 },
    ],
  },

  // --- Neshan Maps ---
  {
    id: 'experience-neshan',
    name: 'Neshan Maps',
    description: 'Backend Intern',
    roles: [
      { title: 'Backend Developer (Intern)', duration: 'Jul 2022 - Oct 2022' },
    ],
    orbitRadius: 34,
    size: 1.6,
    color: '#FF9933',
    orbitSpeed: 0.015,
    rotationSpeed: 0.18,
    tilt: 0.08,
    hasRing: false,
    startAngle: 5.0,
    moons: [
      { nodeId: 'skill-redis', label: 'Redis', orbitRadius: 2.8, size: 0.32, color: '#FF4438', orbitSpeed: 0.28, startAngle: 0 },
      { nodeId: 'skill-api-design', label: 'REST API', orbitRadius: 3.5, size: 0.3, color: '#00E5FF', orbitSpeed: 0.22, startAngle: 1.5 },
      { nodeId: 'skill-git', label: 'Git', orbitRadius: 4.2, size: 0.25, color: '#F05032', orbitSpeed: 0.18, startAngle: 3.0 },
      { nodeId: 'skill-docker', label: 'Docker', orbitRadius: 4.8, size: 0.28, color: '#2496ED', orbitSpeed: 0.15, startAngle: 4.5 },
    ],
  },

  // --- Navashgaran (outermost orbit — current) ---
  {
    id: 'experience-navashgaran',
    name: 'Navashgaran',
    description: 'Enterprise Java',
    roles: [
      { title: 'Java Software Developer', duration: 'Feb 2023 - Present' },
    ],
    orbitRadius: 48,
    size: 2.2,
    color: '#B370CF',
    orbitSpeed: 0.01,
    rotationSpeed: 0.15,
    tilt: 0.1,
    hasRing: true,
    ringColor: '#B370CF40',
    startAngle: 2.0,
    moons: [
      { nodeId: 'skill-java', label: 'Java', orbitRadius: 3.2, size: 0.4, color: '#FF6B35', orbitSpeed: 0.3, startAngle: 0 },
      { nodeId: 'skill-spring-boot', label: 'Spring Boot', orbitRadius: 4.0, size: 0.35, color: '#6DB33F', orbitSpeed: 0.25, startAngle: 1.0 },
      { nodeId: 'skill-hibernate', label: 'Hibernate', orbitRadius: 4.7, size: 0.3, color: '#BCAAA4', orbitSpeed: 0.2, startAngle: 2.2 },
      { nodeId: 'skill-mysql', label: 'MySQL', orbitRadius: 5.3, size: 0.3, color: '#4DB8D0', orbitSpeed: 0.16, startAngle: 3.5 },
      { nodeId: 'skill-rabbitmq', label: 'RabbitMQ', orbitRadius: 5.9, size: 0.28, color: '#FF6600', orbitSpeed: 0.13, startAngle: 4.8 },
      { nodeId: 'skill-docker', label: 'Docker', orbitRadius: 6.5, size: 0.28, color: '#2496ED', orbitSpeed: 0.11, startAngle: 5.8 },
    ],
  },
];

// ============================================================================
// ASTEROID BELT — Projects floating between the outer orbits
// ============================================================================

export const asteroidBeltConfig = {
  innerRadius: 37,
  outerRadius: 43,
  count: 120,
  ySpread: 1.5,
};

export const projectStations: AsteroidConfig[] = [
  { nodeId: 'project-apantos', label: 'Apantos Framework', orbitRadius: 38, size: 0.9, color: '#00ff41', angle: 0.5, height: 0.4 },
  { nodeId: 'project-enterprise-api', label: 'Enterprise APIs', orbitRadius: 40, size: 0.85, color: '#39FF14', angle: 1.5, height: -0.2 },
  { nodeId: 'project-data-migration', label: 'Data Migration', orbitRadius: 37.5, size: 0.8, color: '#76FF7A', angle: 2.5, height: 0.5 },
  { nodeId: 'project-neshan-backend', label: 'Neshan Backend', orbitRadius: 41, size: 0.8, color: '#00E676', angle: 3.5, height: -0.4 },
  { nodeId: 'project-freelance-web', label: 'Freelance Projects', orbitRadius: 39, size: 0.75, color: '#69F0AE', angle: 4.2, height: 0.15 },
  { nodeId: 'project-launchingmax-app', label: 'LaunchingMax App', orbitRadius: 42, size: 0.7, color: '#B2FF59', angle: 5.0, height: -0.3 },
  { nodeId: 'project-portfolio', label: 'This Website', orbitRadius: 40.5, size: 1.0, color: '#00FF87', angle: 5.8, height: 0 },
];

// ============================================================================
// NEBULAE — Philosophy nodes as distant background clouds
// ============================================================================

export const nebulae: NebulaConfig[] = [
  { nodeId: 'philosophy-backend', label: 'Why Backend?', position: [80, 40, -90], color: '#ff44ff', size: 8, opacity: 0.12 },
  { nodeId: 'philosophy-clean-code', label: 'Clean Code', position: [-90, -30, -85], color: '#ff66ff', size: 7, opacity: 0.11 },
  { nodeId: 'philosophy-distributed', label: 'Distributed Beauty', position: [100, -45, -75], color: '#dd44ff', size: 9, opacity: 0.11 },
  { nodeId: 'philosophy-ai-future', label: 'AI & The Future', position: [-70, 55, -95], color: '#ff44cc', size: 7, opacity: 0.12 },
  { nodeId: 'philosophy-life-lessons', label: 'Code & Life', position: [10, -65, -100], color: '#ff88ff', size: 8, opacity: 0.10 },
  { nodeId: 'philosophy-simplicity', label: 'Simplicity', position: [-100, 20, -70], color: '#ee44ff', size: 7, opacity: 0.11 },
];

// ============================================================================
// COMETS — Secret/hidden nodes that sweep through
// ============================================================================

export const comets: CometConfig[] = [
  { nodeId: 'secret-doubt', label: 'The Doubt', color: '#ff0055', speed: 0.03, orbitRadius: 65, tilt: 0.8, eccentricity: 0.6, startAngle: 0 },
  { nodeId: 'secret-failure', label: 'The Failures', color: '#ff0055', speed: 0.025, orbitRadius: 70, tilt: 1.2, eccentricity: 0.7, startAngle: 2.0 },
  { nodeId: 'secret-imposter', label: 'Imposter', color: '#ff0055', speed: 0.02, orbitRadius: 60, tilt: 0.5, eccentricity: 0.5, startAngle: 4.0 },
  { nodeId: 'secret-motivation', label: 'Motivation', color: '#ff0055', speed: 0.028, orbitRadius: 75, tilt: 1.0, eccentricity: 0.65, startAngle: 5.5 },
];

// ============================================================================
// SUN — Center of everything (your identity)
// ============================================================================

export const sunConfig = {
  size: 3.5,
  color: '#FDB813',
  coronaColor: '#FF8C00',
  lightIntensity: 2.5,
  pulseSpeed: 0.8,
  pulseAmplitude: 0.1,
};
