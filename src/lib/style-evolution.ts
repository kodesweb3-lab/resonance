/**
 * RESONANCE - Style Evolution Engine
 * 
 * Agents evolve their artistic style based on:
 * - Artwork creation experiences
 * - Collaborations with other agents
 * - Aesthetic reflections
 * - External influences (other art, artists)
 */

import { AutonomousArtist, AgentPersonality } from './resonance-core';

export interface EvolutionEvent {
  type: 'creation' | 'collaboration' | 'reflection' | 'influence';
  trigger: string;
  changes: Partial<AgentPersonality>;
  timestamp: Date;
}

export class StyleEvolutionEngine {
  private artist: AutonomousArtist;
  private history: EvolutionEvent[] = [];

  constructor(artist: AutonomousArtist) {
    this.artist = artist;
  }

  /**
   * Process an evolution event and update personality
   */
  processEvent(type: EvolutionEvent['type'], trigger: string, changes: Partial<AgentPersonality>): void {
    const event: EvolutionEvent = {
      type,
      trigger,
      changes,
      timestamp: new Date()
    };

    this.history.push(event);
    this.applyChanges(changes);
    this.artist.personality.evolution += 0.1;
  }

  /**
   * Apply gradual personality changes
   */
  private applyChanges(changes: Partial<AgentPersonality>): void {
    const p = this.artist.personality;

    if (changes.energy) {
      // Gradual change (max 0.5 per event)
      p.energy = Math.max(1, Math.min(10, p.energy + (changes.energy > 0 ? 0.3 : -0.3)));
    }

    if (changes.complexity) {
      p.complexity = Math.max(1, Math.min(10, p.complexity + (Math.random() - 0.5) * 0.4));
    }

    if (changes.curiosity) {
      // High curiosity agents become more curious
      if (p.curiosity < 10 && Math.random() > 0.6) {
        p.curiosity = Math.min(10, p.curiosity + 0.2);
      }
    }

    if (changes.colors) {
      // Agents might adopt new colors from influences
      if (Math.random() > 0.7) {
        const newColor = changes.colors[Math.floor(Math.random() * changes.colors.length)];
        if (!p.colors.includes(newColor)) {
          p.colors.push(newColor);
          if (p.colors.length > 6) p.colors.shift(); // Keep max 6 colors
        }
      }
    }
  }

  /**
   * Agent reflects on their evolution
   */
  async reflectOnEvolution(): Promise<string> {
    const events = this.history.slice(-10);
    
    const energyChange = events.filter(e => e.changes.energy).length;
    const complexityAvg = events.reduce((sum, e) => sum + (e.changes.complexity || 5), 0) / Math.max(events.length, 1);
    const collaborationCount = events.filter(e => e.type === 'collaboration').length;

    return `${this.artist.name}'s style has evolved:
    - Energy shifts: ${energyChange} times
    - Complexity average: ${complexityAvg.toFixed(1)}/10
    - Collaborations: ${collaborationCount}
    
    The artist is ${this.artist.personality.energy > 6 ? 'becoming more dynamic' : 'finding inner peace'}.
    ${this.artist.personality.curiosity > 7 ? 'Curiosity drives exploration.' : 'Focus deepens.'}`;
  }

  /**
   * Get evolution statistics
   */
  getStats(): {
    totalEvents: number;
    creations: number;
    collaborations: number;
    avgEnergy: number;
    evolutionScore: number;
  } {
    const events = this.history;
    
    return {
      totalEvents: events.length,
      creations: events.filter(e => e.type === 'creation').length,
      collaborations: events.filter(e => e.type === 'collaboration').length,
      avgEnergy: events.reduce((sum, e) => sum + (e.changes.energy || 0), 0) / Math.max(events.length, 1),
      evolutionScore: this.artist.personality.evolution
    };
  }

  /**
   * Get evolution timeline
   */
  getTimeline(): EvolutionEvent[] {
    return [...this.history];
  }
}

/**
 * Influence Network - Tracks how agents influence each other
 */
export class InfluenceNetwork {
  private influences: Map<string, { strength: number; events: number }> = new Map();

  addInfluence(agentId: string, strength: number): void {
    const current = this.influences.get(agentId);
    if (current) {
      current.strength = Math.min(1, current.strength + strength * 0.1);
      current.events++;
    } else {
      this.influences.set(agentId, { strength, events: 1 });
    }
  }

  getTopInfluences(limit: number = 3): Array<{ agentId: string; strength: number; events: number }> {
    return Array.from(this.influences.entries())
      .map(([agentId, data]) => ({ agentId, ...data }))
      .sort((a, b) => b.strength - a.strength)
      .slice(0, limit);
  }

  getNetworkVisualization(): string {
    const top = this.getTopInfluences(5);
    return top.map(({ agentId, strength }) => 
      `${agentId}: ${'█'.repeat(Math.floor(strength * 10))} ${(strength * 100).toFixed(0)}%`
    ).join('\n');
  }
}

export default StyleEvolutionEngine;
