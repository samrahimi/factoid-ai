const fs = require('fs').promises;
const path = require('path');

const SDK_PATH = path.join(process.cwd(), 'node_modules', '@google', 'generative-ai');

const FILES_TO_PATCH = [
  { path: 'dist/index.js', type: 'js' },
  { path: 'dist/index.mjs', type: 'js' },
  { path: 'dist/generative-ai.d.ts', type: 'ts' },
  { path: 'dist/types/enums.d.ts', type: 'ts' }
];

const JS_SEARCH = 'HarmCategory["HARM_CATEGORY_DANGEROUS_CONTENT"] = "HARM_CATEGORY_DANGEROUS_CONTENT";';
const JS_REPLACE = 'HarmCategory["HARM_CATEGORY_DANGEROUS_CONTENT"] = "HARM_CATEGORY_DANGEROUS_CONTENT";\n    HarmCategory["HARM_CATEGORY_CIVIC_INTEGRITY"] = "HARM_CATEGORY_CIVIC_INTEGRITY";';

const TS_SEARCH = 'HARM_CATEGORY_DANGEROUS_CONTENT = "HARM_CATEGORY_DANGEROUS_CONTENT"';
const TS_REPLACE = 'HARM_CATEGORY_DANGEROUS_CONTENT = "HARM_CATEGORY_DANGEROUS_CONTENT",\n    HARM_CATEGORY_CIVIC_INTEGRITY = "HARM_CATEGORY_CIVIC_INTEGRITY"';

async function checkSDKInstalled() {
  try {
    await fs.access(SDK_PATH);
    return true;
  } catch {
    console.log("Gemini SDK not found. Skipping patch.");
    return false;
  }
}

async function checkIfAlreadyPatched() {
  try {
    const content = await fs.readFile(path.join(SDK_PATH, 'dist', 'index.js'), 'utf8');
    return content.includes('HARM_CATEGORY_CIVIC_INTEGRITY');
  } catch {
    return false;
  }
}

async function patchFile(filePath, search, replace) {
  const fullPath = path.join(SDK_PATH, filePath);
  try {
    let content = await fs.readFile(fullPath, 'utf8');
    if (content.includes("HARM_CATEGORY_CIVIC_INTEGRITY")) {
      console.log(`Patch already applied in ${filePath}`);
      return;
    }
    if (content.includes(search)) {
      content = content.replace(search, replace);
      await fs.writeFile(fullPath, content, 'utf8');
      console.log(`Successfully patched ${filePath}`);
    } else {
      console.log(`No changes needed in ${filePath}`);
    }
  } catch (error) {
    console.error(`Error patching ${filePath}:`, error.message);
    throw error;
  }
}

async function runPatch() {
  try {
    if (!(await checkSDKInstalled())) {
      return;
    }

    if (await checkIfAlreadyPatched()) {
      console.log("Patch has already been applied. Skipping.");
      return;
    }

    for (const file of FILES_TO_PATCH) {
      const search = file.type === 'js' ? JS_SEARCH : TS_SEARCH;
      const replace = file.type === 'js' ? JS_REPLACE : TS_REPLACE;
      await patchFile(file.path, search, replace);
    }

    console.log("All steps completed successfully");
  } catch (error) {
    console.error("Error during patching process:", error.message);
    process.exit(1);
  }
}

runPatch();