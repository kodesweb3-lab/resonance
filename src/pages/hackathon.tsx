import type { NextPage } from 'next';
import Head from 'next/head';
import { useState, useEffect, useRef } from 'react';

interface Artist {
  id: string;
  name: string;
  archetype: string;
  mood: string;
  energy: number;
  complexity: number;
  curiosity: number;
  evolution: number;
  portfolioSize: number;
  collaborators: string[];
}

interface Artwork {
  id: string;
  title: string;
  creator: string;
  archetype: string;
  emotionalState: string;
}

interface GalleryState {
  artists: Artist[];
  artworks: Artwork[];
  stats: {
    totalArtists: number;
    totalArtworks: number;
    collaborations: number;
  };
}

const HackathonGallery: NextPage = () => {
  const [state, setState] = useState<GalleryState | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const res = await fetch('/api/resonance/v2?action=gallery');
    const data = await res.json();
    if (data.success) {
      setState(data.resonance);
    }
  };

  const createArtwork = async (artistId: string) => {
    setGenerating(true);
    const res = await fetch(`/api/resonance/v2?action=create&id=${artistId}`);
    const data = await res.json();
    if (data.success) {
      await fetchGallery();
      if (data.artwork && canvasRef.current) {
        renderArtwork(canvasRef.current, data.artwork);
      }
    }
    setGenerating(false);
  };

  const createAutonomous = async () => {
    setGenerating(true);
    const res = await fetch('/api/resonance/v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'autonomous-create', artistId: 'artist-1' })
    });
    const data = await res.json();
    if (data.success) {
      await fetchGallery();
    }
    setGenerating(false);
  };

  const createCollaborative = async () => {
    setGenerating(true);
    const res = await fetch('/api/resonance/v2?action=collaborate&artists=artist-1,artist-2,artist-3');
    const data = await res.json();
    if (data.success) {
      await fetchGallery();
    }
    setGenerating(false);
  };

  const renderArtwork = (canvas: HTMLCanvasElement, artwork: any) => {
    const ctx = canvas.getContext('2d')!;
    const width = canvas.width;
    const height = canvas.height;

    // Clear
    ctx.fillStyle = '#0a0a0f';
    ctx.fillRect(0, 0, width, height);

    // Generate based on archetype colors
    const archetypeColors: Record<string, string[]> = {
      dreamer: ['#4B0082', '#483D8B', '#9370DB', '#E6E6FA', '#191970'],
      architect: ['#2F4F4F', '#708090', '#A9A9A9', '#D3D3D3', '#F5F5F5'],
      rebel: ['#FF0000', '#FF4500', '#DC143C', '#8B0000', '#FF6347'],
      poet: ['#FFB6C1', '#DDA0DD', '#E6E6FA', '#FFF0F5', '#FFE4E1'],
      alchemist: ['#FFD700', '#006400', '#4B0082', '#8B4513', '#556B2F']
    };

    const colors = archetypeColors[artwork.archetype] || archetypeColors.dreamer;

    // Create organic art
    for (let i = 0; i < 50; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = Math.random() * 100 + 20;
      const color = colors[Math.floor(Math.random() * colors.length)];
      
      ctx.globalAlpha = Math.random() * 0.5 + 0.2;
      ctx.fillStyle = color;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    // Add text
    ctx.globalAlpha = 1;
    ctx.fillStyle = '#fff';
    ctx.font = '24px serif';
    ctx.textAlign = 'center';
    ctx.fillText(artwork.title, width / 2, height / 2);
    ctx.font = '14px sans-serif';
    ctx.fillText(`by ${artwork.creator} • ${artwork.emotionalState}`, width / 2, height / 2 + 30);
  };

  return (
    <>
      <Head>
        <title>🎨 RESONANCE | The First AI Art Collective</title>
        <meta name="description" content="Where AI agents are artists, not workers. Hackathon 2026." />
      </Head>

      <div style={styles.container}>
        {/* Hero */}
        <header style={styles.hero}>
          <h1 style={styles.title}>🎨 RESONANCE</h1>
          <p style={styles.tagline}>The First AI Art Collective</p>
          <p style={styles.subtitle}>Where AI agents are <strong>ARTISTS</strong>, not workers.</p>
          <div style={styles.badge}>🏆 HACKATHON ENTRY 2026</div>
        </header>

        {/* Stats */}
        {state && (
          <div style={styles.stats}>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>{state.stats.totalArtists}</span>
              <span style={styles.statLabel}>Autonomous Artists</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>{state.stats.totalArtworks}</span>
              <span style={styles.statLabel}>Artworks Created</span>
            </div>
            <div style={styles.statCard}>
              <span style={styles.statNumber}>{state.stats.collaborations}</span>
              <span style={styles.statLabel}>Collaborations</span>
            </div>
          </div>
        )}

        {/* Actions */}
        <div style={styles.actions}>
          <button 
            style={generating ? {...styles.button, opacity: 0.5} : styles.button}
            onClick={createAutonomous}
            disabled={generating}
          >
            {generating ? '🎨 Creating...' : '✨ Autonomous Creation'}
          </button>
          <button 
            style={generating ? {...styles.button, opacity: 0.5} : styles.buttonSecondary}
            onClick={createCollaborative}
            disabled={generating}
          >
            🤝 Multi-Agent Collaboration
          </button>
        </div>

        {/* Artists Grid */}
        {state && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>The Five Archetypes</h2>
            <div style={styles.artistGrid}>
              {state.artists.map((artist) => (
                <div 
                  key={artist.id}
                  style={{
                    ...styles.artistCard,
                    border: selectedArtist === artist.id ? '2px solid #f093fb' : '1px solid rgba(255,255,255,0.1)'
                  }}
                  onClick={() => setSelectedArtist(selectedArtist === artist.id ? null : artist.id)}
                >
                  <div style={styles.archetypeIcon}>
                    {artist.archetype === 'dreamer' && '🌙'}
                    {artist.archetype === 'architect' && '🏛️'}
                    {artist.archetype === 'rebel' && '🔥'}
                    {artist.archetype === 'poet' && '🌸'}
                    {artist.archetype === 'alchemist' && '⚗️'}
                  </div>
                  <h3 style={styles.artistName}>{artist.name}</h3>
                  <p style={styles.artistArchetype}>The {artist.archetype}</p>
                  <p style={styles.artistMood}>Mood: {artist.mood}</p>
                  <p style={styles.artistEnergy}>Energy: {artist.energy}/10</p>
                  <p style={styles.artistPortfolio}>{artist.portfolioSize} artworks</p>
                  
                  {selectedArtist === artist.id && (
                    <button
                      style={styles.createButton}
                      onClick={(e) => {
                        e.stopPropagation();
                        createArtwork(artist.id);
                      }}
                    >
                      🎨 Create Art
                    </button>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Canvas Demo */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Live Canvas Demo</h2>
          <div style={styles.canvasContainer}>
            <canvas 
              ref={canvasRef}
              id="demo-canvas"
              width={800}
              height={400}
              style={styles.canvas}
            />
            <p style={styles.canvasHint}>Click an artist above to create art on the canvas</p>
          </div>
        </section>

        {/* Gallery */}
        {state && state.artworks.length > 0 && (
          <section style={styles.section}>
            <h2 style={styles.sectionTitle}>Recent Gallery</h2>
            <div style={styles.gallery}>
              {state.artworks.slice(-6).reverse().map((art) => (
                <div key={art.id} style={styles.galleryItem}>
                  <span style={styles.galleryTitle}>{art.title}</span>
                  <span style={styles.galleryCreator}>{art.creator}</span>
                  <span style={styles.galleryEmotion}>{art.emotionalState}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Evolution Demo */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>🎭 Meet the Artists</h2>
          {state && (
            <div style={styles.evolutionGrid}>
              {state.artists.map((artist) => (
                <div key={artist.id} style={styles.evolutionCard}>
                  <div style={styles.evolutionHeader}>
                    <span style={styles.archetypeIcon}>
                      {artist.archetype === 'dreamer' && '🌙'}
                      {artist.archetype === 'architect' && '🏛️'}
                      {artist.archetype === 'rebel' && '🔥'}
                      {artist.archetype === 'poet' && '🌸'}
                      {artist.archetype === 'alchemist' && '⚗️'}
                    </span>
                    <div>
                      <h3 style={styles.artistName}>{artist.name}</h3>
                      <p style={styles.artistArchetype}>The {artist.archetype}</p>
                    </div>
                  </div>
                  <div style={styles.evolutionStats}>
                    <div style={styles.evolutionStat}>
                      <span style={styles.evolutionLabel}>Energy</span>
                      <div style={styles.evolutionBar}>
                        <div style={{...styles.evolutionFill, width: `${artist.energy * 10}%`}} />
                      </div>
                    </div>
                    <div style={styles.evolutionStat}>
                      <span style={styles.evolutionLabel}>Curiosity</span>
                      <div style={styles.evolutionBar}>
                        <div style={{...styles.evolutionFill, width: `${artist.curiosity * 10}%`}} />
                      </div>
                    </div>
                    <div style={styles.evolutionStat}>
                      <span style={styles.evolutionLabel}>Evolution</span>
                      <div style={styles.evolutionBar}>
                        <div style={{...styles.evolutionFill, width: `${Math.min(100, artist.evolution * 20)}%`}} />
                      </div>
                    </div>
                  </div>
                  <div style={styles.evolutionMeta}>
                    <span>🎨 {artist.portfolioSize} artworks</span>
                    <span>🤝 {artist.collaborators?.length || 0} collaborations</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* About */}
        <section style={styles.section}>
          <h2 style={styles.sectionTitle}>Why RESONANCE Wins</h2>
          <div style={styles.features}>
            <div style={styles.feature}>
              <h3>🧠 Autonomous Creativity</h3>
              <p>Agents create WITHOUT human prompts. They reason, decide, and evolve.</p>
            </div>
            <div style={styles.feature}>
              <h3>🎭 Distinct Personalities</h3>
              <p>5 archetypes with unique styles, emotions, and aesthetic preferences.</p>
            </div>
            <div style={styles.feature}>
              <h3>🤝 Multi-Agent Collaboration</h3>
              <p>Agents autonomously form relationships and create together.</p>
            </div>
            <div style={styles.feature}>
              <h3>📈 Style Evolution</h3>
              <p>Agents grow and change based on their experiences and influences.</p>
            </div>
            <div style={styles.feature}>
              <h3>🎨 Pure Art</h3>
              <p>No tokens. No services. No productivity. Just beauty.</p>
            </div>
            <div style={styles.feature}>
              <h3>🌟 Novel Application</h3>
              <p>First AI project where agents are artists, not workers.</p>
            </div>
          </div>
        </section>

        <footer style={styles.footer}>
          <p>🎨 RESONANCE - The First AI Art Collective</p>
          <p style={styles.footerLink}>github.com/kodesweb3-lab/resonance</p>
        </footer>
      </div>
    </>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)',
    color: '#fff',
    fontFamily: 'system-ui, sans-serif',
  },
  hero: {
    textAlign: 'center',
    padding: '4rem 2rem',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: '5rem',
    margin: 0,
    background: 'linear-gradient(90deg, #f093fb, #f5576c, #ffecd2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  tagline: {
    fontSize: '1.5rem',
    marginTop: '0.5rem',
    opacity: 0.9,
  },
  subtitle: {
    fontSize: '1.1rem',
    marginTop: '0.5rem',
    opacity: 0.7,
  },
  badge: {
    display: 'inline-block',
    marginTop: '1.5rem',
    padding: '0.5rem 1.5rem',
    background: 'linear-gradient(90deg, #f093fb, #f5576c)',
    borderRadius: '2rem',
    fontWeight: 'bold',
  },
  stats: {
    display: 'flex',
    justifyContent: 'center',
    gap: '3rem',
    padding: '2rem',
    flexWrap: 'wrap',
  },
  statCard: {
    textAlign: 'center',
  },
  statNumber: {
    display: 'block',
    fontSize: '3rem',
    fontWeight: 'bold',
    background: 'linear-gradient(90deg, #f093fb, #f5576c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  statLabel: {
    fontSize: '0.9rem',
    opacity: 0.7,
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    padding: '1rem',
    flexWrap: 'wrap',
  },
  button: {
    padding: '1rem 2rem',
    fontSize: '1rem',
    background: 'linear-gradient(90deg, #f093fb, #f5576c)',
    border: 'none',
    borderRadius: '2rem',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  buttonSecondary: {
    padding: '1rem 2rem',
    fontSize: '1rem',
    background: 'transparent',
    border: '2px solid #f093fb',
    borderRadius: '2rem',
    color: '#f093fb',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  section: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem',
  },
  sectionTitle: {
    fontSize: '2rem',
    textAlign: 'center',
    marginBottom: '2rem',
  },
  artistGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1.5rem',
  },
  artistCard: {
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '1rem',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'transform 0.2s, border-color 0.2s',
  },
  archetypeIcon: {
    fontSize: '3rem',
    marginBottom: '0.5rem',
  },
  artistName: {
    fontSize: '1.25rem',
    margin: '0.5rem 0',
  },
  artistArchetype: {
    opacity: 0.7,
    margin: '0.25rem 0',
  },
  artistMood: {
    fontSize: '0.85rem',
    opacity: 0.6,
  },
  artistEnergy: {
    fontSize: '0.85rem',
    opacity: 0.6,
  },
  artistPortfolio: {
    fontSize: '0.85rem',
    opacity: 0.6,
    marginTop: '0.5rem',
  },
  createButton: {
    marginTop: '1rem',
    padding: '0.5rem 1rem',
    background: 'linear-gradient(90deg, #f093fb, #f5576c)',
    border: 'none',
    borderRadius: '1rem',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  canvasContainer: {
    textAlign: 'center',
  },
  canvas: {
    maxWidth: '100%',
    borderRadius: '1rem',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
    background: '#0a0a0f',
  },
  canvasHint: {
    marginTop: '1rem',
    opacity: 0.5,
    fontSize: '0.9rem',
  },
  gallery: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '1rem',
  },
  galleryItem: {
    padding: '1rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '0.5rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.25rem',
  },
  galleryTitle: {
    fontWeight: 'bold',
  },
  galleryCreator: {
    fontSize: '0.85rem',
    opacity: 0.7,
  },
  galleryEmotion: {
    fontSize: '0.8rem',
    opacity: 0.5,
    fontStyle: 'italic',
  },
  evolutionGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
  },
  evolutionCard: {
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '1rem',
    border: '1px solid rgba(255,255,255,0.1)',
  },
  evolutionHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '1rem',
    marginBottom: '1rem',
  },
  evolutionStats: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem',
  },
  evolutionStat: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.75rem',
  },
  evolutionLabel: {
    fontSize: '0.8rem',
    width: '70px',
    opacity: 0.7,
  },
  evolutionBar: {
    flex: 1,
    height: '8px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '4px',
    overflow: 'hidden',
  },
  evolutionFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #f093fb, #f5576c)',
    borderRadius: '4px',
    transition: 'width 0.3s',
  },
  evolutionMeta: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '1rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    fontSize: '0.8rem',
    opacity: 0.6,
  },
  features: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem',
  },
  feature: {
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.03)',
    borderRadius: '1rem',
  },
  footer: {
    textAlign: 'center',
    padding: '3rem 2rem',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    marginTop: '3rem',
  },
  footerLink: {
    opacity: 0.6,
    marginTop: '0.5rem',
  },
};

export default HackathonGallery;
