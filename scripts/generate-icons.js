import sharp from "sharp";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { existsSync, mkdirSync } from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const baseIcon = join(__dirname, "../static/dice.png");
const outputDir = join(__dirname, "../static/icons");

// Create output directory if it doesn't exist
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Generate icons for each size
sizes.forEach((size) => {
  sharp(baseIcon)
    .resize(size, size)
    .toFile(join(outputDir, `icon-${size}x${size}.png`))
    .then(() => console.log(`Generated ${size}x${size} icon`))
    .catch((err) =>
      console.error(`Error generating ${size}x${size} icon:`, err)
    );
});
