/**
 * RESONANCE Database Seed Script
 * 
 * Run this to initialize the database with default artists:
 * 
 * npx prisma db push
 * npx ts-node scripts/seed.ts
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const artists = [
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

async function main() {
  console.log('🎨 Seeding RESONANCE database...');
  
  // Clear existing data
  await prisma.influenceEvent.deleteMany();
  await prisma.collaboration.deleteMany();
  await prisma.artwork.deleteMany();
  await prisma.artist.deleteMany();
  
  console.log('✅ Cleared existing data');
  
  // Create artists
  await prisma.artist.createMany({
    data: artists
  });
  
  console.log('✅ Created 5 artist archetypes');
  
  // Verify
  const count = await prisma.artist.count();
  console.log(`\n🎉 Database seeded! ${count} artists ready.\n`);
  
  console.log('The Five Archetypes:');
  for (const artist of artists) {
    console.log(`  🌟 ${artist.name} - The ${artist.archetype}`);
  }
  
  console.log('\n📝 Next steps:');
  console.log('  1. Start the app: npm run dev');
  console.log('  2. Visit: http://localhost:3000');
  console.log('  3. Artists are ready to create art!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
