#!/usr/bin/env node

/**
 * Create a new Resonance Artist Agent
 */

const fs = require('fs');
const path = require('path');

const archetypes = ['dreamer', 'architect', 'rebel', 'poet', 'alchemist'];

function createAgent(name, archetype) {
  if (!archetypes.includes(archetype)) {
    console.error(`Invalid archetype: ${archetype}`);
    console.log('Available:', archetypes.join(', '));
    process.exit(1);
  }

  const template = `/**
 * ${name} - ${archetype.charAt(0).toUpperCase() + archetype.slice(1)} Artist
 * 
 * Auto-generated artist agent for Resonance Collective
 */

import { ResonanceArtist } from '../agents/artist-agent';

const ${name.toLowerCase().replace(/\s/g, '')} = new ResonanceArtist(
  '${name.toLowerCase().replace(/\s/g, '-')}',
  '${name}',
  '${archetype}'
);

export default ${name.toLowerCase().replace(/\s/g, '')};
`;

  const filePath = `src/agents/${name.toLowerCase().replace(/\s/g, '-')}.ts`;
  fs.writeFileSync(filePath, template);
  console.log(`✅ Created ${name} (${archetype}) at ${filePath}`);
}

const args = process.argv.slice(2);
const name = args[0];
const archetype = args[1] || 'dreamer';

if (!name) {
  console.log('Usage: node scripts/create-agent.js "Agent Name" [archetype]');
  console.log('Archetypes:', archetypes.join(', '));
  process.exit(1);
}

createAgent(name, archetype);
