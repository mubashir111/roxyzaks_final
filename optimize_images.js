const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const rootDir = process.cwd(); // Run from project root
const imagesDir = path.join(rootDir, 'assets', 'images');

// Configuration
const CONFIG = {
    quality: 80,
    maxWidth: {
        'default': 1920,
        'brands': 400,
        'services': 800,
        'gallery': 1200,
        'bride': 1200
    }
};

// Helper to get max width based on path
function getMaxWidth(filePath) {
    if (filePath.includes('/brands/')) return CONFIG.maxWidth.brands;
    if (filePath.includes('/services/')) return CONFIG.maxWidth.services;
    if (filePath.includes('/bride/')) return CONFIG.maxWidth.bride;
    // Heuristic for gallery/grid items if they are in specific folders
    return CONFIG.maxWidth.default;
}

// Stats
let stats = {
    processed: 0,
    savedBytes: 0,
    errors: 0
};

// Walk directory recursively
async function walkAndProcess(dir) {
    const items = fs.readdirSync(dir);

    for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            await walkAndProcess(fullPath);
        } else if (stat.isFile()) {
            const ext = path.extname(item).toLowerCase();
            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                await processImage(fullPath);
            }
        }
    }
}

async function processImage(filePath) {
    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const name = path.basename(filePath, ext);
    const webpPath = path.join(dir, `${name}.webp`);

    // Skip if webp already exists (optional, but good for retries)
    // if (fs.existsSync(webpPath)) return;

    try {
        const originalStats = fs.statSync(filePath);
        const maxWidth = getMaxWidth(filePath);

        const pipeline = sharp(filePath);
        const metadata = await pipeline.metadata();

        if (metadata.width > maxWidth) {
            pipeline.resize({ width: maxWidth });
            console.log(`Resizing ${name}${ext}: ${metadata.width} -> ${maxWidth}px`);
        }

        await pipeline
            .webp({ quality: CONFIG.quality })
            .toFile(webpPath);

        const newStats = fs.statSync(webpPath);
        const saved = originalStats.size - newStats.size;

        stats.processed++;
        stats.savedBytes += saved;

        console.log(`Converted: ${name}${ext} -> .webp (${(saved / 1024).toFixed(2)} KB saved)`);

    } catch (err) {
        console.error(`Error processing ${filePath}:`, err.message);
        stats.errors++;
    }
}

(async () => {
    console.log('Starting Image Optimization...');
    console.log(`Target Directory: ${imagesDir}`);

    if (!fs.existsSync(imagesDir)) {
        console.error('Assets directory not found!');
        return;
    }

    const startTime = Date.now();
    await walkAndProcess(imagesDir);
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log('\n--- Optimization Complete ---');
    console.log(`Files Processed: ${stats.processed}`);
    console.log(`Total Size Saved: ${(stats.savedBytes / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Errors: ${stats.errors}`);
    console.log(`Time: ${duration}s`);
})();
