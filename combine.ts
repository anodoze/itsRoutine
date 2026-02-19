import * as fs from "fs";
import * as path from "path";

const files = [
  "app/design.md",
// additional files
];

const workingDir = process.cwd();
const out = "combined.txt";

if (fs.existsSync(out)) fs.unlinkSync(out);

fs.appendFileSync(out, `// === File Structure ===\n`);
fs.appendFileSync(out, buildTree(workingDir) + "\n");

for (const file of files) {
  const fullPath = path.resolve(file);
  const displayPath = path.relative(workingDir, fullPath);
  fs.appendFileSync(out, `// === ${displayPath} ===\n`);
  fs.appendFileSync(out, fs.readFileSync(fullPath, "utf8"));
  fs.appendFileSync(out, "\n");
}

function buildTree(dir: string, prefix = "", rootDir = dir): string {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
    .filter(e => !['node_modules', '.git', '.expo', 'combined.txt', '.expo', '.vscode'].includes(e.name));
  
  let result = "";
  entries.forEach((entry, i) => {
    const isLast = i === entries.length - 1;
    const connector = isLast ? "└── " : "├── ";
    const childPrefix = isLast ? "    " : "│   ";
    result += prefix + connector + entry.name + "\n";
    if (entry.isDirectory()) {
      result += buildTree(path.join(dir, entry.name), prefix + childPrefix, rootDir);
    }
  });
  return result;
}

// run with npx ts-node combine.ts