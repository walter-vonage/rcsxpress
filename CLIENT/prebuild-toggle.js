const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'utils', 'config.ts');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Replace the dev flag
    content = content.replace(/public static dev\s*=\s*true;/, 'public static dev = false;');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('config.ts updated: dev = false');
} catch (err) {
    console.error('Error updating config.ts:', err);
    process.exit(1);
}
