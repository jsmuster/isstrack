#!/usr/bin/env node
/**
 * Generate env.js from .env or env-prod file
 * This script reads environment variables and creates the public/env.js file
 */

const fs = require('fs');
const path = require('path');

// Determine which env file to use based on NODE_ENV
const envProdFile = path.join(__dirname, '../env-prod');
const envFile = path.join(__dirname, '../.env');
const envLocalFile = path.join(__dirname, '../env-local');

const nodeEnv = process.env.NODE_ENV || 'development';
let envPath;

// For production builds, always use env-prod
if (nodeEnv === 'production' || process.env.HEROKU_APP_NAME) {
  envPath = envProdFile;
} else {
  // For development, prefer env-local
  envPath = envLocalFile;
}

// Fallback chain if preferred file doesn't exist
if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envProdFile)) {
    envPath = envProdFile;
  } else if (fs.existsSync(envLocalFile)) {
    envPath = envLocalFile;
  } else if (fs.existsSync(envFile)) {
    envPath = envFile;
  }
}

// Default values
const env = {
  API_URL: 'http://localhost:8080',
  CLIENT_URL: 'http://localhost:4200',
};

// Read env file if it exists
if (fs.existsSync(envPath)) {
  const content = fs.readFileSync(envPath, 'utf-8');
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
}

// Generate env.js (single line to avoid any line-ending issues)
const envJs = `window.__env = {"API_URL": "${env.API_URL}", "CLIENT_URL": "${env.CLIENT_URL}"};`;

const outputPath = path.join(__dirname, '../public/env.js');
fs.writeFileSync(outputPath, envJs, { encoding: 'utf8' });
console.log(`✓ Generated ${outputPath}`);
console.log(`  API_URL: ${env.API_URL}`);
console.log(`  CLIENT_URL: ${env.CLIENT_URL}`);
