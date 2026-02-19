import * as fs from "fs";
import * as path from "path";

const files = [
  // "app/design.md",
  // "app/_layout.tsx",
  // "app/index.tsx",
  // "app/TimerView.tsx",
  // "app/types.ts",
  // "app/hooks/use-routine-runner.ts",
  "app/RegistryContext.tsx",
  "app/Storage.ts"
];

const workingDir = process.cwd();
const out = "combined.txt";

if (fs.existsSync(out)) fs.unlinkSync(out);

for (const file of files) {
  const fullPath = path.resolve(file);
  const displayPath = path.relative(workingDir, fullPath);
  fs.appendFileSync(out, `// === ${displayPath} ===\n`);
  fs.appendFileSync(out, fs.readFileSync(fullPath, "utf8"));
  fs.appendFileSync(out, "\n");
}

// run with npx ts-node combine.ts