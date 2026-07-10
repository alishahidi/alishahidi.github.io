import Link from 'next/link';
import { HeroSun } from '@/components/home/HeroSun';
import { resume, resumePdfPaths } from '@/data/resume';

const EMAIL = 'alishahidi1376@gmail.com';
const GITHUB = 'https://github.com/alishahidi';

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function SectionHeading({
  index,
  eyebrow,
  title,
  id,
}: {
  index: string;
  eyebrow: string;
  title: string;
  id?: string;
}) {
  return (
    <div id={id} className="mb-12 scroll-mt-28 sm:mb-16">
      <div className="flex items-center gap-3">
        <span className="font-mono text-sm text-gold">{index}</span>
        <span className="h-px w-8 bg-gold/40" />
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <h2 className="font-display mt-4 text-4xl font-bold tracking-tight text-starlight sm:text-5xl">
        {title}
      </h2>
    </div>
  );
}

/* ---------------------------------------------------------- nav */

function Nav() {
  const links = [
    { href: '#about', label: 'about' },
    { href: '#experience', label: 'experience' },
    { href: '#work', label: 'work' },
    { href: '#stack', label: 'stack' },
    { href: '#contact', label: 'contact' },
  ];
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-void/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <span className="inline-block h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_12px_2px_rgba(253,184,19,0.6)]" />
          <span className="font-display text-[15px] font-semibold text-starlight">
            Ali Shahidi
          </span>
        </Link>
        <div className="flex items-center gap-6 sm:gap-8">
          <div className="hidden items-center gap-7 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="link-sweep font-mono text-[13px] text-stardust transition-colors hover:text-starlight"
              >
                {l.label}
              </a>
            ))}
          </div>
          <Link
            href="/resume"
            className="rounded-full border border-gold/50 px-4 py-1.5 font-mono text-[13px] text-gold-bright transition-colors hover:bg-gold hover:text-void"
          >
            résumé
          </Link>
        </div>
      </nav>
    </header>
  );
}

/* ---------------------------------------------------------- hero */

