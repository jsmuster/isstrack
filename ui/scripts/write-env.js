const fs = require('fs')
const path = require('path')

const projectRoot = path.resolve(__dirname, '..')
const sourceArg = process.argv[2] || 'env-local'
const sourcePath = path.isAbsolute(sourceArg)
  ? sourceArg
  : path.resolve(projectRoot, sourceArg)
const targetEnvPath = path.resolve(projectRoot, '.env')
const publicEnvPath = path.resolve(projectRoot, 'public', 'env.js')

if (!fs.existsSync(sourcePath)) {
  console.error(`Env file not found: ${sourcePath}`)
  process.exit(1)
}

const content = fs.readFileSync(sourcePath, 'utf8')
const env = {}

content.split(/\r?\n/).forEach((line) => {
  const trimmed = line.trim()
  if (!trimmed || trimmed.startsWith('#')) {
    return
  }

  const separatorIndex = trimmed.indexOf('=')
  if (separatorIndex === -1) {
    return
  }

  const key = trimmed.slice(0, separatorIndex).trim()
  const value = trimmed.slice(separatorIndex + 1).trim()
  if (key) {
    env[key] = value
  }
})

fs.writeFileSync(targetEnvPath, content)
fs.mkdirSync(path.dirname(publicEnvPath), { recursive: true })
fs.writeFileSync(publicEnvPath, `window.__env = ${JSON.stringify(env, null, 2)};\n`)

console.log(`Copied ${path.basename(sourcePath)} to .env and generated public/env.js`)
