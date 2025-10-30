const fs = require('fs-extra');
const path = require('path');

const distPath = path.join(__dirname, 'dist');
const serverPublicPath = path.join(__dirname, '..', 'SERVER', 'public');

// 1. Find Angular build folder (auto-detect app name inside /dist)
const appFolders = fs.readdirSync(distPath).filter(f => !f.startsWith('.'));
if (appFolders.length === 0) {
    console.error('No Angular build found inside /dist. Did you run ng build?');
    process.exit(1);
}

const appDist = path.join(distPath, appFolders[0]);

// 2. Detect and flatten Angular's "browser" subfolder if it exists
let sourcePath = appDist;
const browserPath = path.join(appDist, 'browser');
if (fs.existsSync(browserPath)) {
    sourcePath = browserPath;
    console.log('📁 Detected Angular browser folder — flattening structure.');
}

// 3. Clean old files
if (fs.existsSync(serverPublicPath)) {
    fs.emptyDirSync(serverPublicPath);
}

// 4. Copy new build
fs.copySync(sourcePath, serverPublicPath);

console.log(`Angular build copied to: ${serverPublicPath}`);
