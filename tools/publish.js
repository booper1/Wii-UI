/* tools/publish.js */
const fs = require("fs");
const path = require("path");

// Root docs folder (GitHub Pages source)
const docsRoot = path.join(process.cwd(), "docs");

// Angular's build output (with your current angular.json)
const browserDir = path.join(docsRoot, "Wii-UI", "browser");

// This is where we want the app to actually live:
// docs/Wii-UI/ -> https://skour.is/Wii-UI/
const targetDir = path.join(docsRoot, "Wii-UI");

if (!fs.existsSync(browserDir)) {
  console.error("Build output not found. Did you run `ng build` first?");
  process.exit(1);
}

function copyDir(src, dest) {
  for (const entry of fs.readdirSync(src)) {
    const s = path.join(src, entry);
    const d = path.join(dest, entry);
    const stat = fs.statSync(s);
    if (stat.isDirectory()) {
      fs.mkdirSync(d, { recursive: true });
      copyDir(s, d);
    } else {
      fs.copyFileSync(s, d);
    }
  }
}

// Make sure target directory exists (but do NOT delete all of docs/)
fs.mkdirSync(targetDir, { recursive: true });

// Copy built app from docs/Wii-UI/browser -> docs/Wii-UI
copyDir(browserDir, targetDir);

// Remove leftover browser directory
fs.rmSync(browserDir, { recursive: true, force: true });

// Patch favicon path in built index.html
const indexPath = path.join(targetDir, "index.html");
if (fs.existsSync(indexPath)) {
  let html = fs.readFileSync(indexPath, "utf8");

  // Replace relative favicon path with absolute one
  html = html.replace(/href="assets\/wii\.ico"/g, 'href="/Wii-UI/assets/wii.ico"');

  fs.writeFileSync(indexPath, html, "utf8");
  console.log("Patched favicon path for production build.");
}

// SPA fallback: /Wii-UI/404.html -> /Wii-UI/index.html
const fallbackPath = path.join(targetDir, "404.html");
fs.copyFileSync(indexPath, fallbackPath);

console.log("Copied build and cleaned up successfully.");
