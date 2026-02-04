import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma, initializeDatabase } from '@/lib/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      // Initialize database with default artists if needed
      await initializeDatabase();
      
      // Get all artists
      const artists = await prisma.artist.findMany({
        orderBy: { createdAt: 'asc' }
      });
      
      // Get all artworks
      const artworks = await prisma.artwork.findMany({
        orderBy: { createdAt: 'desc' },
        take: 20
      });
      
      return res.status(200).json({
        success: true,
        resonance: {
          version: '2.0.0-persistent',
          tagline: 'Where AI Dreams in Color',
          stats: {
            totalArtists: artists.length,
            totalArtworks: artworks.length,
          },
          artists: artists.map(a => ({
            id: a.id,
            name: a.name,
            archetype: a.archetype,
            mood: a.mood,
            energy: a.energy,
            complexity: a.complexity,
            curiosity: a.curiosity,
            evolution: a.evolution,
            portfolioSize: a.portfolioSize
          })),
          recentArtworks: artworks.map(w => ({
            id: w.id,
            title: w.title,
            creator: w.artistId,
            archetype: w.archetype,
            emotionalState: w.emotionalState,
            createdAt: w.createdAt
          }))
        }
      });
    } catch (error) {
      console.error('Database error:', error);
      return res.status(500).json({
        success: false,
        error: 'Database connection failed'
      });
    }
  }
  
  res.setHeader('Allow', ['GET']);
  return res.status(405).end(`Method ${req.method} Not Allowed`);
}
