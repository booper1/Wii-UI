/* tools/publish.js */
const fs = require("fs");
const path = require("path");

const dist = path.join(process.cwd(), "dist");
const apps = fs
  .readdirSync(dist)
  .filter((n) => fs.statSync(path.join(dist, n)).isDirectory());
if (apps.length === 0) {
  console.error("No app folder found in dist/");
  process.exit(1);
}
const appDir = path.join(dist, apps[0]);
const browserDir = path.join(appDir, "browser");
const srcDir = fs.existsSync(browserDir) ? browserDir : appDir;

const docs = path.join(process.cwd(), "docs");
fs.rmSync(docs, { recursive: true, force: true });
fs.mkdirSync(docs, { recursive: true });

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
copyDir(srcDir, docs);

// SPA fallback
fs.copyFileSync(path.join(docs, "index.html"), path.join(docs, "404.html"));
console.log("Copied build from", srcDir, "to", docs);
