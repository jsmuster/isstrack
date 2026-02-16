#!/usr/bin/env node
/**
 * Production build script
 * Ensures env-prod is used and generates env.js with production values
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Force use of env-prod for production
const envProdFile = path.join(__dirname, '../env-prod');
const outputPath = path.join(__dirname, '../public/env.js');

// Read env-prod
if (!fs.existsSync(envProdFile)) {
  console.error('❌ env-prod file not found!');
  process.exit(1);
}

const content = fs.readFileSync(envProdFile, 'utf-8');
const env = {
  API_URL: 'https://api.planclock.com',
  CLIENT_URL: 'https://app.planclock.com',
};

// Parse env-prod (handle both Unix and Windows line endings)
content.split(/\r?\n/).forEach((line) => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const eqIndex = trimmed.indexOf('=');
    if (eqIndex > -1) {
      const key = trimmed.substring(0, eqIndex).trim();
      const value = trimmed.substring(eqIndex + 1).trim();
      if (key && value) {
        env[key] = value;
      }
    }
  }
});

// Generate env.js (single line to avoid any line-ending issues)
const envJs = `window.__env = {"API_URL": "${env.API_URL}", "CLIENT_URL": "${env.CLIENT_URL}"};`;

fs.writeFileSync(outputPath, envJs, { encoding: 'utf8' });
console.log(`✓ Generated ${outputPath}`);
console.log(`  API_URL: ${env.API_URL}`);
console.log(`  CLIENT_URL: ${env.CLIENT_URL}`);

// Run ng build
console.log('\n▶ Running ng build...');
try {
  execSync('ng build', { stdio: 'inherit' });
  
  // Ensure env.js is in dist
  const distPath = path.join(__dirname, '../dist/isstrack-ui/browser/env.js');
  const distDir = path.dirname(distPath);
  
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  fs.copyFileSync(outputPath, distPath);
  console.log(`\n✓ Copied env.js to dist`);
  console.log(`✓ Production build completed`);
} catch (error) {
  console.error('\n❌ Build failed');
  process.exit(1);
}
