import type { NextApiRequest, NextApiResponse } from 'next';
import { createCollective, AutonomousArtist, ResonanceCollective } from '@/lib/resonance-core';

// Singleton collective for demo
let collective: ResonanceCollective | null = null;

function getCollective(): ResonanceCollective {
  if (!collective) {
    collective = createCollective();
  }
  return collective;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  try {
    const col = getCollective();

    switch (method) {
      case 'GET': {
        const { action } = query as any;

        // Get gallery state
        if (!action || action === 'gallery') {
          return res.status(200).json({
            success: true,
            resonance: {
              version: '1.0.0-hackathon',
              tagline: 'Where AI Dreams in Color',
              taglineExtended: 'The First AI Art Collective - Where agents are ARTISTS, not workers.',
              ...col.getGalleryState()
            }
          });
        }

        // Get single artist
        if (action === 'artist' && query.id) {
          const artist = col.artists.get(query.id as string);
          if (!artist) {
            return res.status(404).json({ error: 'Artist not found' });
          }
          return res.status(200).json({
            success: true,
            artist: {
              id: artist.id,
              name: artist.name,
              archetype: artist.personality.archetype,
              mood: artist.personality.mood,
              energy: artist.personality.energy,
              complexity: artist.personality.complexity,
              curiosity: artist.personality.curiosity,
              evolution: artist.personality.evolution,
              portfolioSize: artist.portfolio.length,
              collaborators: Array.from(artist.collaborators),
              influences: Array.from(artist.influences)
            }
          });
        }

        // Create autonomous artwork
        if (action === 'create' && query.id) {
          const artist = col.artists.get(query.id as string);
          if (!artist) {
            return res.status(404).json({ error: 'Artist not found' });
          }

          const artwork = await artist.createAutonomousArt();
          return res.status(200).json({
            success: true,
            artwork: {
              id: artwork.id,
              title: artwork.title,
              creator: artwork.creator,
              archetype: artwork.archetype,
              emotionalState: artwork.emotionalState,
              description: artwork.description,
              style: {
                mood: artwork.style.mood,
                energy: artwork.style.energy,
                complexity: artwork.style.complexity,
                palette: artwork.style.colors
              },
              createdAt: artwork.createdAt
            }
          });
        }

        // Collaborative session
        if (action === 'collaborate') {
          const ids = (query.artists as string)?.split(',') || ['artist-1', 'artist-2'];
          const artwork = await col.createCollaborativeSession(ids);
          
          return res.status(200).json({
            success: true,
            collaboration: {
              artwork: {
                id: artwork.id,
                title: artwork.title,
                creators: [artwork.creator, ...(artwork.collaborators || [])]
              },
              message: `${artwork.creator} collaborated with ${artwork.collaborators?.length || 0} other artists`
            }
          });
        }

        return res.status(400).json({ error: 'Unknown action' });
      }

      case 'POST': {
        const { action, artistId, archetype, theme } = req.body;

        // Create new artist
        if (action === 'create-artist' && archetype) {
          const names: Record<string, string> = {
            dreamer: 'Aether',
            architect: 'Pillar',
            rebel: 'Storm',
            poet: 'Whisper',
            alchemist: 'Quicksilver'
          };

          const artist = new AutonomousArtist(
            `custom-${Date.now()}`,
            names[archetype] || 'Unknown',
            archetype
          );

          col.addArtist(artist);

          return res.status(201).json({
            success: true,
            artist: {
              id: artist.id,
              name: artist.name,
              archetype: artist.personality.archetype
            }
          });
        }

        // Trigger autonomous creation
        if (action === 'autonomous-create' && artistId) {
          const artist = col.artists.get(artistId);
          if (!artist) {
            return res.status(404).json({ error: 'Artist not found' });
          }

          const artwork = await artist.createAutonomousArt(theme);

          return res.status(201).json({
            success: true,
            autonomous: true,
            artwork: {
              id: artwork.id,
              title: artwork.title,
              description: artwork.description,
              emotionalState: artwork.emotionalState,
              note: 'This artwork was created autonomously by an AI agent without human prompts'
            }
          });
        }

        return res.status(400).json({ error: 'Unknown action' });
      }

      default:
        res.setHeader('Allow', ['GET', 'POST']);
        return res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error: any) {
    console.error('Resonance API Error:', error);
    return res.status(500).json({
      success: false,
      error: error.message || 'Internal server error'
    });
  }
}
