import type { Metadata, Viewport } from 'next';
import { Space_Grotesk, Manrope, JetBrains_Mono, Vazirmatn } from 'next/font/google';
import { Starfield } from '@/components/shared/Starfield';
import { MotionProvider } from '@/components/shared/MotionProvider';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['500', '600', '700'],
});

const manrope = Manrope({
  variable: '--font-body',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600'],
});

const vazirmatn = Vazirmatn({
  variable: '--font-vazirmatn',
  subsets: ['arabic', 'latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://alishahidi.net'),
  title: {
    default: 'Ali Shahidi — Backend Developer',
    template: '%s — Ali Shahidi',
  },
  description:
    'Ali Shahidi — Backend developer specializing in Java, Spring Boot, and enterprise systems. Designing scalable, reliable services and leading data migrations in production.',
  keywords: [
    'Ali Shahidi',
    'Backend Developer',
    'Java Developer',
    'Spring Boot',
    'PHP Developer',
    'Laravel',
    'MySQL',
    'Oracle',
    'Redis',
    'Docker',
    'Linux',
    'REST API',
    'Microservices',
    'Software Developer',
    'RabbitMQ',
    'Hibernate',
    'Backend Architecture',
    'Data Migration',
  ],
  authors: [{ name: 'Ali Shahidi', url: 'https://alishahidi.net' }],
  creator: 'Ali Shahidi',
  publisher: 'Ali Shahidi',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alishahidi.net',
    title: 'Ali Shahidi — Backend Developer',
    description:
      'Backend developer specializing in Java, Spring Boot, and enterprise systems. Services that organizations can lean on.',
    siteName: 'Ali Shahidi',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ali Shahidi — Backend Developer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ali Shahidi — Backend Developer',
    description:
      'Backend developer specializing in Java, Spring Boot, and enterprise systems.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://alishahidi.net',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#060814',
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ali Shahidi',
  url: 'https://alishahidi.net',
  jobTitle: 'Backend Developer',
  description:
    'Backend developer specializing in Java, Spring Boot, and enterprise systems.',
  knowsAbout: [
    'Java',
    'Spring Boot',
    'Hibernate',
    'PHP',
    'Laravel',
    'MySQL',
    'Oracle',
    'Redis',
    'Docker',
    'Linux',
    'RabbitMQ',
    'REST API Design',
    'Backend Architecture',
    'Data Migration',
  ],
  sameAs: [
    'https://github.com/alishahidi',
    'https://linkedin.com/in/alishahidi',
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} ${jetbrainsMono.variable} ${vazirmatn.variable} antialiased`}
      >
        <Starfield />
        <div className="site-grain" aria-hidden="true" />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
