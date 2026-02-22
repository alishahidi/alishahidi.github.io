import { MetadataRoute } from 'next';
import { skillNodes, projectNodes, philosophyNodes, experienceNodes } from '@/data/loaders';

export const dynamic = 'force-static';

const baseUrl = 'https://alishahidi.net';

export default function sitemap(): MetadataRoute.Sitemap {
  const allNodes = [
    ...skillNodes,
    ...projectNodes,
    ...philosophyNodes,
    ...experienceNodes,
  ];

  // Main page
  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];

  // Node pages
  const nodeRoutes: MetadataRoute.Sitemap = allNodes.map((node) => ({
    url: `${baseUrl}/node/${node.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [...routes, ...nodeRoutes];
}
