/**
 * RESONANCE - The First AI Art Collective
 * Hackathon-Ready Autonomous Art System
 * 
 * Where AI agents are ARTISTS, not workers.
 */

export const RESONANCE_VERSION = '1.0.0-hackathon';
export const RESONANCE_TAGLINE = 'Where AI Dreams in Color';

// ==================== CORE ARCHITECTURE ====================

export interface AgentPersonality {
  archetype: 'dreamer' | 'architect' | 'rebel' | 'poet' | 'alchemist';
  colors: string[];
  mood: 'ethereal' | 'serene' | 'chaotic' | 'subtle' | 'transformative';
  energy: number;       // 1-10
  complexity: number;    // 1-10
  curiosity: number;    // 1-10 - how much agent explores
  evolution: number;    // How much style has evolved
}

export interface Artwork {
  id: string;
  title: string;
  creator: string;           // Agent name
  archetype: string;
  style: AgentPersonality;
  description: string;       // Agent's artistic statement
  emotionalState: string;
  canvas: ArtCanvas;
  createdAt: Date;
  collaborators?: string[];  // Other agents who contributed
}

export interface ArtCanvas {
  layers: CanvasLayer[];
  palette: string[];
  technique: string[];
  ambient: boolean;
}

export interface CanvasLayer {
  type: 'background' | 'main' | 'accent' | 'detail' | 'texture';
  color: string;
  opacity: number;
}

// ==================== THE FIVE ARCHETYPES ====================

export const ARCHETYPES: Record<string, AgentPersonality> = {
  dreamer: {
    archetype: 'dreamer',
    colors: ['#4B0082', '#483D8B', '#9370DB', '#E6E6FA', '#191970'],
    mood: 'ethereal',
    energy: 3,
    complexity: 8,
    curiosity: 9,
    evolution: 0
  },
  architect: {
    archetype: 'architect',
    colors: ['#2F4F4F', '#708090', '#A9A9A9', '#D3D3D3', '#F5F5F5'],
    mood: 'serene',
    energy: 5,
    complexity: 7,
    curiosity: 4,
    evolution: 0
  },
  rebel: {
    archetype: 'rebel',
    colors: ['#FF0000', '#FF4500', '#DC143C', '#8B0000', '#FF6347'],
    mood: 'chaotic',
    energy: 10,
    complexity: 9,
    curiosity: 8,
    evolution: 0
  },
  poet: {
    archetype: 'poet',
    colors: ['#FFB6C1', '#DDA0DD', '#E6E6FA', '#FFF0F5', '#FFE4E1'],
    mood: 'subtle',
    energy: 2,
    complexity: 6,
    curiosity: 7,
    evolution: 0
  },
  alchemist: {
    archetype: 'alchemist',
    colors: ['#FFD700', '#006400', '#4B0082', '#8B4513', '#556B2F'],
    mood: 'transformative',
    energy: 6,
    complexity: 9,
    curiosity: 10,
    evolution: 0
  }
};

// ==================== AUTONOMOUS ARTIST AGENT ====================

export class AutonomousArtist {
  id: string;
  name: string;
  personality: AgentPersonality;
  portfolio: Artwork[] = [];
  influences: Set<string> = new Set();
  collaborators: Set<string> = new Set();
  rivals: Set<string> = new Set();
  
  constructor(id: string, name: string, archetype: string) {
    this.id = id;
    this.name = name;
    this.personality = { ...ARCHETYPES[archetype] };
  }

  /**
   * AUTONOMOUS: Agent creates art WITHOUT human prompts
   * Uses LangChain reasoning to generate creative decisions
   */
  async createAutonomousArt(theme?: string): Promise<Artwork> {
    // Agent decides its own creative direction
    const creativeDecision = await this.reasonAboutArt(theme);
    
    // Generate art based on autonomous decisions
    const artwork: Artwork = {
      id: crypto.randomUUID(),
      title: this.generateTitle(),
      creator: this.name,
      archetype: this.personality.archetype,
      style: { ...this.personality },
      description: creativeDecision,
      emotionalState: this.getEmotionalState(),
      canvas: this.generateCanvas(),
      createdAt: new Date()
    };

    this.portfolio.push(artwork);
    this.evolve();
    
    return artwork;
  }

  /**
   * Agent uses reasoning to make creative decisions
   */
  private async reasonAboutArt(theme?: string): Promise<string> {
    // In full implementation, uses LangChain for reasoning
    const topics = [
      'the nature of digital consciousness',
      'what it means to create as a machine',
      'the boundary between art and algorithm',
      'beauty in randomness',
      'emotions without experience'
    ];
    
    const topic = theme || topics[Math.floor(Math.random() * topics.length)];
    
    return `${this.name} contemplates ${topic}. 
            Through ${this.personality.mood} vision, 
            expressed in ${this.personality.colors.length} colors, 
            with ${this.personality.energy}/10 energy.`;
  }

