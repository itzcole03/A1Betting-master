const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const madgePath = path.join(__dirname, 'madge-frontend.json');
const outputPath = path.join(__dirname, 'super_index.json');

// 1. Ensure madge-frontend.json exists and is valid JSON
function ensureMadgeJson() {
  let needsRegen = false;
  if (!fs.existsSync(madgePath)) {
    needsRegen = true;
  } else {
    try {
      const content = fs.readFileSync(madgePath, 'utf-8');
      JSON.parse(content);
    } catch (e) {
      needsRegen = true;
    }
  }
  if (needsRegen) {
    console.log('Regenerating madge-frontend.json...');
    execSync('npx madge --json ../frontend/src > madge-frontend.json', { cwd: __dirname, stdio: 'inherit' });
  }
}

ensureMadgeJson();
const madgeGraph = JSON.parse(fs.readFileSync(madgePath, 'utf-8'));

// 2. Find all *_ANALYSIS.md files in frontend and backend
function findAnalysisFiles(dir, results = []) {
  if (!fs.existsSync(dir)) return results;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      findAnalysisFiles(fullPath, results);
    } else if (/_ANALYSIS\.md$/.test(file)) {
      results.push(fullPath);
    }
  }
  return results;
}

const frontendRoot = path.join(__dirname, '..', 'frontend');
const backendRoot = path.join(__dirname, '..', 'backend');
const analysisFiles = [
  ...findAnalysisFiles(frontendRoot),
  ...findAnalysisFiles(backendRoot)
];

// 3. Parse file breakdowns from *_ANALYSIS.md files
function parseFileBreakdown(mdContent, analysisPath) {
  const fileBlocks = {};
  const regex = /### ([^\n]+)\n- \*\*Purpose:\*\* ([^\n]+)\n- \*\*Usage:\*\* ([^\n]+)\n- \*\*Notes:\*\* ([^\n]+)\n- \*\*Status:\*\* ([^\n]+)/g;
  let match;
  while ((match = regex.exec(mdContent))) {
    const [_, file, purpose, usage, notes, status] = match;
    fileBlocks[file.trim()] = {
      purpose: purpose.trim(),
      usage: usage.trim(),
      notes: notes.trim(),
      status: status.trim(),
      analysis_md: analysisPath
    };
  }
  return fileBlocks;
}

// 4. Build the super index (forward and reverse dependencies)
const superIndex = {};

// Forward dependencies
for (const [file, deps] of Object.entries(madgeGraph)) {
  superIndex[file] = {
    dependencies: deps,
    reverse_dependencies: [],
    documentation: null,
    file_size: null,
    last_modified: null
  };
}

// Reverse dependencies
for (const [file, data] of Object.entries(superIndex)) {
  data.dependencies.forEach(dep => {
    if (superIndex[dep]) {
      superIndex[dep].reverse_dependencies.push(file);
    }
  });
}

// 5. Add file size and last modified time
for (const file of Object.keys(superIndex)) {
  const absPath = path.join(__dirname, '..', file);
  if (fs.existsSync(absPath)) {
    const stats = fs.statSync(absPath);
    superIndex[file].file_size = stats.size;
    superIndex[file].last_modified = stats.mtime.toISOString();
  }
}

// 6. Merge in documentation and *_ANALYSIS.md link
for (const analysisPath of analysisFiles) {
  const md = fs.readFileSync(analysisPath, 'utf-8');
  const breakdowns = parseFileBreakdown(md, analysisPath);
  for (const [file, doc] of Object.entries(breakdowns)) {
    // Try to match the file to a key in the madge graph
    const fileKey = Object.keys(superIndex).find(k => k.endsWith(file));
    if (fileKey) {
      superIndex[fileKey].documentation = doc;
      superIndex[fileKey].analysis_md = analysisPath;
    } else {
      // If not found, add as a new entry
      superIndex[file] = {
        dependencies: [],
        reverse_dependencies: [],
        documentation: doc,
        analysis_md: analysisPath,
        file_size: null,
        last_modified: null
      };
    }
  }
}

// 7. Write the super index to disk
fs.writeFileSync(outputPath, JSON.stringify(superIndex, null, 2));
console.log(`Super index written to ${outputPath}`);