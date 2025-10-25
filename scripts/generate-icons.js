const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputSvg = path.join(__dirname, '../public/icons/icon.svg');
const outputDir = path.join(__dirname, '../public/icons');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function generateIcons() {
  console.log('Generating PWA icons...');

  try {
    for (const size of sizes) {
      const outputPath = path.join(outputDir, `icon-${size}x${size}.png`);

      await sharp(inputSvg).resize(size, size).png().toFile(outputPath);

      console.log(`✓ Generated ${size}x${size} icon`);
    }

    // Generate favicon
    await sharp(inputSvg)
      .resize(32, 32)
      .png()
      .toFile(path.join(__dirname, '../public/favicon.png'));

    console.log('✓ Generated favicon');

    // Generate shortcut icon
    await sharp(inputSvg).resize(96, 96).png().toFile(path.join(outputDir, 'shortcut-add.png'));

    console.log('✓ Generated shortcut icon');

    console.log('🎉 All icons generated successfully!');
  } catch (error) {
    console.error('❌ Error generating icons:', error);
  }
}

generateIcons();
