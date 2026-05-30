import sharp from 'sharp'
import fs from 'fs'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rootDir = path.join(__dirname, '..')

const logoPath = path.join(rootDir, 'client/public/logo.png')
const outputPath = path.join(rootDir, 'client/public/og-image.png')

const logoBuffer = fs.readFileSync(logoPath)
const logoBase64 = logoBuffer.toString('base64')

const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="g1" cx="90%" cy="5%" r="50%">
      <stop offset="0%" stop-color="#7f1d1d" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="g2" cx="5%" cy="95%" r="45%">
      <stop offset="0%" stop-color="#dc2626" stop-opacity="0.18"/>
      <stop offset="100%" stop-color="#09090b" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <!-- Background -->
  <rect width="1200" height="630" fill="#09090b"/>
  <rect width="1200" height="630" fill="url(#g1)"/>
  <rect width="1200" height="630" fill="url(#g2)"/>

  <!-- Decorative circle -->
  <circle cx="960" cy="315" r="260" fill="none" stroke="#dc2626" stroke-width="1" opacity="0.08"/>
  <circle cx="960" cy="315" r="180" fill="none" stroke="#dc2626" stroke-width="1" opacity="0.06"/>

  <!-- Logo -->
  <image x="90" y="165" width="300" height="300" href="data:image/png;base64,${logoBase64}"/>

  <!-- Brand name -->
  <text x="440" y="278" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="96" font-weight="900" fill="#ffffff" letter-spacing="-4">Strawby</text>

  <!-- Tagline -->
  <text x="444" y="336" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="26" font-weight="400" fill="#a3a3a3" letter-spacing="0.2">Controle de refeições e nutrição diária.</text>

  <!-- Pills -->
  <rect x="444" y="375" width="124" height="36" rx="18" fill="#1c1c1e"/>
  <text x="506" y="398" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13" font-weight="600" fill="#dc2626" text-anchor="middle">✦ Gratuito</text>

  <rect x="580" y="375" width="90" height="36" rx="18" fill="#1c1c1e"/>
  <text x="625" y="398" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13" font-weight="600" fill="#dc2626" text-anchor="middle">PWA</text>

  <rect x="682" y="375" width="154" height="36" rx="18" fill="#1c1c1e"/>
  <text x="759" y="398" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif" font-size="13" font-weight="600" fill="#a3a3a3" text-anchor="middle">strawby.com</text>

  <!-- Bottom accent line -->
  <rect x="90" y="572" width="420" height="2" rx="1" fill="#dc2626" opacity="0.35"/>
</svg>`

await sharp(Buffer.from(svg))
  .png({ quality: 95, compressionLevel: 8 })
  .toFile(outputPath)

console.log('og-image.png criado em client/public/og-image.png')
