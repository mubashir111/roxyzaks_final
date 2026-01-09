const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const fs = require('fs');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

const rootDir = process.cwd();
// List of videos found in previous steps
const videoFiles = [
    'assets/images/Arakkinar/WhatsApp Video 2025-12-29 at 08.06.43.mp4',
    'assets/images/Azhichavattam/WhatsApp Video 2025-12-29 at 08.17.56.mp4',
    'assets/images/FEROKE/WhatsApp Video 2025-12-29 at 08.05.14.mp4',
    'assets/images/FEROKE/WhatsApp Video 2025-12-29 at 08.05.19.mp4',
    'assets/images/PANTHEERANKAVE/WhatsApp Video 2025-12-29 at 08.03.30.mp4',
    'assets/images/PANTHEERANKAVE/WhatsApp Video 2025-12-29 at 08.03.31.mp4',
    'assets/video/ff.mp4'
];

async function getFileSize(filePath) {
    const stats = fs.statSync(filePath);
    return stats.size;
}

async function processVideo(relativePath) {
    const inputPath = path.join(rootDir, relativePath);
    if (!fs.existsSync(inputPath)) {
        console.log(`Skipping missing file: ${relativePath}`);
        return;
    }

    const dir = path.dirname(inputPath);
    const ext = path.extname(inputPath);
    const name = path.basename(inputPath, ext);
    const outputPath = path.join(dir, `${name}_optimized${ext}`);
    const tempPath = path.join(dir, `${name}_temp${ext}`);

    console.log(`Processing: ${relativePath}`);
    const originalSize = await getFileSize(inputPath);

    return new Promise((resolve, reject) => {
        ffmpeg(inputPath)
            .videoCodec('libx264')
            .outputOptions([
                '-crf 23', // Visual quality control (lower is better, 23 is default)
                '-preset medium',
                '-movflags +faststart', // Web optimization
                '-vf scale=\'min(1280,iw):-2\'' // Downscale to 720p width if larger, keep aspect ratio
            ])
            .on('end', async () => {
                const newSize = await getFileSize(tempPath);
                const saved = (originalSize - newSize) / 1024 / 1024;
                console.log(`Finished ${relativePath}: Saved ${saved.toFixed(2)} MB`);

                // Replace original
                fs.renameSync(tempPath, inputPath);
                resolve();
            })
            .on('error', (err) => {
                console.error(`Error processing ${relativePath}:`, err);
                if (fs.existsSync(tempPath)) fs.unlinkSync(tempPath);
                resolve(); // Continue even if error
            })
            .save(tempPath);
    });
}

(async () => {
    console.log('Starting Video Optimization...');
    for (const file of videoFiles) {
        await processVideo(file);
    }
    console.log('All videos processed.');
})();
