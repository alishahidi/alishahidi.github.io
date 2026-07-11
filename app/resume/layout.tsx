import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Résumé',
  description:
    'Résumé of Ali Shahidi — Backend Developer (Java & Spring Boot). Available in English and Persian, viewable as HTML or downloadable as PDF.',
  alternates: {
    canonical: 'https://alishahidi.net/resume',
  },
};

export default function ResumeLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
