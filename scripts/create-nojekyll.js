const fs = require("fs");
const path = require("path");

const outDir = path.join(__dirname, "..", "out");
const filePath = path.join(outDir, ".nojekyll");

if (!fs.existsSync(outDir)) {
  process.exit(0);
}

fs.writeFileSync(filePath, "");
console.log("Created .nojekyll in out/ for GitHub Pages static export.");
