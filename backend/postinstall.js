const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'node_modules', 'buffer-equal-constant-time', 'index.js');

if (fs.existsSync(filePath)) {
  let content = fs.readFileSync(filePath, 'utf8');
  if (content.includes("require('buffer').SlowBuffer;")) {
    content = content.replace(
      "var SlowBuffer = require('buffer').SlowBuffer;",
      "var SlowBuffer = require('buffer').SlowBuffer || Buffer;"
    );
    fs.writeFileSync(filePath, content);
    console.log('✅ Patched buffer-equal-constant-time for Node.js 22+ compatibility');
  }
}
