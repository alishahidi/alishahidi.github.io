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

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    {
      url: `${baseUrl}/resume`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/explore`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
  ];

  const nodeRoutes: MetadataRoute.Sitemap = allNodes.map((node) => ({
    url: `${baseUrl}/node/${node.id}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.5,
  }));

  return [...routes, ...nodeRoutes];
}
