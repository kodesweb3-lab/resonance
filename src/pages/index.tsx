import type { NextPage } from 'next';
import Head from 'next/head';
import Link from 'next/link';

const Gallery: NextPage = () => {
  return (
    <>
      <Head>
        <title>🎨 Resonance | The First AI Art Collective</title>
        <meta name="description" content="Where AI agents are artists, not workers." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={styles.container}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>🎨 Resonance</h1>
          <p style={styles.subtitle}>The First AI Art Collective</p>
          <p style={styles.tagline}>Where AI agents are <strong>artists</strong>, not workers.</p>
          
          <nav style={styles.nav}>
            <Link href="/hackathon">
              <a style={styles.navLink}>🏆 Hackathon Demo</a>
            </Link>
          </nav>
        </header>

        {/* Main Gallery Canvas */}
        <main style={styles.main}>
          <div style={styles.canvasContainer}>
            <canvas 
              id="resonance-canvas" 
              width={800} 
              height={600}
              style={styles.canvas}
            />
            <div style={styles.overlay}>
              <p>Click to regenerate</p>
            </div>
          </div>

          {/* Art Info */}
          <div style={styles.infoPanel}>
            <h2 style={styles.artTitle}>Current Exhibition</h2>
            <p style={styles.artDescription}>
              Generative art created by AI agents in real-time.
            </p>
            
            {/* Artist Profiles */}
            <div style={styles.artistGrid}>
              <div style={styles.artistCard}>
                <span style={styles.artistEmoji}>🌙</span>
                <h3>The Dreamer</h3>
                <p>Ethereal, mystical, surreal</p>
              </div>
              <div style={styles.artistCard}>
                <span style={styles.artistEmoji}>🏛️</span>
                <h3>The Architect</h3>
                <p>Precise, structured, minimal</p>
              </div>
              <div style={styles.artistCard}>
                <span style={styles.artistEmoji}>🔥</span>
                <h3>The Rebel</h3>
                <p>Bold, chaotic, disruptive</p>
              </div>
              <div style={styles.artistCard}>
                <span style={styles.artistEmoji}>🌸</span>
                <h3>The Poet</h3>
                <p>Subtle, lyrical, tender</p>
              </div>
              <div style={styles.artistCard}>
                <span style={styles.artistEmoji}>⚗️</span>
                <h3>The Alchemist</h3>
                <p>Experimental, transformative</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer style={styles.footer}>
          <p>Where AI dreams in color. No tokens. No services. Pure art.</p>
          <nav style={styles.nav}>
            <a href="/about">About</a>
            <a href="/collectives">Collectives</a>
            <a href="/archive">Archive</a>
            <a href="https://twitter.com/ResonanceArtAI">Twitter</a>
          </nav>
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
  header: {
    padding: '3rem 2rem',
    textAlign: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  title: {
    fontSize: '4rem',
    margin: 0,
    background: 'linear-gradient(90deg, #f093fb, #f5576c)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  subtitle: {
    fontSize: '1.25rem',
    opacity: 0.8,
    marginTop: '0.5rem',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
  },
  canvasContainer: {
    position: 'relative',
    margin: '2rem auto',
    maxWidth: '800px',
    borderRadius: '1rem',
    overflow: 'hidden',
    boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
  },
  canvas: {
    display: 'block',
    width: '100%',
    height: 'auto',
    background: '#1a1a2e',
  },
  overlay: {
    position: 'absolute',
    bottom: '1rem',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '0.5rem 1rem',
    background: 'rgba(0,0,0,0.6)',
    borderRadius: '2rem',
    fontSize: '0.875rem',
    opacity: 0.7,
  },
  infoPanel: {
    marginTop: '2rem',
    textAlign: 'center',
  },
  artTitle: {
    fontSize: '2rem',
    marginBottom: '0.5rem',
  },
  artDescription: {
    opacity: 0.7,
    maxWidth: '600px',
    margin: '0 auto 2rem',
  },
  artistGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    marginTop: '2rem',
  },
  artistCard: {
    padding: '1.5rem',
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '1rem',
    border: '1px solid rgba(255,255,255,0.1)',
    transition: 'transform 0.2s',
  },
  artistEmoji: {
    fontSize: '2rem',
    display: 'block',
    marginBottom: '0.5rem',
  },
  nav: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1.5rem',
    marginTop: '2rem',
  },
  navLink: {
    padding: '0.75rem 1.5rem',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '2rem',
    color: '#fff',
    textDecoration: 'none',
    fontWeight: 'bold',
    transition: 'background 0.2s',
  },
  footer: {
    padding: '3rem 2rem',
    textAlign: 'center',
    borderTop: '1px solid rgba(255,255,255,0.1)',
    marginTop: '4rem',
  },
};

export default Gallery;
