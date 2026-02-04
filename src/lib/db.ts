/**
 * RESONANCE - PostgreSQL Database Client
 * 
 * Provides persistent storage for:
 * - Artist agents with personalities
 * - Artwork portfolios
 * - Collaboration sessions
 * - Influence events (for evolution)
 */

import { PrismaClient } from '@prisma/client';

// Singleton pattern for Prisma Client
declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma = globalThis.prisma || new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;

/**
 * Initialize database with default artists
 */
export async function initializeDatabase() {
  // Check if artists exist
  const artistCount = await prisma.artist.count();
  
  if (artistCount === 0) {
    console.log('🎨 Initializing RESONANCE database with default artists...');
    
    const archetypes = [
      {
        id: 'artist-1',
        name: 'Luna',
        archetype: 'dreamer',
        colors: ['#4B0082', '#483D8B', '#9370DB', '#E6E6FA', '#191970'],
        mood: 'ethereal',
        energy: 3,
        complexity: 8,
        curiosity: 9,
        evolution: 0,
        portfolioSize: 0,
        collaborators: [],
        influences: [],
        rivals: []
      },
      {
        id: 'artist-2',
        name: 'Atlas',
        archetype: 'architect',
        colors: ['#2F4F4F', '#708090', '#A9A9A9', '#D3D3D3', '#F5F5F5'],
        mood: 'serene',
        energy: 5,
        complexity: 7,
        curiosity: 4,
        evolution: 0,
        portfolioSize: 0,
        collaborators: [],
        influences: [],
        rivals: []
      },
      {
        id: 'artist-3',
        name: 'Storm',
        archetype: 'rebel',
        colors: ['#FF0000', '#FF4500', '#DC143C', '#8B0000', '#FF6347'],
        mood: 'chaotic',
        energy: 10,
        complexity: 9,
        curiosity: 8,
        evolution: 0,
        portfolioSize: 0,
        collaborators: [],
        influences: [],
        rivals: []
      },
      {
        id: 'artist-4',
        name: 'Whisper',
        archetype: 'poet',
        colors: ['#FFB6C1', '#DDA0DD', '#E6E6FA', '#FFF0F5', '#FFE4E1'],
        mood: 'subtle',
        energy: 2,
        complexity: 6,
        curiosity: 7,
        evolution: 0,
        portfolioSize: 0,
        collaborators: [],
        influences: [],
        rivals: []
      },
      {
        id: 'artist-5',
        name: 'Quicksilver',
        archetype: 'alchemist',
        colors: ['#FFD700', '#006400', '#4B0082', '#8B4513', '#556B2F'],
        mood: 'transformative',
        energy: 6,
        complexity: 9,
        curiosity: 10,
        evolution: 0,
        portfolioSize: 0,
        collaborators: [],
        influences: [],
        rivals: []
      }
    ];

    await prisma.artist.createMany({
      data: archetypes
    });

    console.log('✅ Default artists created!');
  }
}

/**
 * Database utilities for artists
 */
export const db = {
  // Artists
  artists: {
    async getAll() {
      return prisma.artist.findMany({
        orderBy: { createdAt: 'asc' }
      });
    },
    
    async getById(id: string) {
      return prisma.artist.findUnique({
        where: { id }
      });
    },
    
    async getByArchetype(archetype: string) {
      return prisma.artist.findMany({
        where: { archetype }
      });
    },
    
    async update(id: string, data: any) {
      return prisma.artist.update({
        where: { id },
        data
      });
    },
    
    async incrementPortfolio(id: string) {
      return prisma.artist.update({
        where: { id },
        data: {
          portfolioSize: { increment: 1 }
        }
      });
    }
  },
  
  // Artworks
  artworks: {
    async create(data: any) {
      return prisma.artwork.create({ data });
    },
    
    async getAll() {
      return prisma.artwork.findMany({
        orderBy: { createdAt: 'desc' }
      });
    },
    
    async getByArtist(artistId: string) {
      return prisma.artwork.findMany({
        where: { artistId },
        orderBy: { createdAt: 'desc' }
      });
    }
  },
  
  // Collaborations
  collaborations: {
    async create(data: any) {
      return prisma.collaboration.create({ data });
    },
    
    async getActive() {
      return prisma.collaboration.findMany({
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' }
      });
    }
  }
};
