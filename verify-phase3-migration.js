#!/usr/bin/env node

/**
 * Phase 3 Migration Verification Script
 *
 * This script verifies that the feature-based architecture migration
 * has been completed successfully for Documents and Vehicles features.
 */

const fs = require("fs");
const path = require("path");

// ANSI color codes for output
const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFileExists(filePath) {
  return fs.existsSync(filePath);
}

function checkDirectoryExists(dirPath) {
  return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
}

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  warnings: 0,
  tests: [],
};

function test(name, condition, isWarning = false) {
  const passed = condition;
  results.tests.push({ name, passed, isWarning });

  if (passed) {
    results.passed++;
    log(`✓ ${name}`, "green");
  } else if (isWarning) {
    results.warnings++;
    log(`⚠ ${name}`, "yellow");
  } else {
    results.failed++;
    log(`✗ ${name}`, "red");
  }

  return passed;
}

function section(title) {
  log(`\n${"=".repeat(60)}`, "cyan");
  log(title, "cyan");
  log("=".repeat(60), "cyan");
}

// ============================================================================
// VERIFICATION TESTS
// ============================================================================

section("Phase 3: Feature Organization Migration Verification");

// Test 1: Feature Structure Organization (Property 1)
section("1. Feature Structure Organization");

test(
  "Documents feature directory exists",
  checkDirectoryExists("features/documents")
);

test(
  "Documents feature has components directory",
  checkDirectoryExists("features/documents/components")
);

test(
  "Documents feature has hooks directory",
  checkDirectoryExists("features/documents/hooks")
);

test(
  "Documents feature has services directory",
  checkDirectoryExists("features/documents/services")
);

test(
  "Documents feature has types directory",
  checkDirectoryExists("features/documents/types")
);

test(
  "Documents feature has barrel export (index.ts)",
  checkFileExists("features/documents/index.ts")
);

test(
  "Vehicles feature directory exists",
  checkDirectoryExists("features/vehicles")
);

test(
  "Vehicles feature has components directory",
  checkDirectoryExists("features/vehicles/components")
);

test(
  "Vehicles feature has hooks directory",
  checkDirectoryExists("features/vehicles/hooks")
);

test(
  "Vehicles feature has services directory",
  checkDirectoryExists("features/vehicles/services")
);

test(
  "Vehicles feature has types directory",
  checkDirectoryExists("features/vehicles/types")
);

test(
  "Vehicles feature has barrel export (index.ts)",
  checkFileExists("features/vehicles/index.ts")
);

// Test 2: Feature Code Colocation (Property 2)
section("2. Feature Code Colocation");

test(
  "Documents components are colocated",
  checkFileExists("features/documents/components/Documents.jsx") &&
    checkFileExists("features/documents/components/DocumentCard.jsx") &&
    checkFileExists("features/documents/components/PersonalDocuments.jsx")
);

test(
  "Documents hooks are colocated",
  checkFileExists("features/documents/hooks/useDocuments.js") &&
    checkFileExists("features/documents/hooks/useDocumentUpload.js") &&
    checkFileExists("features/documents/hooks/useDocumentValidation.js")
);

test(
  "Documents services are colocated",
  checkFileExists("features/documents/services/documentsService.js")
);

test(
  "Documents types are colocated",
  checkFileExists("features/documents/types/index.ts")
);

test(
  "Vehicles components are colocated",
  checkFileExists("features/vehicles/components/Vehicles.jsx") &&
    checkFileExists("features/vehicles/components/VehicleCard.jsx") &&
    checkFileExists("features/vehicles/components/VehicleForm.jsx")
);

test(
  "Vehicles hooks are colocated",
  checkFileExists("features/vehicles/hooks/useVehicles.js") &&
    checkFileExists("features/vehicles/hooks/useVehicleRegistration.js") &&
    checkFileExists("features/vehicles/hooks/useVehicleDocuments.js")
);

test(
  "Vehicles services are colocated",
  checkFileExists("features/vehicles/services/vehiclesService.js")
);

test(
  "Vehicles types are colocated",
  checkFileExists("features/vehicles/types/index.ts")
);

