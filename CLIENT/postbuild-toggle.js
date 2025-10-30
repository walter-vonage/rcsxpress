const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'app', 'utils', 'config.ts');

try {
    let content = fs.readFileSync(filePath, 'utf8');

    // Restore the dev flag
    content = content.replace(/public static dev\s*=\s*false;/, 'public static dev = true;');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log('config.ts restored: dev = true');
} catch (err) {
    console.error('Error restoring config.ts:', err);
    process.exit(1);
}
