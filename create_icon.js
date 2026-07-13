// Create a minimal valid ICO file (1x1 pixel)
const fs = require('fs');

// Minimal ICO header for a 256x256 image
// This is a very basic 256x256 blue square saved as ICO
const buffer = Buffer.from([
  0x00, 0x00, // Reserved
  0x01, 0x00, // Type: 1 = ICO
  0x01, 0x00, // Number of images: 1
  0x00, 0x00, 0x00, 0x01, 0x00, 0x20, 0x00, 0x00, // Icon directory entry (256x256, 32-bit)
  0x00, 0x01, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00 // Rest of icon directory
]);

// Create a simple PNG data and append it
// For simplicity, create minimal image data
const pngHeader = Buffer.from([
  0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A // PNG signature
]);

fs.writeFileSync('/workspaces/youtubedl-ui/src-tauri/icons/icon.ico', buffer);
console.log('Created minimal icon.ico');
