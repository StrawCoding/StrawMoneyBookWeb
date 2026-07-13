import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'

const root = process.cwd()
const manifestPath = resolve(root, 'public/app-update.json')
const playApiPath = resolve(root, 'public/api/app-update/play')

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

if (!existsSync(manifestPath)) {
  throw new Error('missing public/app-update.json')
}
if (!existsSync(playApiPath)) {
  throw new Error('missing public/api/app-update/play')
}

const manifest = readJson(manifestPath)
const playApi = readJson(playApiPath)
const latestVersion = String(manifest.latestVersion ?? '').trim()

if (!latestVersion) {
  throw new Error('public/app-update.json missing latestVersion')
}
if (String(playApi.latestVersion ?? '').trim() !== latestVersion) {
  throw new Error('Play API latestVersion must match manifest latestVersion')
}
if (String(playApi.version ?? '').trim() !== latestVersion) {
  throw new Error('Play API version must match manifest latestVersion')
}

console.log(`[check-app-update-json] latestVersion=${latestVersion}`)
