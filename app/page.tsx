import Link from 'next/link';
import { HeroSun } from '@/components/home/HeroSun';
import { Nav } from '@/components/home/Nav';
import { CopyEmail } from '@/components/home/CopyEmail';
import { Reveal } from '@/components/shared/Reveal';
import { resume, resumePdfPaths } from '@/data/resume';

const EMAIL = 'alishahidi1376@gmail.com';
const GITHUB = 'https://github.com/alishahidi';
const LINKEDIN = resume.en.contact.linkedinUrl;

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="eyebrow">{children}</p>;
}

function SectionHeading({
  index,
  eyebrow,
  title,
  id,
  note,
}: {
  index: string;
  eyebrow: string;
  title: string;
  id?: string;
  note?: string;
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
      {note && (
        <p className="mt-4 max-w-2xl font-mono text-[13px] leading-relaxed text-deep-grey">
          {note}
        </p>
      )}
    </div>
  );
}

/* A section with a fading "horizon" seam instead of a flat border, plus a
   faint ambient glow keyed to the section's accent. */
function Section({
  children,
  glow,
  glowPos = 'left',
}: {
  children: React.ReactNode;
  glow?: string;
  glowPos?: 'left' | 'right';
}) {
  return (
    <section className="relative">
      <hr className="section-seam" />
      {glow && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 -z-0 overflow-hidden"
        >
          <div
            className={`absolute top-1/4 h-[34rem] w-[34rem] rounded-full opacity-[0.06] blur-[130px] ${
              glowPos === 'left' ? '-left-[12%]' : '-right-[12%]'
            }`}
            style={{ background: `radial-gradient(circle, ${glow}, transparent 70%)` }}
          />
        </div>
      )}
      <div className="relative">{children}</div>
    </section>
  );
}

/* ---------------------------------------------------------- hero */

const STATS: Array<[string, string]> = [
  ['~5 yrs', 'shipping backend systems'],
  ['20+', 'module Spring framework'],
  ['8', 'production platforms'],
  ['Tech lead', 'on parts of the project'],
];

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

        <div className="reveal" style={{ ['--reveal-delay' as string]: '0.06s' }}>
          <Eyebrow>backend engineer · ~5 yrs · tehran, ir</Eyebrow>
        </div>

        <h1
          className="text-hero reveal mx-auto mt-5 text-starlight"
          style={{ ['--reveal-delay' as string]: '0.12s' }}
        >
          Ali Shahidi
        </h1>

        <p
          className="reveal mx-auto mt-7 max-w-2xl text-[19px] leading-[1.55] text-stardust sm:text-[21px]"
          style={{ ['--reveal-delay' as string]: '0.16s' }}
        >
          I build backend systems in{' '}
          <span className="font-semibold text-starlight">Java &amp; Spring Boot</span>{' '}
          — scalable, reliable services that teams can lean on in production.
        </p>

        {/* CTAs — the résumé is an equal-weight path for a recruiter in a hurry */}
        <div
          className="reveal mt-10 flex flex-col items-center gap-4"
          style={{ ['--reveal-delay' as string]: '0.24s' }}
        >
          <div className="flex flex-col items-center gap-3.5 sm:flex-row">
            <Link
              href="/resume"
              className="cta-glow group inline-flex items-center gap-2.5 rounded-full bg-gold px-8 py-3.5 font-display text-lg font-semibold text-void transition-transform hover:scale-[1.03]"
            >
              View résumé
              <span className="font-mono text-sm font-normal text-void/70">the 20-second version</span>
            </Link>
            <Link
              href="/explore"
              className="link-sweep group inline-flex items-center gap-2.5 rounded-full border border-plasma/40 px-8 py-3.5 font-display text-lg font-semibold text-starlight transition-colors hover:border-plasma hover:text-plasma"
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full bg-plasma shadow-[0_0_10px_2px_rgba(72,223,227,0.5)]"
                aria-hidden="true"
              />
              Explore the universe
              <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
                →
              </span>
            </Link>
          </div>
          <div className="mt-1 flex flex-wrap items-center justify-center gap-4">
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="link-sweep font-mono text-sm text-stardust transition-colors hover:text-starlight"
            >
              GitHub ↗
            </a>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="link-sweep font-mono text-sm text-stardust transition-colors hover:text-starlight"
            >
              LinkedIn ↗
            </a>
          </div>
        </div>

        {/* stats strip — quantified proof, data-sheet look */}
        <div
          className="reveal mx-auto mt-12 grid max-w-3xl grid-cols-2 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] sm:grid-cols-4"
          style={{ ['--reveal-delay' as string]: '0.3s' }}
        >
          {STATS.map(([n, label], i) => (
            <div
              key={label}
              className={`px-4 py-5 ${i % 2 === 0 ? 'border-r border-white/10' : ''} ${
                i < 2 ? 'border-b border-white/10' : ''
              } sm:border-b-0 ${i !== 3 ? 'sm:border-r sm:border-white/10' : ''}`}
            >
              <div className="font-display text-2xl font-bold text-gold-bright sm:text-3xl">{n}</div>
              <div className="mt-1 font-mono text-[11px] leading-tight tracking-wide text-deep-grey">
                {label}
              </div>
            </div>
          ))}
        </div>

        <p
          className="reveal mx-auto mt-9 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 font-mono text-[13px] text-stardust"
          style={{ ['--reveal-delay' as string]: '0.36s' }}
        >
          <span className="status-dot" aria-hidden="true" />
          <span className="text-aurora">Open to backend / Java roles</span>
          <span className="text-deep-grey">— remote or Tehran</span>
        </p>
      </div>

      {/* scroll cue */}
      <div className="pointer-events-none absolute inset-x-0 bottom-7 flex justify-center">
        <span className="scroll-cue font-mono text-[11px] tracking-[0.3em] text-deep-grey">
          scroll ↓
        </span>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- about */

