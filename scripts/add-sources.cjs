// Add the reconstructed Swift sources to the App target and bump MARKETING_VERSION.
const xcode = require('xcode');
const fs = require('fs');

const PBX = 'C:/Users/jtoma/nextrainers-re/nextrainers-ios/ios/App/App.xcodeproj/project.pbxproj';

// 1) version bump (scalar, safe textual replace)
let raw = fs.readFileSync(PBX, 'utf8');
raw = raw.split('MARKETING_VERSION = 1.0;').join('MARKETING_VERSION = 1.1.3;');
fs.writeFileSync(PBX, raw);

// 2) add source files to the App target
const proj = xcode.project(PBX);
proj.parseSync();

const target = proj.getFirstTarget().uuid;
const files = [
  'App/MainViewController.swift',
  'App/GenerationProgressPlugin.swift',
  'App/GenerationActivityAttributes.swift',
];

const objects = proj.hash.project.objects;
const existingRefs = new Set(
  Object.values(objects.PBXFileReference || {})
    .filter(v => v && typeof v === 'object' && v.path)
    .map(v => v.path)
);

for (const f of files) {
  const base = f.split('/').pop();
  if (existingRefs.has(base)) {
    console.log('skip (already present):', f);
    continue;
  }
  proj.addSourceFile(f, { target }, '504EC3061FED79650016851F');
  console.log('added:', f);
}

const serialized = proj.writeSync();
require('fs').writeFileSync(PBX, serialized);
console.log('pbxproj written:', serialized.length, 'bytes');