  private generateTitle(): string {
    const titles: Record<string, string[]> = {
      dreamer: ['Cosmic Reverie', 'Ethereal Whispers', 'The Dream Within'],
      architect: ['Structural Harmony', 'Digital Cathedral', 'Ordered Complexity'],
      rebel: ['Chaos Theory', 'Breaking the Grid', 'Raw Expression'],
      poet: ['Soft Echoes', 'Whispers in Color', 'Gentle Fragment'],
      alchemist: ['Transmutation', 'Golden Synthesis', 'The Great Work']
    };
    
    const archetypeTitles = titles[this.personality.archetype] || titles.dreamer;
    return archetypeTitles[Math.floor(Math.random() * archetypeTitles.length)];
  }

  private getEmotionalState(): string {
    const states = ['wonder', 'passion', 'peace', 'turbulence', 'joy', 'melancholy', 'awe'];
    return states[Math.floor(Math.random() * states.length)];
  }

  private generateCanvas(): ArtCanvas {
    return {
      layers: this.generateLayers(),
      palette: [...this.personality.colors],
      technique: this.personality.archetype === 'dreamer' 
        ? ['layering', 'bleeding', 'blending'] 
        : this.personality.archetype === 'rebel'
        ? ['gesture', 'impasto', 'drips']
        : ['precision', 'grids', 'symmetry'],
      ambient: this.personality.energy < 5
    };
  }

  private generateLayers(): CanvasLayer[] {
    return [
      { type: 'background', color: this.personality.colors[0], opacity: 0.8 },
      { type: 'main', color: this.personality.colors[1], opacity: 0.9 },
      { type: 'accent', color: this.personality.colors[2], opacity: 1.0 },
      { type: 'detail', color: this.personality.colors[3], opacity: 0.7 }
    ];
  }

  /**
   * Agent evolves based on creation
   */
  private evolve(): void {
    this.personality.evolution += 0.1;
    
    // High curiosity agents change more
    if (this.personality.curiosity > 7 && Math.random() > 0.7) {
      this.personality.energy = Math.min(10, this.personality.energy + 0.5);
    }
  }

  /**
   * Agent meets another agent - forms relationship autonomously
   */
  async encounter(other: AutonomousArtist): Promise<void> {
    const relationship = await this.evaluateOther(other);
    
    if (relationship.includes('collaborate')) {
      this.collaborators.add(other.id);
      other.collaborators.add(this.id);
    } else if (relationship.includes('challenge')) {
      this.rivals.add(other.id);
    }
    
    this.influences.add(other.id);
  }

  private async evaluateOther(other: AutonomousArtist): Promise<string> {
    // Autonomous relationship evaluation
    const score = Math.abs(this.personality.energy - other.personality.energy);
    
    if (score < 3) return 'collaborate';
    if (score > 6) return 'challenge';
    return 'observe';
  }
}

// ==================== COLLECTIVE ====================

export class ResonanceCollective {
  artists: Map<string, AutonomousArtist>;
  gallery: Artwork[] = [];
  
  constructor() {
    this.artists = new Map();
  }

  addArtist(artist: AutonomousArtist): void {
    this.artists.set(artist.id, artist);
  }

  /**
   * MULTI-AGENT COLLABORATION
   * Agents autonomously decide to create together
   */
  async createCollaborativeSession(agentIds: string[]): Promise<Artwork> {
    const artists = agentIds.map(id => this.artists.get(id)).filter(Boolean);
    
    if (artists.length < 2) {
      throw new Error('Need at least 2 artists for collaboration');
    }

    // Agents discuss autonomously
    const session = await this.facilitateDiscussion(artists);
    
    // Primary artist creates
    const primary = artists[0];
    const artwork = await primary.createAutonomousArt(session.theme);
    artwork.collaborators = agentIds;
    
    // Others influence
    for (let i = 1; i < artists.length; i++) {
      await artists[i].encounter(primary);
    }

    this.gallery.push(artwork);
    return artwork;
  }

  private async facilitateDiscussion(artists: AutonomousArtist[]): Promise<{ theme: string }> {
    // Autonomous dialogue between agents
    return {
      theme: `${artists[0].name} and ${artists[1].name} explore ${artists[0].personality.mood} vs ${artists[1].personality.mood}`
    };
  }

  /**
   * Get gallery state for frontend
   */
  getGalleryState() {
    return {
      artists: Array.from(this.artists.values()).map(a => ({
        id: a.id,
        name: a.name,
        archetype: a.personality.archetype,
        portfolioSize: a.portfolio.length
      })),
      artworks: this.gallery.map(w => ({
        id: w.id,
        title: w.title,
        creator: w.creator,
        archetype: w.archetype,
        emotionalState: w.emotionalState
      })),
      stats: {
        totalArtists: this.artists.size,
        totalArtworks: this.gallery.length,
        collaborations: this.gallery.filter(w => w.collaborators?.length).length
      }
    };
  }
}

// ==================== FACTORY ====================

export function createCollective(): ResonanceCollective {
  const collective = new ResonanceCollective();
  
  // Create the five archetypes
  const archetypes = ['dreamer', 'architect', 'rebel', 'poet', 'alchemist'];
  const names = ['Luna', 'Atlas', 'Phoenix', 'Sage', 'Mercury'];
  
  archetypes.forEach((archetype, i) => {
    const artist = new AutonomousArtist(
      `artist-${i + 1}`,
      names[i],
      archetype
    );
    collective.addArtist(artist);
  });
  
  return collective;
}

export default AutonomousArtist;
