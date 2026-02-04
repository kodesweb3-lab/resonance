/**
 * RESONANCE - Advanced Canvas Renderer
 * 
 * Generates beautiful artwork based on agent personality and art parameters.
 * Features organic shapes, color blending, and style-consistent rendering.
 */

export interface RenderConfig {
  width: number;
  height: number;
  style: {
    archetype: string;
    colors: string[];
    mood: string;
    energy: number;
    complexity: number;
  };
  title?: string;
  artist?: string;
}

export class ResonanceCanvasRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
  }

  /**
   * Main render function
   */
  async render(config: RenderConfig): Promise<void> {
    const { width, height } = config;
    
    // Set canvas size
    this.canvas.width = width;
    this.canvas.height = height;

    // Clear
    this.ctx.fillStyle = '#0a0a0f';
    this.ctx.fillRect(0, 0, width, height);

    // Render layers based on archetype
    switch (config.style.archetype) {
      case 'dreamer':
        this.renderDreamerStyle(config);
        break;
      case 'architect':
        this.renderArchitectStyle(config);
        break;
      case 'rebel':
        this.renderRebelStyle(config);
        break;
      case 'poet':
        this.renderPoetStyle(config);
        break;
      case 'alchemist':
        this.renderAlchemistStyle(config);
        break;
      default:
        this.renderDreamerStyle(config);
    }

    // Add texture overlay
    this.addTexture(config.style.mood);

    // Add title if provided
    if (config.title) {
      this.addTitle(config.title, config.artist);
    }
  }

  /**
   * Dreamer Style - Ethereal, layered, mystical
   */
  private renderDreamerStyle(config: RenderConfig): void {
    const { width, height, style } = config;
    const colors = style.colors;

    // Background gradient
    const bgGradient = this.ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, colors[0]);
    bgGradient.addColorStop(1, colors[colors.length - 1]);
    this.ctx.fillStyle = bgGradient;
    this.ctx.fillRect(0, 0, width, height);

    // Add mist layers
    for (let i = 0; i < 8; i++) {
      this.ctx.globalAlpha = 0.1 + Math.random() * 0.15;
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = 100 + Math.random() * 200;
      
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, colors[1]);
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Add stars/sparkles
    this.ctx.globalAlpha = 0.3 + Math.random() * 0.4;
    for (let i = 0; i < style.complexity * 5; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const size = 1 + Math.random() * 3;
      
      this.ctx.fillStyle = colors[2];
      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      this.ctx.fill();

      // Glow effect
      this.ctx.shadowColor = colors[2];
      this.ctx.shadowBlur = 10;
      this.ctx.fill();
      this.ctx.shadowBlur = 0;
    }

    this.ctx.globalAlpha = 1;
  }

  /**
   * Architect Style - Geometric, precise, structured
   */
  private renderArchitectStyle(config: RenderConfig): void {
    const { width, height, style } = config;
    const colors = style.colors;

    // Clean background
    this.ctx.fillStyle = colors[colors.length - 1];
    this.ctx.fillRect(0, 0, width, height);

    // Grid lines
    this.ctx.globalAlpha = 0.1;
    this.ctx.strokeStyle = colors[1];
    const gridSize = 40;

    for (let x = 0; x <= width; x += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, height);
      this.ctx.stroke();
    }
    for (let y = 0; y <= height; y += gridSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(width, y);
      this.ctx.stroke();
    }
    this.ctx.globalAlpha = 1;

    // Geometric shapes
    const shapeCount = Math.floor(style.complexity * 1.5);
    for (let i = 0; i < shapeCount; i++) {
      const x = Math.floor(Math.random() * (width / gridSize)) * gridSize;
      const y = Math.floor(Math.random() * (height / gridSize)) * gridSize;
      const size = gridSize * (1 + Math.floor(Math.random() * 3));
      
      this.ctx.fillStyle = colors[Math.floor(Math.random() * (colors.length - 1))];
      this.ctx.globalAlpha = 0.7;
      this.ctx.fillRect(x, y, size, size);
      
      this.ctx.strokeStyle = colors[0];
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(x, y, size, size);
    }
    this.ctx.globalAlpha = 1;
  }

  /**
   * Rebel Style - Chaotic, gestural, bold
   */
  private renderRebelStyle(config: RenderConfig): void {
    const { width, height, style } = config;
    const colors = style.colors;

    // Dark background
    this.ctx.fillStyle = '#0a0a0f';
    this.ctx.fillRect(0, 0, width, height);

    // Violent brushstrokes
    const strokeCount = style.energy * 3;
    for (let i = 0; i < strokeCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const length = style.complexity * 15 + 20;
      const angle = Math.random() * Math.PI * 2;
      
      this.ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
      this.ctx.lineWidth = 2 + Math.random() * 8;
      this.ctx.globalAlpha = 0.5 + Math.random() * 0.5;
      
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.lineTo(
        x + Math.cos(angle) * length,
        y + Math.sin(angle) * length
      );
      this.ctx.stroke();
    }

    // Paint drips
    for (let i = 0; i < 10; i++) {
      const x = Math.random() * width;
      const y = 0;
      const dripLength = 50 + Math.random() * 150;
      
      this.ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      this.ctx.globalAlpha = 0.8;
      
      this.ctx.beginPath();
      this.ctx.moveTo(x, y);
      this.ctx.bezierCurveTo(
        x + Math.random() * 20 - 10, y + dripLength * 0.5,
        x + Math.random() * 20 - 10, y + dripLength * 0.8,
        x, y + dripLength
      );
      this.ctx.lineTo(x + 5, y);
      this.ctx.closePath();
      this.ctx.fill();
    }

    this.ctx.globalAlpha = 1;
  }

  /**
   * Poet Style - Soft, delicate, lyrical
   */
  private renderPoetStyle(config: RenderConfig): void {
    const { width, height, style } = config;
    const colors = style.colors;

    // Soft gradient background
    const bgGradient = this.ctx.createLinearGradient(0, 0, width, height);
    bgGradient.addColorStop(0, colors[0]);
    bgGradient.addColorStop(0.5, colors[2]);
    bgGradient.addColorStop(1, colors[colors.length - 1]);
    this.ctx.fillStyle = bgGradient;
    this.ctx.fillRect(0, 0, width, height);

    // Soft circles/blobs
    const blobCount = Math.floor(style.complexity * 1.5);
    for (let i = 0; i < blobCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = 30 + Math.random() * 80;
      
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, colors[Math.floor(Math.random() * colors.length)]);
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.globalAlpha = 0.3;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Delicate lines
    for (let i = 0; i < 20; i++) {
      const x1 = Math.random() * width;
      const y1 = Math.random() * height;
      const x2 = x1 + (Math.random() - 0.5) * 100;
      const y2 = y1 + (Math.random() - 0.5) * 100;
      
      this.ctx.strokeStyle = colors[3];
      this.ctx.lineWidth = 1;
      this.ctx.globalAlpha = 0.4;
      this.ctx.beginPath();
      this.ctx.moveTo(x1, y1);
      this.ctx.quadraticCurveTo(
        (x1 + x2) / 2 + (Math.random() - 0.5) * 20,
        (y1 + y2) / 2 + (Math.random() - 0.5) * 20,
        x2, y2
      );
      this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1;
  }

  /**
   * Alchemist Style - Transformative, layered, alchemical
   */
  private renderAlchemistStyle(config: RenderConfig): void {
    const { width, height, style } = config;
    const colors = style.colors;

    // Dark mysterious background
    this.ctx.fillStyle = '#0a0a0f';
    this.ctx.fillRect(0, 0, width, height);

    // Metallic textures
    for (let i = 0; i < 5; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      const radius = 100 + Math.random() * 200;
      
      const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
      gradient.addColorStop(0, colors[0]); // Gold
      gradient.addColorStop(0.5, colors[1]); // Green
      gradient.addColorStop(1, 'transparent');
      
      this.ctx.fillStyle = gradient;
      this.ctx.globalAlpha = 0.3;
      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Transformation lines
    const lineCount = style.complexity * 2;
    for (let i = 0; i < lineCount; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      this.ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
      this.ctx.lineWidth = 1 + Math.random() * 3;
      this.ctx.globalAlpha = 0.6;
      
      // Spiraling transformation
      this.ctx.beginPath();
      for (let t = 0; t < Math.PI * 4; t += 0.1) {
        const r = 10 + t * 10;
        const px = x + Math.cos(t) * r;
        const py = y + Math.sin(t) * r;
        if (t === 0) {
          this.ctx.moveTo(px, py);
        } else {
          this.ctx.lineTo(px, py);
        }
      }
      this.ctx.stroke();
    }

    // Alchemical symbols (simplified)
    for (let i = 0; i < 3; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      
      this.ctx.strokeStyle = colors[0];
      this.ctx.lineWidth = 2;
      this.ctx.globalAlpha = 0.8;
      
      // Triangle (fire element)
      this.ctx.beginPath();
      this.ctx.moveTo(x, y - 30);
      this.ctx.lineTo(x - 25, y + 20);
      this.ctx.lineTo(x + 25, y + 20);
      this.ctx.closePath();
      this.ctx.stroke();
    }

    this.ctx.globalAlpha = 1;
  }

  /**
   * Add texture overlay based on mood
   */
  private addTexture(mood: string): void {
    const intensity = mood === 'chaotic' ? 0.15 : mood === 'serene' ? 0.05 : 0.08;
    
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 255 * intensity;
      data[i] = Math.min(255, Math.max(0, data[i] + noise));
      data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
      data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
    }
    
    this.ctx.putImageData(imageData, 0, 0);

    // Vignette
    const gradient = this.ctx.createRadialGradient(
      this.canvas.width / 2, this.canvas.height / 2, 0,
      this.canvas.width / 2, this.canvas.height / 2, this.canvas.width * 0.8
    );
    gradient.addColorStop(0, 'transparent');
    gradient.addColorStop(1, 'rgba(0,0,0,0.4)');
    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  /**
   * Add artwork title
   */
  private addTitle(title: string, artist?: string): void {
    this.ctx.fillStyle = '#fff';
    this.ctx.font = 'bold 28px serif';
    this.ctx.textAlign = 'center';
    this.ctx.shadowColor = 'rgba(0,0,0,0.8)';
    this.ctx.shadowBlur = 10;
    this.ctx.fillText(title, this.canvas.width / 2, this.canvas.height - 50);
    
    if (artist) {
      this.ctx.font = '16px sans-serif';
      this.ctx.globalAlpha = 0.7;
      this.ctx.fillText(`by ${artist}`, this.canvas.width / 2, this.canvas.height - 25);
    }
    this.ctx.shadowBlur = 0;
  }

  /**
   * Export as data URL
   */
  toDataURL(format: 'png' | 'jpeg' = 'png'): string {
    return this.canvas.toDataURL(`image/${format}`);
  }
}

export default ResonanceCanvasRenderer;
