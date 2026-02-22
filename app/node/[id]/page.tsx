import { Metadata } from 'next';
import { allNodes } from '@/data/loaders';
import { GraphNode } from '@/types';

// Generate static params for all nodes
export async function generateStaticParams() {
  return allNodes.map((node) => ({
    id: node.id,
  }));
}

// Generate metadata for SEO
export async function generateMetadata({
  params
}: {
  params: Promise<{ id: string }>
}): Promise<Metadata> {
  const { id } = await params;
  const node = allNodes.find((n) => n.id === id);

  if (!node) {
    return {
      title: 'Node Not Found | Ali Shahidi',
      description: 'The requested node was not found.',
    };
  }

  const typeLabels: Record<string, string> = {
    skill: 'Skill',
    project: 'Project',
    philosophy: 'Philosophy',
    experience: 'Experience',
  };

  const title = `${node.label} - ${typeLabels[node.type] || 'Node'} | Ali Shahidi`;
  const description = node.description || `Explore ${node.label} in Ali Shahidi's interactive portfolio.`;

  return {
    title,
    description,
    keywords: [node.label, ...node.tags, 'Ali Shahidi', 'Backend Developer', node.type],
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://alishahidi.net/node/${node.id}`,
      siteName: 'Ali Shahidi - Backend Developer',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: `${node.label} - Ali Shahidi Portfolio`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `https://alishahidi.net/node/${node.id}`,
    },
  };
}

// Page component - static-export-compatible redirect to main page
export default async function NodePage({
  params
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;

  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content={`0;url=/?node=${id}`} />
      </head>
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html: `window.location.replace("/?node=${id}");`,
          }}
        />
        <p>
          Redirecting to <a href={`/?node=${id}`}>portfolio</a>...
        </p>
      </body>
    </html>
  );
}
