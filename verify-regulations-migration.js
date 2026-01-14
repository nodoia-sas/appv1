/**
 * Verification script for Regulations feature migration
 * Checks that all required files and exports are in place
 */

const fs = require("fs");
const path = require("path");

// ANSI color codes
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  const fullPath = path.join(__dirname, filePath);
  const exists = fs.existsSync(fullPath);
  if (exists) {
    log(`✓ ${filePath}`, colors.green);
  } else {
    log(`✗ ${filePath} - MISSING`, colors.red);
  }
  return exists;
}

function checkDirectoryExists(dirPath) {
  const fullPath = path.join(__dirname, dirPath);
  const exists = fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
  if (exists) {
    log(`✓ ${dirPath}/`, colors.green);
  } else {
    log(`✗ ${dirPath}/ - MISSING`, colors.red);
  }
  return exists;
}

function checkFileContains(filePath, searchString, description) {
  const fullPath = path.join(__dirname, filePath);
  if (!fs.existsSync(fullPath)) {
    log(`✗ ${description} - FILE NOT FOUND`, colors.red);
    return false;
  }

  const content = fs.readFileSync(fullPath, "utf8");
  const contains = content.includes(searchString);
  if (contains) {
    log(`✓ ${description}`, colors.green);
  } else {
    log(`✗ ${description} - NOT FOUND`, colors.red);
  }
  return contains;
}

log("\n=== Regulations Feature Migration Verification ===\n", colors.blue);

let allChecks = true;

// Check directory structure
log("Checking directory structure:", colors.yellow);
allChecks &= checkDirectoryExists("features/regulations");
allChecks &= checkDirectoryExists("features/regulations/components");
allChecks &= checkDirectoryExists("features/regulations/hooks");
allChecks &= checkDirectoryExists("features/regulations/services");
allChecks &= checkDirectoryExists("features/regulations/types");

log("\nChecking component files:", colors.yellow);
allChecks &= checkFileExists("features/regulations/components/Regulations.jsx");
allChecks &= checkFileExists(
  "features/regulations/components/RegulationsMain.jsx"
);
allChecks &= checkFileExists(
  "features/regulations/components/RegulationDetail.jsx"
);

log("\nChecking hook files:", colors.yellow);
allChecks &= checkFileExists("features/regulations/hooks/useRegulations.js");
allChecks &= checkFileExists(
  "features/regulations/hooks/useRegulationDetail.js"
);
allChecks &= checkFileExists(
  "features/regulations/hooks/useRegulationSearch.js"
);

log("\nChecking service files:", colors.yellow);
allChecks &= checkFileExists(
  "features/regulations/services/regulationsService.js"
);

log("\nChecking type files:", colors.yellow);
allChecks &= checkFileExists("features/regulations/types/index.ts");

log("\nChecking barrel export:", colors.yellow);
allChecks &= checkFileExists("features/regulations/index.ts");

log("\nChecking barrel export contents:", colors.yellow);
allChecks &= checkFileContains(
  "features/regulations/index.ts",
  "export { default as Regulations }",
  "Regulations component export"
);
allChecks &= checkFileContains(
  "features/regulations/index.ts",
  "export { default as RegulationsMain }",
  "RegulationsMain component export"
);
allChecks &= checkFileContains(
  "features/regulations/index.ts",
  "export { default as RegulationDetail }",
  "RegulationDetail component export"
);
allChecks &= checkFileContains(
  "features/regulations/index.ts",
  "export { useRegulations }",
  "useRegulations hook export"
);
allChecks &= checkFileContains(
  "features/regulations/index.ts",
  "export { useRegulationDetail }",
  "useRegulationDetail hook export"
);
allChecks &= checkFileContains(
  "features/regulations/index.ts",
  "export { useRegulationSearch }",
  "useRegulationSearch hook export"
);
allChecks &= checkFileContains(
  "features/regulations/index.ts",
  "export { regulationsService }",
  "regulationsService export"
);

log("\nChecking service implementation:", colors.yellow);
allChecks &= checkFileContains(
  "features/regulations/services/regulationsService.js",
  "fetchRegulations",
  "fetchRegulations method"
);
allChecks &= checkFileContains(
  "features/regulations/services/regulationsService.js",
  "fetchRegulationById",
  "fetchRegulationById method"
);
allChecks &= checkFileContains(
  "features/regulations/services/regulationsService.js",
  "searchRegulations",
  "searchRegulations method"
);
allChecks &= checkFileContains(
  "features/regulations/services/regulationsService.js",
  "filterRegulations",
  "filterRegulations method"
);
allChecks &= checkFileContains(
  "features/regulations/services/regulationsService.js",
  "saveSelectedRegulation",
  "saveSelectedRegulation method"
);

log("\nChecking hook implementations:", colors.yellow);
allChecks &= checkFileContains(
  "features/regulations/hooks/useRegulations.js",
  "export const useRegulations",
  "useRegulations hook export"
);
allChecks &= checkFileContains(
  "features/regulations/hooks/useRegulationDetail.js",
  "export const useRegulationDetail",
  "useRegulationDetail hook export"
);
allChecks &= checkFileContains(
  "features/regulations/hooks/useRegulationSearch.js",
  "export const useRegulationSearch",
  "useRegulationSearch hook export"
);

log("\nChecking type definitions:", colors.yellow);
allChecks &= checkFileContains(
  "features/regulations/types/index.ts",
  "export interface RegulationData",
  "RegulationData interface"
);
allChecks &= checkFileContains(
  "features/regulations/types/index.ts",
  "export interface RegulationArticle",
  "RegulationArticle interface"
);
allChecks &= checkFileContains(
  "features/regulations/types/index.ts",
  "export interface RegulationSearchOptions",
  "RegulationSearchOptions interface"
);
allChecks &= checkFileContains(
  "features/regulations/types/index.ts",
  "export interface RegulationsHookState",
  "RegulationsHookState interface"
);
allChecks &= checkFileContains(
  "features/regulations/types/index.ts",
  "export interface RegulationDetailHookState",
  "RegulationDetailHookState interface"
);
allChecks &= checkFileContains(
  "features/regulations/types/index.ts",
  "export interface RegulationSearchHookState",
  "RegulationSearchHookState interface"
);

log("\n=== Summary ===\n", colors.blue);

if (allChecks) {
  log(
    "✓ All checks passed! Regulations feature migration is complete.",
    colors.green
  );
  process.exit(0);
} else {
  log("✗ Some checks failed. Please review the output above.", colors.red);
  process.exit(1);
}