function Hero() {
  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden">
      <div className="relative mx-auto w-full max-w-6xl px-5 py-28 text-center sm:px-8">
        {/* the Star — centerpiece above the name */}
        <div
          className="reveal mx-auto -mb-6 w-[min(78vw,420px)] sm:-mb-10"
          style={{ ['--reveal-delay' as string]: '0s' }}
        >
          <HeroSun />
        </div>

        <div
          className="reveal"
          style={{ ['--reveal-delay' as string]: '0.06s' }}
        >
          <Eyebrow>backend engineer · tehran, ir</Eyebrow>
        </div>

        <h1
          className="text-hero reveal mx-auto mt-5 text-starlight"
          style={{ ['--reveal-delay' as string]: '0.12s' }}
        >
          Ali Shahidi
        </h1>

        <p
          className="reveal mx-auto mt-7 max-w-2xl text-xl leading-relaxed text-stardust sm:text-2xl"
          style={{ ['--reveal-delay' as string]: '0.16s' }}
        >
          I build backend systems in{' '}
          <span className="font-semibold text-starlight">Java &amp; Spring Boot</span>{' '}
          — scalable, reliable services that teams can lean on in production.
        </p>

        {/* primary portal: enter the universe */}
        <div
          className="reveal mt-11 flex flex-col items-center gap-5"
          style={{ ['--reveal-delay' as string]: '0.24s' }}
        >
          <Link
            href="/explore"
            className="cta-glow group inline-flex items-center gap-3 rounded-full bg-gold px-9 py-4 font-display text-lg font-semibold text-void transition-transform hover:scale-[1.03]"
          >
            <span
              className="inline-block h-3 w-3 rounded-full bg-void/80"
              aria-hidden="true"
            />
            Enter the Universe
            <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
              →
            </span>
          </Link>
          <p className="font-mono text-[13px] tracking-wide text-deep-grey">
            launch the interactive solar system
          </p>

          <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/resume"
              className="rounded-full border border-white/12 px-6 py-2.5 font-mono text-sm text-starlight transition-colors hover:border-plasma hover:text-plasma"
            >
              résumé
            </Link>
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-white/12 px-6 py-2.5 font-mono text-sm text-starlight transition-colors hover:border-plasma hover:text-plasma"
            >
              GitHub ↗
            </a>
          </div>
        </div>

        <p
          className="reveal mx-auto mt-12 flex items-center justify-center gap-3 font-mono text-[13px] text-stardust"
          style={{ ['--reveal-delay' as string]: '0.32s' }}
        >
          <span className="status-dot" aria-hidden="true" />
          Java Software Developer @ Navashgaran Asr Parseh
        </p>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute inset-x-0 bottom-7 flex justify-center">
        <span className="font-mono text-[11px] tracking-[0.3em] text-deep-grey">scroll ↓</span>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- about */

function About() {
  return (
    <section className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              id="about"
              index="01"
              eyebrow="transmission"
              title="From the center of the system"
            />
          </div>
          <div className="max-w-2xl space-y-6 text-lg leading-relaxed text-stardust sm:text-xl">
            <p>
              I&apos;m a backend engineer specializing in{' '}
              <span className="text-starlight">Java and Spring Boot</span>. My work
              is server-side systems, software architecture, and scalable, reliable
              services — with particular attention to data structures and how the
              parts of a system talk to each other.
            </p>
            <p>
              I think beyond the code itself. Stability, extensibility, and
              precision of design come first. The goal is always the same: systems
              that don&apos;t merely work, but that teams can{' '}
              <span className="text-starlight">depend on with confidence</span>.
            </p>
            <div className="flex items-center gap-3 pt-2 font-mono text-sm text-deep-grey">
              <span className="status-dot" aria-hidden="true" />
              currently building enterprise Java at Navashgaran Asr Parseh
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- experience */

const TIMELINE = [
  {
    marker: 'now',
    role: 'Java Software Developer',
    company: 'Navashgaran Asr Parseh',
    period: 'Feb 2024 — present',
    desc: 'Enterprise-scale services in Java & Spring Boot: high-traffic REST APIs, layered service-oriented architecture, and driving data migration from legacy systems. Code review, technical decisions, and mentoring — tech lead on parts of the project.',
    tags: ['Java', 'Spring Boot', 'Oracle', 'Data Migration'],
    accent: 'gold',
  },
  {
    marker: '',
    role: 'Backend Developer · Intern',
    company: 'Neshan Maps',
    period: 'Aug — Sep 2023',
    desc: 'Backend services for live product features at one of Iran’s leading map platforms. Hands-on microservices, Redis caching, and Neshan’s specialized backend bootcamp.',
    tags: ['Microservices', 'Redis', 'REST API'],
    accent: 'plasma',
  },
  {
    marker: '',
    role: 'Software Developer · Frontend Focus',
    company: 'LaunchingMax',
    period: 'Feb — Jul 2023',
    desc: 'Organizational web apps with React.js — building UI and integrating it with backend APIs. The role that taught me what API consumers actually need.',
    tags: ['React.js', 'JavaScript', 'UI/UX'],
    accent: 'aurora',
  },
  {
    marker: '',
    role: 'PHP Developer',
    company: 'Freelance',
    period: 'Jul 2019 — Feb 2023',
    desc: 'Web applications and backend systems in PHP & Laravel, owned end to end from requirements to delivery. Built Apantos — a custom PHP framework focused on security and modularity.',
    tags: ['PHP', 'Laravel', 'MySQL', 'Apantos'],
    accent: 'nebula',
  },
];

const ACCENT_HEX: Record<string, string> = {
  gold: '#FDB813',
  plasma: '#48DFE3',
  aurora: '#57D9A3',
  nebula: '#9D7BFF',
};

function Experience() {
  return (
    <section className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading
          id="experience"
          index="02"
          eyebrow="orbital timeline"
          title="Where I've orbited"
        />
        <div className="max-w-3xl">
          {TIMELINE.map((c) => (
            <article key={c.company} className="orbit-rail relative pb-14 ps-9">
              <span
                className="node-marker absolute start-0 top-1.5 grid h-[15px] w-[15px] place-items-center rounded-full"
                style={{
                  border: `2px solid ${ACCENT_HEX[c.accent]}`,
                  boxShadow: `0 0 12px 1px ${ACCENT_HEX[c.accent]}66`,
                  background: '#060814',
                }}
                aria-hidden="true"
              >
                <span
                  className="h-1 w-1 rounded-full"
                  style={{ background: ACCENT_HEX[c.accent] }}
                />
              </span>
              <div className="flex flex-wrap items-baseline gap-x-3">
                {c.marker && (
                  <span className="rounded-full bg-gold/15 px-2 py-0.5 font-mono text-[11px] text-gold-bright">
                    {c.marker}
                  </span>
                )}
                <span className="ms-auto font-mono text-[12px] text-deep-grey">
                  {c.period}
                </span>
              </div>
              <h3 className="font-display mt-2 text-2xl font-semibold text-starlight">
                {c.role}
              </h3>
              <p className="mt-1 font-mono text-sm text-plasma">{c.company}</p>
              <p className="mt-3.5 max-w-2xl text-[17px] leading-relaxed text-stardust">
                {c.desc}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.tags.map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-white/10 px-2.5 py-0.5 font-mono text-[11px] text-stardust"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- work */

const PROJECTS = resume.en.projects.map((p) => ({
  name: p.title,
  desc: p.description,
  stack: p.stack.join(' · '),
}));

function Work() {
  return (
    <section className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading id="work" index="03" eyebrow="asteroid field" title="Selected work" />
        <p className="-mt-8 mb-12 max-w-2xl font-mono text-[13px] leading-relaxed text-deep-grey">
          Most of these are private / under NDA — described at a high level, without
          client or product names.
        </p>

        {/* featured: the explorer */}
        <Link
          href="/explore"
          className="group relative mb-6 block overflow-hidden rounded-2xl border border-gold/25 bg-orbit/60 p-8 transition-colors hover:border-gold/60 sm:p-10"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-60 blur-2xl transition-opacity group-hover:opacity-90"
            style={{ background: 'radial-gradient(circle, rgba(253,184,19,0.35), transparent 70%)' }}
          />
          <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow">the centerpiece</p>
              <h3 className="font-display mt-3 text-3xl font-bold text-starlight">
                The Solar System
              </h3>
              <p className="mt-3 text-[17px] leading-relaxed text-stardust">
                My whole career as an explorable universe — companies are planets,
                skills are their moons, projects drift in the asteroid belt. A
                terminal, achievements, and hidden depths for the curious.
              </p>
              <p className="mt-4 font-mono text-[13px] text-deep-grey">
                Three.js · Next.js · TypeScript
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-gold px-6 py-3 font-display font-semibold text-void transition-transform group-hover:scale-105">
              Enter <span aria-hidden="true">→</span>
            </span>
          </div>
        </Link>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PROJECTS.map((p) => (
            <div
              key={p.name}
              className="group flex flex-col rounded-xl border border-white/10 bg-orbit/40 p-6 transition-colors hover:border-plasma/50"
            >
              <h3 className="font-display text-lg font-semibold leading-snug text-starlight transition-colors group-hover:text-plasma">
                {p.name}
              </h3>
              <p className="mt-3 flex-1 text-[15px] leading-relaxed text-stardust">{p.desc}</p>
              <p className="mt-5 font-mono text-[12px] leading-relaxed text-deep-grey">{p.stack}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- stack */

const STACK: Array<[string, string[]]> = [
  ['languages & frameworks', ['Java', 'Spring Boot', 'Spring Cloud', 'Hibernate / JPA', 'PHP · Laravel', 'TypeScript · React']],
  ['data & messaging', ['PostgreSQL · PostGIS', 'Oracle · PL/SQL', 'Redis', 'Kafka · RabbitMQ', 'Elasticsearch · ClickHouse']],
  ['architecture', ['Microservices', 'Event-driven', 'API gateway', 'Domain-driven design', 'gRPC · REST']],
  ['infrastructure', ['Linux', 'Docker · Kubernetes', 'Proxmox · ESXi', 'MikroTik', 'CI/CD · Git']],
];

function Stack() {
  return (
    <section className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading id="stack" index="04" eyebrow="tool constellation" title="Tools I trust" />
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map(([group, items]) => (
            <div key={group}>
              <h3 className="font-mono text-[13px] text-gold-bright">~/{group}</h3>
              <ul className="mt-5 space-y-3 border-s border-white/10 ps-4">
                {items.map((item) => (
                  <li key={item} className="text-[16px] text-starlight/90">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- resume band */

function ResumeBand() {
  return (
    <section className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex flex-col items-start gap-8 rounded-2xl border border-white/10 bg-orbit/50 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
          <div className="max-w-xl">
            <p className="eyebrow">mission dossier</p>
            <h2 className="font-display mt-3 text-3xl font-bold text-starlight">
              The full résumé
            </h2>
            <p className="mt-3 leading-relaxed text-stardust">
              Available in English and Persian — read it in the browser or take the
              PDF.
            </p>
          </div>
          <div className="flex flex-wrap gap-3.5">
            <Link
              href="/resume"
              className="rounded-full bg-gold px-6 py-3 font-display font-semibold text-void transition hover:brightness-110"
            >
              Open résumé
            </Link>
            <a
              href={resumePdfPaths.en}
              download
              className="rounded-full border border-white/12 px-5 py-3 font-mono text-sm text-starlight transition-colors hover:border-gold hover:text-gold-bright"
            >
              PDF · EN
            </a>
            <a
              href={resumePdfPaths.fa}
              download
              className="rounded-full border border-white/12 px-5 py-3 font-mono text-sm text-starlight transition-colors hover:border-gold hover:text-gold-bright"
            >
              PDF · فارسی
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- contact + footer */

function Contact() {
  return (
    <section className="border-t border-white/5">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <SectionHeading id="contact" index="05" eyebrow="open a channel" title="Let's build something reliable" />
        <a
          href={`mailto:${EMAIL}`}
          className="font-display inline-block break-all text-3xl font-bold tracking-tight text-starlight transition-colors hover:text-gold-bright sm:text-5xl"
        >
          {EMAIL}
        </a>
        <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
          <a href={GITHUB} target="_blank" rel="noopener noreferrer" className="link-sweep text-stardust transition-colors hover:text-starlight">
            github.com/alishahidi ↗
          </a>
          <a href="tel:+989354162611" className="link-sweep text-stardust transition-colors hover:text-starlight">
            +98 935 416 2611
          </a>
          <span className="text-deep-grey">tehran, iran</span>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/5">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-9 sm:flex-row sm:items-center sm:px-8">
        <p className="font-mono text-[12px] text-deep-grey">
          © {new Date().getFullYear()} Ali Shahidi — built with Next.js, hosted on
          GitHub Pages
        </p>
        <Link
          href="/explore"
          className="group inline-flex items-center gap-2 font-mono text-[13px] text-gold-bright transition-colors hover:text-gold"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-gold shadow-[0_0_10px_2px_rgba(253,184,19,0.6)]" />
          re-enter the universe
          <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">→</span>
        </Link>
      </div>
    </footer>
  );
}

/* ---------------------------------------------------------- page */

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Experience />
        <Work />
        <Stack />
        <ResumeBand />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
