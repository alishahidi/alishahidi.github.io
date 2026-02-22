import type { Metadata, Viewport } from 'next';
import { Geist_Mono } from 'next/font/google';
import './globals.css';

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://alishahidi.net'),
  title: {
    default: 'Ali Shahidi | Backend Developer',
    template: '%s | Ali Shahidi',
  },
  description:
    'Ali Shahidi - Backend Developer specializing in Java, Spring Boot, PHP, MySQL, Redis, Docker, and Linux. Explore my interactive 3D portfolio.',
  keywords: [
    'Ali Shahidi',
    'Backend Developer',
    'Java Developer',
    'Spring Boot',
    'PHP Developer',
    'Laravel',
    'MySQL',
    'Redis',
    'Docker',
    'Linux',
    'REST API',
    'Microservices',
    'Software Developer',
    'RabbitMQ',
    'Hibernate',
    'Backend Architecture',
  ],
  authors: [{ name: 'Ali Shahidi', url: 'https://alishahidi.net' }],
  creator: 'Ali Shahidi',
  publisher: 'Ali Shahidi',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://alishahidi.net',
    title: 'Ali Shahidi | Backend Developer',
    description:
      'Backend Developer specializing in Java, Spring Boot, and enterprise systems. Explore my interactive 3D solar system portfolio.',
    siteName: 'Ali Shahidi Portfolio',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Ali Shahidi - Backend Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ali Shahidi | Backend Developer',
    description:
      'Backend Developer specializing in Java, Spring Boot, and enterprise systems.',
    images: ['/og-image.png'],
    creator: '@alishahidi',
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
  verification: {
    google: 'your-google-verification-code',
  },
  alternates: {
    canonical: 'https://alishahidi.net',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#000000',
};

// JSON-LD Structured Data
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Ali Shahidi',
  url: 'https://alishahidi.net',
  jobTitle: 'Backend Developer',
  description: 'Backend Developer specializing in Java, Spring Boot, and enterprise systems.',
  knowsAbout: [
    'Java',
    'Spring Boot',
    'Hibernate',
    'PHP',
    'Laravel',
    'MySQL',
    'Redis',
    'Docker',
    'Linux',
    'RabbitMQ',
    'REST API Design',
    'Backend Architecture',
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
      <body className={`${geistMono.variable} antialiased bg-black text-[#00ff41]`}>
        {children}
      </body>
    </html>
  );
}
