/**
 * Resonance Art Generator
 * 
 * Generates visual art based on artist style and creative prompts.
 * Uses HTML5 Canvas for rendering.
 */

export interface ArtLayer {
  type: 'background' | 'main' | 'accent' | 'detail' | 'texture';
  color: string;
  opacity: number;
  parameters?: Record<string, any>;
}

export interface VisualArt {
  id: string;
  layers: ArtLayer[];
  palette: string[];
  style: {
    mood: string;
    energy: number;
    complexity: number;
  };
  description: string;
  timestamp: Date;
}

export class ResonanceArtGenerator {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  /**
   * Generate and render art from parameters
   */
  async generate(art: VisualArt): Promise<void> {
    // Clear canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Render each layer
    for (const layer of art.layers) {
      await this.renderLayer(layer, art);
    }

    // Add finishing touches based on style
    this.applyStyleFinishing(art.style);
  }

  /**
   * Render individual layer
   */
  private async renderLayer(layer: ArtLayer, art: VisualArt): Promise<void> {
    this.ctx.globalAlpha = layer.opacity;

    switch (layer.type) {
      case 'background':
        this.renderBackground(layer, art);
        break;
      case 'main':
        this.renderMainForms(layer, art);
        break;
      case 'accent':
        this.renderAccents(layer, art);
        break;
      case 'detail':
        this.renderDetails(layer, art);
        break;
      case 'texture':
        this.renderTexture(layer, art);
        break;
    }

    this.ctx.globalAlpha = 1.0;
  }

  private renderBackground(layer: ArtLayer, art: VisualArt): void {
    const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
    gradient.addColorStop(0, layer.color);
    gradient.addColorStop(1, this.adjustColor(layer.color, -20));
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private renderMainForms(layer: ArtLayer, art: VisualArt): void {
    const count = Math.floor(art.style.complexity * 2);
    
    for (let i = 0; i < count; i++) {
      this.ctx.fillStyle = layer.color;
      
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const size = Math.random() * 200 + 50;
      
      this.drawOrganicForm(x, y, size, art.style.energy);
    }
  }

  private renderAccents(layer: ArtLayer, art: VisualArt): void {
    const count = Math.floor(art.style.complexity);
    
    for (let i = 0; i < count; i++) {
      this.ctx.strokeStyle = layer.color;
      this.ctx.lineWidth = Math.random() * 3 + 1;
      
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      
      this.drawGestureStroke(x, y, art.style.energy);
    }
  }

  private renderDetails(layer: ArtLayer, art: VisualArt): void {
    const count = Math.floor(art.style.complexity * 3);
    
    for (let i = 0; i < count; i++) {
      this.ctx.fillStyle = layer.color;
      
      const x = Math.random() * this.canvas.width;
      const y = Math.random() * this.canvas.height;
      const size = Math.random() * 10 + 2;
      
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();
    }
  }

  private renderTexture(layer: ArtLayer, art: VisualArt): void {
    // Add noise/texture
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 20;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    
    this.ctx.putImageData(imageData, 0, 0);
  }

  private drawOrganicForm(x: number, y: number, size: number, energy: number): void {
    const points: { x: number; y: number }[] = [];
    const segments = Math.floor(energy * 3);
    
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * Math.PI * 2;
      const variance = (Math.random() - 0.5) * size * 0.5;
      const radius = size / 2 + variance;
      
      points.push({
        x: x + Math.cos(angle) * radius,
        y: y + Math.sin(angle) * radius
      });
    }

    this.ctx.beginPath();
    this.ctx.moveTo(points[0].x, points[0].y);
    
    for (let i = 1; i < points.length; i++) {
      const xc = (points[i].x + points[i - 1].x) / 2;
      const yc = (points[i].y + points[i - 1].y) / 2;
      this.ctx.quadraticCurveTo(points[i - 1].x, points[i - 1].y, xc, yc);
    }
    
    this.ctx.closePath();
    this.ctx.fill();
  }

  private drawGestureStroke(x: number, y: number, energy: number): void {
    this.ctx.beginPath();
    this.ctx.moveTo(x, y);
    
    const length = energy * 30;
    const angle = Math.random() * Math.PI * 2;
    
    this.ctx.lineTo(
      x + Math.cos(angle) * length,
      y + Math.sin(angle) * length
    );
    
    this.ctx.stroke();
  }

  private applyStyleFinishing(style: { mood: string; energy: number }): void {
    // Vignette effect
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2, this.canvas.height / 2, this.canvas.width
    );
    
    if (style.mood === 'ethereal' || style.mood === 'serene') {
      gradient.addColorStop(0, 'rgba(255,255,255,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.3)');
    } else {
      gradient.addColorStop(0, 'rgba(0,0,0,0)');
      gradient.addColorStop(1, 'rgba(0,0,0,0.5)');
    }
    
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private adjustColor(color: string, amount: number): string {
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) + amount));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) + amount));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) + amount));
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  /**
   * Export art as image
   */
  toDataURL(format: 'png' | 'jpeg' = 'png'): string {
    return this.canvas.toDataURL(`image/${format}`);
  }
}

export default ResonanceArtGenerator;
