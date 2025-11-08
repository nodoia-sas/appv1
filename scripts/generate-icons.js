const fs = require('fs')
const path = require('path')
let sharp
try {
  sharp = require('sharp')
} catch (e) {
  console.error('Module sharp is required. Run: pnpm add -D sharp')
  process.exit(1)
}

async function generate() {
  const svgPath = path.join(__dirname, '..', 'public', 'icons', 'icon.svg')
  const out192 = path.join(__dirname, '..', 'public', 'icons', 'icon-192.png')
  const out512 = path.join(__dirname, '..', 'public', 'icons', 'icon-512.png')

  if (!fs.existsSync(svgPath)) {
    console.error('SVG source not found:', svgPath)
    process.exit(1)
  }

  try {
    const svgBuffer = fs.readFileSync(svgPath)
    await sharp(svgBuffer).resize(192, 192).png().toFile(out192)
    await sharp(svgBuffer).resize(512, 512).png().toFile(out512)
    console.log('Icons generated:', out192, out512)
  } catch (err) {
    console.error('Error generating icons:', err)
    process.exit(1)
  }
}

generate()
