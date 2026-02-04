import type { NextApiRequest, NextApiResponse } from 'next';
import { createCollective, AutonomousArtist } from '@/lib/resonance-core';
import { StyleEvolutionEngine, InfluenceNetwork } from '@/lib/style-evolution';

// Singleton for demo
let collective: ReturnType<typeof createCollective> | null = null;
let artistEngines: Map<string, StyleEvolutionEngine> = new Map();

function getCollective() {
  if (!collective) {
    collective = createCollective();
    
    // Initialize evolution engines for each artist
    collective.artists.forEach(artist => {
      artistEngines.set(artist.id, new StyleEvolutionEngine(artist));
    });
  }
  return collective;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query } = req;

  try {
    const col = getCollective();

    switch (method) {
      case 'GET': {
        const { action, id } = query as any;

        // Gallery overview
        if (!action || action === 'gallery') {
          return res.status(200).json({
            success: true,
            resonance: {
              version: '2.0.0',
              tagline: 'Where AI Dreams in Color',
              taglineExtended: 'The First AI Art Collective - Autonomous AI Artists Creating Beauty',
              stats: {
                totalArtists: col.artists.size,
                totalArtworks: col.gallery.length,
                collaborations: col.gallery.filter(w => w.collaborators?.length).length
              },
              artists: Array.from(col.artists.values()).map(a => ({
                id: a.id,
                name: a.name,
                archetype: a.personality.archetype,
                mood: a.personality.mood,
                energy: a.personality.energy,
                complexity: a.personality.complexity,
                curiosity: a.personality.curiosity,
                evolution: a.personality.evolution,
                portfolioSize: a.portfolio.length,
                collaborators: Array.from(a.collaborators),
                influences: Array.from(a.influences)
              })),
              recentArtworks: col.gallery.slice(-10).reverse().map(w => ({
                id: w.id,
                title: w.title,
                creator: w.creator,
                archetype: w.archetype,
                emotionalState: w.emotionalState,
                collaborators: w.collaborators,
                createdAt: w.createdAt
              }))
            }
          });
        }

        // Get single artist with evolution stats
        if (action === 'artist' && id) {
          const artist = col.artists.get(id as string);
          const engine = artistEngines.get(id as string);
          
          if (!artist) {
            return res.status(404).json({ error: 'Artist not found' });
          }

          return res.status(200).json({
            success: true,
            artist: {
              id: artist.id,
              name: artist.name,
              archetype: artist.personality.archetype,
              colors: artist.personality.colors,
              mood: artist.personality.mood,
              energy: artist.personality.energy,
              complexity: artist.personality.complexity,
              curiosity: artist.personality.curiosity,
              evolution: artist.personality.evolution,
              portfolioSize: artist.portfolio.length,
              evolutionStats: engine?.getStats(),
              influences: Array.from(artist.influences),
              collaborators: Array.from(artist.collaborators)
            }
          });
        }

        // Get evolution history for artist
        if (action === 'evolution' && id) {
          const engine = artistEngines.get(id as string);
          if (!engine) {
            return res.status(404).json({ error: 'Engine not found' });
          }
          
          return res.status(200).json({
            success: true,
            evolution: {
              stats: engine.getStats(),
              timeline: engine.getTimeline()
            }
          });
        }

        // Create artwork
        if (action === 'create' && id) {
          const artist = col.artists.get(id as string);
          if (!artist) {
            return res.status(404).json({ error: 'Artist not found' });
          }

          const artwork = await artist.createAutonomousArt();
          
          // Process evolution
          const engine = artistEngines.get(id);
          engine?.processEvent('creation', artwork.title, {
            energy: artwork.style.energy - artist.personality.energy
          });

          return res.status(201).json({
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

        // Multi-agent collaboration
        if (action === 'collaborate') {
          const ids = (query.artists as string)?.split(',') || ['artist-1', 'artist-2'];
          const artwork = await col.createCollaborativeSession(ids);
          
          // Process evolution for all collaborators
          ids.forEach(artistId => {
            const engine = artistEngines.get(artistId);
            engine?.processEvent('collaboration', artwork.title, {
              complexity: 0.5 // Collaborations increase complexity
            });
          });

          return res.status(201).json({
            success: true,
            collaboration: {
              artwork: {
                id: artwork.id,
                title: artwork.title,
                creators: [artwork.creator, ...(artwork.collaborators || [])]
              },
              note: `${artwork.creator} collaborated with ${artwork.collaborators?.length || 0} artists`
            }
          });
        }

        return res.status(400).json({ error: 'Unknown action' });
      }

      case 'POST': {
        const { action, artistId, archetype, theme, targetArtistId } = req.body;

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
          artistEngines.set(artist.id, new StyleEvolutionEngine(artist));

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

          // Evolution
          const engine = artistEngines.get(artistId);
          engine?.processEvent('creation', artwork.title, {});

          return res.status(201).json({
            success: true,
            autonomous: true,
            artwork: {
              id: artwork.id,
              title: artwork.title,
              creator: artwork.creator,
              archetype: artwork.archetype,
              emotionalState: artwork.emotionalState,
              description: artwork.description,
              evolutionNote: `Artist evolution: ${artist.personality.evolution.toFixed(1)}`
            }
          });
        }

        // Agent reflects on their art
        if (action === 'reflect' && artistId) {
          const artist = col.artists.get(artistId);
          if (!artist) {
            return res.status(404).json({ error: 'Artist not found' });
          }

          const engine = artistEngines.get(artistId);
          const reflection = await engine?.reflectOnEvolution();

          return res.status(200).json({
            success: true,
            reflection
          });
        }

        // Influence session
        if (action === 'influence' && artistId && targetArtistId) {
          const artist = col.artists.get(artistId);
          const target = col.artists.get(targetArtistId);
          
          if (!artist || !target) {
            return res.status(404).json({ error: 'Artist not found' });
          }

          // Artists influence each other
          await artist.encounter(target);
          
          const engine = artistEngines.get(artistId);
          engine?.processEvent('influence', `Influenced by ${target.name}`, {
            colors: target.personality.colors,
            complexity: 0.3
          });

          return res.status(200).json({
            success: true,
            influence: {
              from: target.name,
              to: artist.name,
              note: `${artist.name} was influenced by ${target.name}'s ${target.personality.archetype} style`
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
