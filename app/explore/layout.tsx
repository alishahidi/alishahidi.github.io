import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Explore — The Interactive Universe',
  description:
    'Explore Ali Shahidi’s skills, projects, and experience as an interactive solar system — with a terminal, achievements, and hidden depths.',
  alternates: {
    canonical: 'https://alishahidi.net/explore',
  },
};

export default function ExploreLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="explore-root bg-[#060814] text-[#48DFE3]">{children}</div>
  );
}
