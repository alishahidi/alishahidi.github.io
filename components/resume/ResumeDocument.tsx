import { resume, type ResumeLang } from '@/data/resume';

/* Darkened from #b97a1e → #7e5410 so the accent clears WCAG AA (≈6.2:1) on the
   #fdfcf8 paper; the bright original is kept only for the decorative header dot. */
const ACCENT = '#7e5410';
const ACCENT_DOT = '#b97a1e';
const MUTED = '#5b6670';
const HAIRLINE = '#ddd6c8';
const INK = '#2a323a';

function SectionTitle({ children, fa }: { children: React.ReactNode; fa: boolean }) {
  return (
    <div className="flex items-center gap-3 mb-3">
      <h2
        className={`shrink-0 text-[11px] font-semibold tracking-[0.16em] uppercase ${
          fa ? '' : 'font-mono'
        }`}
        style={{ color: ACCENT }}
      >
        {children}
      </h2>
      <div className="h-px flex-1" style={{ background: HAIRLINE }} />
    </div>
  );
}

export function ResumeDocument({ lang }: { lang: ResumeLang }) {
  const r = resume[lang];
  const fa = lang === 'fa';

  return (
    <div
      dir={r.dir}
      lang={lang}
      className={`resume-sheet mx-auto w-full max-w-[210mm] rounded-sm px-5 py-8 sm:px-12 sm:py-12 ${
        fa ? 'font-fa' : ''
      }`}
    >
      {/* header */}
      <header className="pb-6 mb-7 border-b" style={{ borderColor: HAIRLINE }}>
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h1 className="flex items-center gap-2.5 text-[30px] leading-none font-black tracking-tight">
            <span
              aria-hidden="true"
              className="inline-block h-2.5 w-2.5 rounded-full"
              style={{ background: ACCENT_DOT, boxShadow: `0 0 8px 1px ${ACCENT_DOT}66` }}
            />
            {r.name}
          </h1>
          <p className="text-[15px] font-semibold" style={{ color: ACCENT }}>
            {r.title}
          </p>
        </div>
        <ul
          className={`mt-4 flex flex-wrap gap-x-5 gap-y-1.5 text-[11px] ${fa ? '' : 'font-mono'}`}
          style={{ color: MUTED }}
        >
          <li>
            <a href={r.contact.websiteUrl} className="font-semibold underline" style={{ color: ACCENT }}>
              {r.contact.website}
            </a>
          </li>
          <li>
            <a href={`mailto:${r.contact.email}`} className="underline">
              {r.contact.email}
            </a>
          </li>
          <li dir="ltr">
            <a href={`tel:${r.contact.phone}`} className="underline">
              {r.contact.phoneDisplay}
            </a>
          </li>
          <li>
            <a href={r.contact.githubUrl} className="underline">
              {r.contact.github}
            </a>
          </li>
          <li>
            <a href={r.contact.linkedinUrl} className="underline">
              {r.contact.linkedin}
            </a>
          </li>
          <li>{r.contact.location}</li>
        </ul>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-[1fr_236px] gap-x-10">
        {/* main column — Summary, Experience, Education, Languages (fills the left height) */}
        <div>
          <section className="mt-7 first:mt-0">
            <SectionTitle fa={fa}>{r.labels.summary}</SectionTitle>
            {r.summary.map((p, i) => (
              <p
                key={i}
                className="text-[13px] sm:text-[12px] leading-[1.7] mb-2.5 last:mb-0"
                style={{ color: INK }}
              >
                {p}
              </p>
            ))}
          </section>

          <section className="mt-7 first:mt-0">
            <SectionTitle fa={fa}>{r.labels.experience}</SectionTitle>
            <div className="space-y-5">
              {r.experience.map((job) => (
                <article key={job.company + job.role} style={{ breakInside: 'avoid' }}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                    <h3 className="text-[14px] font-bold">{job.role}</h3>
                    <p className={`text-[11px] ${fa ? '' : 'font-mono'}`} style={{ color: MUTED }}>
                      {job.period}
                    </p>
                  </div>
                  <p className="text-[12px] font-semibold mt-0.5" style={{ color: ACCENT }}>
                    {job.company}
                  </p>
                  <ul className="mt-2 space-y-1 ps-4 list-disc marker:text-[10px]">
                    {job.bullets.map((b, i) => (
                      <li key={i} className="text-[13px] sm:text-[12px] leading-[1.65]" style={{ color: INK }}>
                        {b}
                      </li>
                    ))}
                  </ul>
                  <p className={`mt-1.5 text-[11px] ${fa ? '' : 'font-mono'}`} style={{ color: MUTED }}>
                    {r.labels.skillsUsed}: {job.skills.join(' · ')}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="mt-7 first:mt-0" style={{ breakInside: 'avoid' }}>
            <SectionTitle fa={fa}>{r.labels.education}</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-9 gap-y-3">
              {r.education.map((edu) => (
                <article key={edu.school} style={{ breakInside: 'avoid' }}>
                  <h3 className="text-[14px] font-bold leading-snug">{edu.degree}</h3>
                  <p className="text-[11px] mt-0.5" style={{ color: ACCENT }}>
                    {edu.school}
                  </p>
                  <p className={`text-[11px] mt-0.5 ${fa ? '' : 'font-mono'}`} style={{ color: MUTED }}>
                    {edu.period}
                  </p>
                  {edu.note && (
                    <p className="text-[11px] mt-0.5" style={{ color: MUTED }}>
                      {edu.note}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>

          <section className="mt-7 first:mt-0" style={{ breakInside: 'avoid' }}>
            <SectionTitle fa={fa}>{r.labels.languages}</SectionTitle>
            <ul className="flex flex-wrap gap-x-6 gap-y-1.5">
              {r.languages.map((s) => (
                <li key={s} className="text-[12px] leading-snug" style={{ color: INK }}>
                  {s}
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* side column — Personal, Technical Skills, Strengths */}
        <aside className="mt-7 sm:mt-0">
          <section className="mt-7 first:mt-0" style={{ breakInside: 'avoid' }}>
            <SectionTitle fa={fa}>{r.labels.personal}</SectionTitle>
            <ul className="space-y-1.5">
              {r.personal.map((s) => (
                <li key={s} className="text-[12px] leading-snug" style={{ color: INK }}>
                  {s}
                </li>
              ))}
            </ul>
          </section>

          <section className="mt-7 first:mt-0">
            <SectionTitle fa={fa}>{r.labels.skills}</SectionTitle>
            <div className="space-y-3">
              {r.skillGroups.map((group) => (
                <div key={group.label} style={{ breakInside: 'avoid' }}>
                  <h4
                    className={`text-[11px] font-bold mb-1 ${fa ? '' : 'font-mono'}`}
                    style={{ color: '#3a4048' }}
                  >
                    {group.label}
                  </h4>
                  <ul className="flex flex-wrap gap-1">
                    {group.items.map((s) => (
                      <li
                        key={s}
                        className="rounded-sm border px-1.5 py-[1px] text-[11px] leading-normal"
                        style={{ borderColor: HAIRLINE, color: INK }}
                      >
                        {s}
                      </li>
                    ))}
                  </ul>
                  {group.note && (
                    <p className="mt-1 text-[11px] leading-snug italic" style={{ color: MUTED }}>
                      {group.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section className="mt-7 first:mt-0" style={{ breakInside: 'avoid' }}>
            <SectionTitle fa={fa}>{r.labels.softSkills}</SectionTitle>
            <ul className="space-y-1.5">
              {r.softSkills.map((s) => (
                <li key={s} className="text-[12px] leading-snug flex gap-2" style={{ color: INK }}>
                  <span aria-hidden="true" style={{ color: ACCENT }}>
                    —
                  </span>
                  {s}
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>

      {/* Selected Projects — full width */}
      <section className="mt-8">
        <SectionTitle fa={fa}>{r.labels.projects}</SectionTitle>
        <p className="-mt-1 mb-4 text-[11px] italic" style={{ color: MUTED }}>
          {r.labels.projectsNote}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-9 gap-y-4">
          {r.projects.map((p) => (
            <article
              key={p.title}
              className="border-t pt-2.5"
              style={{ breakInside: 'avoid', borderColor: HAIRLINE }}
            >
              <h3 className="text-[14px] font-bold leading-snug" style={{ color: '#1d2429' }}>
                {p.title}
              </h3>
              <p className="mt-1 text-[12px] leading-[1.6]" style={{ color: INK }}>
                {p.description}
              </p>
              <p dir="ltr" className="mt-1.5 text-[11px] font-mono leading-snug" style={{ color: MUTED }}>
                {p.stack.join(' · ')}
              </p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