function About() {
  return (
    <Section glow="#48dfe3" glowPos="left">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <SectionHeading
            id="about"
            index="01"
            eyebrow="transmission"
            title="From the center of the system"
          />
        </Reveal>
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
          <div />
          <Reveal delay={0.05}>
            <div className="max-w-2xl space-y-6 text-[17px] leading-[1.7] text-stardust sm:text-[18px]">
              <p>
                I&apos;m a backend engineer working across the full server-side
                stack — from{' '}
                <span className="text-starlight">event-driven microservices</span>{' '}
                and API gateways to relational and geospatial data, messaging and
                streaming, and the on-prem infrastructure that runs it all.
              </p>
              <p>
                My work spans real-time fleet &amp; GPS telemetry, e-commerce and
                e-learning platforms, and a{' '}
                <span className="text-starlight">20+ module Spring framework</span>{' '}
                that scaffolds production-ready services for whole teams. I own
                systems end to end and act as tech lead on parts of the project —
                driving code review, technical decisions, and legacy data
                migrations.
              </p>
              <div className="flex items-center gap-3 pt-2 font-mono text-sm text-deep-grey">
                <span className="status-dot" aria-hidden="true" />
                currently building enterprise Java at Navashgaran Asr Parseh
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
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
    <Section glow="#fdb813" glowPos="right">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <SectionHeading
            id="experience"
            index="02"
            eyebrow="orbital timeline"
            title="Where I've orbited"
          />
        </Reveal>
        <div className="max-w-3xl">
          {TIMELINE.map((c, i) => {
            const hex = ACCENT_HEX[c.accent];
            return (
              <Reveal as="article" key={c.company} delay={i * 0.06}>
                <div className="orbit-rail relative pb-14 ps-9">
                  <span
                    className="node-marker absolute start-0 top-1.5 grid h-[15px] w-[15px] place-items-center rounded-full"
                    style={{
                      border: `2px solid ${hex}`,
                      boxShadow: `0 0 12px 1px ${hex}66`,
                      background: '#060814',
                    }}
                    aria-hidden="true"
                  >
                    <span className="h-1 w-1 rounded-full" style={{ background: hex }} />
                  </span>
                  <div className="flex flex-wrap items-baseline gap-x-3">
                    {c.marker && (
                      <span
                        className="rounded-full px-2 py-0.5 font-mono text-[11px]"
                        style={{ background: `${hex}22`, color: hex }}
                      >
                        {c.marker}
                      </span>
                    )}
                    <span className="ms-auto text-[12px] tracking-wide text-deep-grey">
                      {c.period}
                    </span>
                  </div>
                  <h3 className="font-display mt-2 text-2xl font-semibold text-starlight">
                    {c.role}
                  </h3>
                  <p className="mt-1 text-sm font-medium" style={{ color: hex }}>
                    {c.company}
                  </p>
                  <p className="mt-3.5 max-w-2xl text-[17px] leading-relaxed text-stardust">
                    {c.desc}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {c.tags.map((t) => (
                      <span
                        key={t}
                        className="rounded-full px-2.5 py-0.5 font-mono text-[11px] text-stardust"
                        style={{ border: `1px solid ${hex}40` }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------- work */

const PROJECT_DOMAINS = [
  'Platform · flagship',
  'Realtime · geospatial',
  'Product · microservices',
  'Multi-tenant · analytics',
  'Event-driven · EdTech',
  'Commerce · microservices',
  'Infra · zero-trust',
  'IoT · computer vision',
];

const PROJECTS = resume.en.projects.map((p, i) => ({
  name: p.title,
  desc: p.description,
  stack: p.stack.join(' · '),
  domain: PROJECT_DOMAINS[i] ?? '',
}));

const CARD_ACCENTS = ['#48DFE3', '#9D7BFF', '#57D9A3', '#FDB813'];

function Work() {
  const [flagship, ...rest] = PROJECTS;
  return (
    <Section glow="#9d7bff" glowPos="left">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <SectionHeading
            id="work"
            index="03"
            eyebrow="asteroid field"
            title="Selected work"
            note="Most of these are private / under NDA — described at a high level, without client or product names."
          />
        </Reveal>

        {/* flagship — the reusable framework */}
        <Reveal>
          <div className="card-cosmos group relative mb-6 overflow-hidden rounded-2xl border border-gold/25 p-8 transition-colors hover:border-gold/60 sm:p-10">
            <div
              className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full opacity-50 blur-2xl transition-opacity group-hover:opacity-80"
              style={{ background: 'radial-gradient(circle, rgba(253,184,19,0.30), transparent 70%)' }}
            />
            <div className="relative">
              <p className="eyebrow">the flagship</p>
              <h3 className="font-display mt-3 max-w-3xl text-2xl font-bold text-starlight sm:text-3xl">
                {flagship.name}
              </h3>
              <p className="mt-3 max-w-3xl text-[17px] leading-relaxed text-stardust">
                {flagship.desc}
              </p>
              <p className="mt-4 font-mono text-[12px] leading-relaxed text-deep-grey">
                {flagship.stack}
              </p>
            </div>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p, i) => {
            const accent = CARD_ACCENTS[i % CARD_ACCENTS.length];
            return (
              <Reveal as="article" key={p.name} delay={(i % 3) * 0.05}>
                <div className="card-cosmos group flex h-full flex-col rounded-xl border border-white/10 p-6">
                  <span
                    className="mb-3 inline-flex w-fit rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider"
                    style={{ color: accent, border: `1px solid ${accent}40` }}
                  >
                    {p.domain}
                  </span>
                  <h3 className="font-display text-lg font-semibold leading-snug text-starlight">
                    {p.name}
                  </h3>
                  <p className="mt-3 flex-1 text-[15px] leading-relaxed text-stardust">{p.desc}</p>
                  <p className="mt-5 font-mono text-[12px] leading-relaxed text-deep-grey">{p.stack}</p>
                </div>
              </Reveal>
            );
          })}
        </div>

        {/* the explorer — moved to the end, sold as a bonus that shows range */}
        <Reveal>
          <Link
            href="/explore"
            className="card-cosmos group relative mt-6 flex flex-col gap-6 overflow-hidden rounded-2xl border border-plasma/25 p-8 transition-colors hover:border-plasma/60 sm:flex-row sm:items-center sm:justify-between sm:p-10"
          >
            <div
              className="pointer-events-none absolute -left-16 -top-16 h-56 w-56 rounded-full opacity-40 blur-2xl transition-opacity group-hover:opacity-70"
              style={{ background: 'radial-gradient(circle, rgba(72,223,227,0.30), transparent 70%)' }}
            />
            <div className="relative max-w-xl">
              <p className="eyebrow">something extra</p>
              <h3 className="font-display mt-3 text-2xl font-bold text-starlight sm:text-3xl">
                My whole career as an explorable map
              </h3>
              <p className="mt-3 text-[17px] leading-relaxed text-stardust">
                Companies are planets, skills are their moons, projects drift in
                the asteroid belt — with a terminal, achievements, and hidden
                depths. A little proof I can build on the front end too.
              </p>
              <p className="mt-4 font-mono text-[13px] text-deep-grey">
                Three.js · React Three Fiber · TypeScript
              </p>
            </div>
            <span className="relative inline-flex shrink-0 items-center gap-2 rounded-full border border-plasma/50 px-6 py-3 font-display font-semibold text-plasma transition-transform group-hover:scale-105">
              Enter <span aria-hidden="true">→</span>
            </span>
          </Link>
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------- stack */

const STACK: Array<[string, string, string[]]> = [
  ['languages & frameworks', '#FDB813', ['Java', 'Spring Boot', 'Spring Cloud', 'Hibernate / JPA', 'PHP · Laravel', 'TypeScript · React']],
  ['data & messaging', '#48DFE3', ['PostgreSQL · PostGIS', 'Oracle · PL/SQL', 'Redis', 'Kafka · RabbitMQ', 'Elasticsearch · ClickHouse']],
  ['architecture', '#9D7BFF', ['Microservices', 'Event-driven', 'API gateway', 'Domain-driven design', 'gRPC · REST']],
  ['infrastructure', '#57D9A3', ['Linux', 'Docker · Kubernetes', 'Proxmox · ESXi', 'MikroTik', 'CI/CD · Git']],
];

function Stack() {
  return (
    <Section glow="#57d9a3" glowPos="right">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <SectionHeading id="stack" index="04" eyebrow="tool constellation" title="Tools I trust" />
        </Reveal>
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {STACK.map(([group, accent, items], gi) => (
            <Reveal key={group} delay={gi * 0.05}>
              <h3 className="font-mono text-[13px]" style={{ color: accent }}>
                ~/{group}
              </h3>
              <ul className="mt-5 flex flex-wrap gap-2">
                {items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border bg-white/[0.02] px-2.5 py-1 text-[14px] text-starlight/90"
                    style={{ borderColor: `${accent}30` }}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------- resume band */

function ResumeBand() {
  return (
    <Section>
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 sm:py-24">
        <Reveal>
          <div className="card-cosmos flex flex-col items-start gap-8 rounded-2xl border border-white/10 p-8 sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-12">
            <div className="max-w-xl">
              <p className="eyebrow">mission dossier</p>
              <h2 className="font-display mt-3 text-3xl font-bold text-starlight">
                The full résumé
              </h2>
              <p className="mt-3 leading-relaxed text-stardust">
                Available in English and Persian — read it in the browser or take
                the PDF.
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
        </Reveal>
      </div>
    </Section>
  );
}

/* ---------------------------------------------------------- contact + footer */

function Contact() {
  return (
    <Section glow="#fdb813" glowPos="left">
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        <Reveal>
          <SectionHeading
            id="contact"
            index="05"
            eyebrow="open a channel"
            title="Let's build something reliable"
          />
        </Reveal>
        <Reveal delay={0.05}>
          <CopyEmail email={EMAIL} />
          <div className="mt-9 flex flex-wrap gap-x-8 gap-y-3 font-mono text-sm">
            <a
              href={GITHUB}
              target="_blank"
              rel="noopener noreferrer"
              className="link-sweep text-stardust transition-colors hover:text-starlight"
            >
              github.com/alishahidi ↗
            </a>
            <a
              href={LINKEDIN}
              target="_blank"
              rel="noopener noreferrer"
              className="link-sweep text-stardust transition-colors hover:text-starlight"
            >
              linkedin.com/in/alishahidi ↗
            </a>
            <span className="text-deep-grey">tehran, iran</span>
          </div>
          <p className="mt-6 flex items-center gap-2.5 font-mono text-[13px] text-stardust">
            <span className="status-dot" aria-hidden="true" />
            <span className="text-aurora">Open to backend / Java roles</span>
            <span className="text-deep-grey">— phone is on the résumé PDF</span>
          </p>
        </Reveal>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="relative">
      <hr className="section-seam" />
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-9 sm:flex-row sm:items-center sm:px-8">
        <p className="font-mono text-[12px] text-deep-grey">
          © {new Date().getFullYear()} Ali Shahidi — built with Next.js, hosted on
          Cloudflare Pages
        </p>
        <Link
          href="/explore"
          className="link-sweep group inline-flex items-center gap-2 font-mono text-[13px] text-gold-bright transition-colors hover:text-gold"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-gold shadow-[0_0_10px_2px_rgba(253,184,19,0.6)]" />
          re-enter the universe
          <span className="transition-transform group-hover:translate-x-1" aria-hidden="true">
            →
          </span>
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