// Test 3: Shared Infrastructure
section("3. Shared Infrastructure");

test("Shared directory exists", checkDirectoryExists("shared"));

test(
  "Shared components directory exists",
  checkDirectoryExists("shared/components")
);

test("Shared hooks directory exists", checkDirectoryExists("shared/hooks"));

test("Shared types directory exists", checkDirectoryExists("shared/types"));

test("Shared utils directory exists", checkDirectoryExists("shared/utils"));

test("Shared barrel export exists", checkFileExists("shared/index.ts"));

test("Shared API client exists", checkFileExists("shared/utils/apiClient.ts"));

test(
  "Shared types exist",
  checkFileExists("shared/types/api.ts") &&
    checkFileExists("shared/types/ui.ts")
);

// Test 4: Backward Compatibility
section("4. Backward Compatibility");

test(
  "Old documents-manager components still exist",
  checkDirectoryExists("components/documents-manager") &&
    checkFileExists("components/documents-manager/DocumentCard.jsx") &&
    checkFileExists("components/documents-manager/PersonalDocuments.jsx") &&
    checkFileExists("components/documents-manager/Vehicles.jsx"),
  true // This is a warning, not a failure
);

test(
  "Old documents component still exists",
  checkFileExists("components/documents.jsx"),
  true
);

test("Legacy src directory still exists", checkDirectoryExists("src"), true);

// Test 5: TypeScript Configuration
section("5. TypeScript Configuration");

test("TypeScript config exists", checkFileExists("tsconfig.json"));

if (checkFileExists("tsconfig.json")) {
  try {
    const tsconfig = JSON.parse(fs.readFileSync("tsconfig.json", "utf8"));
    const paths = tsconfig.compilerOptions?.paths || {};

    test(
      "TypeScript path mapping includes @/features/*",
      paths["@/features/*"] !== undefined,
      true
    );

    test(
      "TypeScript path mapping includes @/shared/*",
      paths["@/shared/*"] !== undefined,
      true
    );
  } catch (e) {
    test("TypeScript config is valid JSON", false);
  }
}

// Test 6: Feature Independence (Property 7)
section("6. Feature Independence Check");

function checkForCrossFeatureImports(featureName, otherFeature) {
  const featurePath = path.join("features", featureName);
  let hasCrossImports = false;

  function scanDirectory(dir) {
    if (!fs.existsSync(dir)) return;

    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.match(/\.(js|jsx|ts|tsx)$/)) {
        const content = fs.readFileSync(filePath, "utf8");
        // Check for direct imports from other features
        const importRegex = new RegExp(
          `from ['"].*features/${otherFeature}/`,
          "g"
        );
        if (importRegex.test(content)) {
          hasCrossImports = true;
          log(`  Found cross-feature import in ${filePath}`, "yellow");
        }
      }
    }
  }

  scanDirectory(featurePath);
  return !hasCrossImports;
}

test(
  "Documents feature does not import from Vehicles feature",
  checkForCrossFeatureImports("documents", "vehicles")
);

test(
  "Vehicles feature does not import from Documents feature",
  checkForCrossFeatureImports("vehicles", "documents")
);

// ============================================================================
// SUMMARY
// ============================================================================

section("Verification Summary");

log(`\nTotal Tests: ${results.tests.length}`, "blue");
log(`Passed: ${results.passed}`, "green");
log(`Failed: ${results.failed}`, results.failed > 0 ? "red" : "green");
log(`Warnings: ${results.warnings}`, results.warnings > 0 ? "yellow" : "green");

if (results.failed === 0) {
  log("\n✓ All critical tests passed!", "green");
  log(
    "The Documents and Vehicles features have been successfully migrated.",
    "green"
  );

  if (results.warnings > 0) {
    log(
      "\nNote: Some warnings were found (backward compatibility checks).",
      "yellow"
    );
    log("These are expected during the migration phase.", "yellow");
  }

  process.exit(0);
} else {
  log("\n✗ Some tests failed!", "red");
  log("Please review the failed tests above.", "red");
  process.exit(1);
}
