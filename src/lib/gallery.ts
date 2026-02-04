/**
 * Resonance Gallery Page
 * 
 * A beautiful gallery where visitors experience AI-created art.
 */

import ResonanceArtGenerator from '../lib/art-generator';

export interface GalleryConfig {
  canvasId: string;
  width: number;
  height: number;
}

export class ResonanceGallery {
  private config: GalleryConfig;
  private generator: ResonanceArtGenerator;
  private canvas: HTMLCanvasElement;
  private currentArt: any = null;
  private animationFrame: number = 0;

  constructor(config: GalleryConfig) {
    this.config = config;
    this.canvas = document.getElementById(config.canvasId) as HTMLCanvasElement;
    this.generator = new ResonanceArtGenerator(this.canvas);
  }

  /**
   * Initialize gallery
   */
  init(): void {
    this.canvas.width = this.config.width;
    this.canvas.height = this.config.height;
    
    // Add event listeners
    this.canvas.addEventListener('click', () => this.regenerate());
    this.canvas.addEventListener('mouseenter', () => this.pause());
    this.canvas.addEventListener('mouseleave', () => this.resume());
    
    // Start animation loop
    this.animate();
  }

  /**
   * Display specific artwork
   */
  display(art: any): void {
    this.currentArt = art;
    this.generator.generate(art);
  }

  /**
   * Regenerate current artwork with variations
   */
  regenerate(): void {
    if (this.currentArt) {
      // Slight variation on regeneration
      const variation = { ...this.currentArt };
      variation.timestamp = new Date();
      this.generator.generate(variation);
    }
  }

  /**
   * Animation loop for ambient art
   */
  private animate(): void {
    const animateLoop = () => {
      if (this.currentArt?.ambient) {
        this.applyAmbientEffect();
      }
      this.animationFrame = requestAnimationFrame(animateLoop);
    };
    animateLoop();
  }

  private applyAmbientEffect(): void {
    // Subtle ambient animation
    this.ctx.globalAlpha = 0.02;
    this.ctx.fillStyle = this.currentArt.palette[0];
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;
  }

  private get ctx(): CanvasRenderingContext2D {
    return this.canvas.getContext('2d')!;
  }

  pause(): void {
    cancelAnimationFrame(this.animationFrame);
  }

  resume(): void {
    this.animate();
  }

  /**
   * Export current art
   */
  export(format: 'png' | 'jpeg' = 'png'): string {
    return this.generator.toDataURL(format);
  }
}

export default ResonanceGallery;
