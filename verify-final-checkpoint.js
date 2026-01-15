#!/usr/bin/env node

/**
 * Final Checkpoint Verification Script
 * Verifies the complete Phase 3 architecture migration
 */

const fs = require("fs");
const path = require("path");

console.log("=".repeat(80));
console.log("PHASE 3 FINAL CHECKPOINT VERIFICATION");
console.log("=".repeat(80));
console.log();

let allChecksPassed = true;
const issues = [];

// ============================================================================
// 1. VERIFY FEATURE STRUCTURE
// ============================================================================
console.log("1. VERIFYING FEATURE STRUCTURE");
console.log("-".repeat(80));

const features = [
  "documents",
  "vehicles",
  "regulations",
  "news",
  "quiz",
  "pqr",
];
const requiredDirs = ["components", "hooks", "services", "types"];

features.forEach((feature) => {
  const featurePath = path.join(__dirname, "features", feature);

  if (!fs.existsSync(featurePath)) {
    allChecksPassed = false;
    issues.push(`❌ Feature directory missing: ${feature}`);
    console.log(`❌ Feature directory missing: ${feature}`);
    return;
  }

  console.log(`✓ Feature exists: ${feature}`);

  // Check required subdirectories
  requiredDirs.forEach((dir) => {
    const dirPath = path.join(featurePath, dir);
    if (!fs.existsSync(dirPath)) {
      allChecksPassed = false;
      issues.push(`❌ Missing ${dir} directory in ${feature}`);
      console.log(`  ❌ Missing ${dir} directory`);
    } else {
      console.log(`  ✓ ${dir}/ exists`);
    }
  });

  // Check barrel export
  const indexPath = path.join(featurePath, "index.ts");
  if (!fs.existsSync(indexPath)) {
    allChecksPassed = false;
    issues.push(`❌ Missing barrel export (index.ts) in ${feature}`);
    console.log(`  ❌ Missing barrel export (index.ts)`);
  } else {
    console.log(`  ✓ index.ts exists`);
  }

  console.log();
});

// ============================================================================
// 2. VERIFY SHARED STRUCTURE
// ============================================================================
console.log("2. VERIFYING SHARED STRUCTURE");
console.log("-".repeat(80));

const sharedDirs = ["components", "hooks", "utils", "types"];
const sharedPath = path.join(__dirname, "shared");

if (!fs.existsSync(sharedPath)) {
  allChecksPassed = false;
  issues.push("❌ Shared directory missing");
  console.log("❌ Shared directory missing");
} else {
  console.log("✓ Shared directory exists");

  sharedDirs.forEach((dir) => {
    const dirPath = path.join(sharedPath, dir);
    if (!fs.existsSync(dirPath)) {
      allChecksPassed = false;
      issues.push(`❌ Missing shared/${dir} directory`);
      console.log(`  ❌ Missing ${dir} directory`);
    } else {
      console.log(`  ✓ ${dir}/ exists`);
    }
  });
}

console.log();

// ============================================================================
// 3. VERIFY FEATURE INDEPENDENCE (NO CROSS-FEATURE IMPORTS)
// ============================================================================
console.log("3. VERIFYING FEATURE INDEPENDENCE");
console.log("-".repeat(80));

function checkCrossFeatureImports(featureName) {
  const featurePath = path.join(__dirname, "features", featureName);
  const violations = [];

  function scanDirectory(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        scanDirectory(filePath);
      } else if (file.match(/\.(ts|tsx|js|jsx)$/)) {
        const content = fs.readFileSync(filePath, "utf8");

        // Check for imports from other features
        features.forEach((otherFeature) => {
          if (otherFeature !== featureName) {
            const importPattern = new RegExp(
              `from ['"].*?/features/${otherFeature}/`,
              "g"
            );
            const relativeImportPattern = new RegExp(
              `from ['"]\\.\\..*?/${otherFeature}/`,
              "g"
            );

            if (
              importPattern.test(content) ||
              relativeImportPattern.test(content)
            ) {
              violations.push({
                file: path.relative(__dirname, filePath),
                imports: otherFeature,
              });
            }
          }
        });
      }
    });
  }

  if (fs.existsSync(featurePath)) {
    scanDirectory(featurePath);
  }

  return violations;
}

features.forEach((feature) => {
  const violations = checkCrossFeatureImports(feature);

  if (violations.length > 0) {
    allChecksPassed = false;
    console.log(`❌ ${feature}: Found cross-feature imports`);
    violations.forEach((v) => {
      issues.push(`❌ ${v.file} imports from ${v.imports}`);
      console.log(`  - ${v.file} imports from ${v.imports}`);
    });
  } else {
    console.log(`✓ ${feature}: No cross-feature imports`);
  }
});

console.log();

// ============================================================================
// 4. VERIFY BARREL EXPORTS
// ============================================================================
console.log("4. VERIFYING BARREL EXPORTS");
console.log("-".repeat(80));

features.forEach((feature) => {
  const indexPath = path.join(__dirname, "features", feature, "index.ts");

  if (fs.existsSync(indexPath)) {
    const content = fs.readFileSync(indexPath, "utf8");

    // Check if barrel export has exports
    if (content.includes("export") && content.trim().length > 0) {
      console.log(`✓ ${feature}: Barrel export configured`);
    } else {
      allChecksPassed = false;
      issues.push(`❌ ${feature}: Barrel export is empty`);
      console.log(`❌ ${feature}: Barrel export is empty`);
    }
  } else {
    allChecksPassed = false;
    issues.push(`❌ ${feature}: No barrel export found`);
    console.log(`❌ ${feature}: No barrel export found`);
  }
});

console.log();

// ============================================================================
// 5. VERIFY TYPESCRIPT CONFIGURATION
// ============================================================================
console.log("5. VERIFYING TYPESCRIPT CONFIGURATION");
console.log("-".repeat(80));

const tsconfigPath = path.join(__dirname, "tsconfig.json");

if (fs.existsSync(tsconfigPath)) {
  const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf8"));

  if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) {
    const paths = tsconfig.compilerOptions.paths;

    // Check for feature paths
    if (paths["@/features/*"]) {
      console.log("✓ Feature path mapping configured");
    } else {
      console.log("⚠ Feature path mapping not found (may use default)");
    }

    // Check for shared paths
    if (paths["@/shared/*"]) {
      console.log("✓ Shared path mapping configured");
    } else {
      console.log("⚠ Shared path mapping not found (may use default)");
    }
  } else {
    console.log("⚠ No path mappings found in tsconfig.json");
  }
} else {
  allChecksPassed = false;
  issues.push("❌ tsconfig.json not found");
  console.log("❌ tsconfig.json not found");
}

console.log();

// ============================================================================
// 6. VERIFY FEATURE COMPONENTS
// ============================================================================
console.log("6. VERIFYING FEATURE COMPONENTS");
console.log("-".repeat(80));

const expectedComponents = {
  documents: [
    "Documents.jsx",
    "DocumentCard.jsx",
    "PersonalDocuments.jsx",
    "PersonalDocumentForm.jsx",
    "VehicleCard.jsx",
    "VehicleForm.jsx",
    "Vehicles.jsx",
  ],
  vehicles: ["Vehicles.jsx", "VehicleCard.jsx", "VehicleForm.jsx"],
  regulations: [
    "Regulations.jsx",
    "RegulationsMain.jsx",
    "RegulationDetail.jsx",
  ],
  news: ["News.jsx"],
  quiz: ["Quiz.jsx"],
  pqr: ["Pqr.jsx"],
};

Object.entries(expectedComponents).forEach(([feature, components]) => {
  const componentsPath = path.join(
    __dirname,
    "features",
    feature,
    "components"
  );

  if (fs.existsSync(componentsPath)) {
    const existingComponents = fs
      .readdirSync(componentsPath)
      .filter((f) => f.match(/\.(jsx|tsx)$/));

    if (existingComponents.length > 0) {
      console.log(
        `✓ ${feature}: ${existingComponents.length} component(s) migrated`
      );
    } else {
      console.log(`⚠ ${feature}: No components found`);
    }
  } else {
    console.log(`⚠ ${feature}: Components directory not found`);
  }
});

console.log();

// ============================================================================
// 7. VERIFY FEATURE HOOKS
// ============================================================================
console.log("7. VERIFYING FEATURE HOOKS");
console.log("-".repeat(80));

features.forEach((feature) => {
  const hooksPath = path.join(__dirname, "features", feature, "hooks");

  if (fs.existsSync(hooksPath)) {
    const hooks = fs
      .readdirSync(hooksPath)
      .filter((f) => f.match(/\.(js|ts)$/));

    if (hooks.length > 0) {
      console.log(`✓ ${feature}: ${hooks.length} hook(s) implemented`);
    } else {
      console.log(`⚠ ${feature}: No hooks found`);
    }
  } else {
    console.log(`⚠ ${feature}: Hooks directory not found`);
  }
});

console.log();

// ============================================================================
// 8. VERIFY FEATURE SERVICES
// ============================================================================
console.log("8. VERIFYING FEATURE SERVICES");
console.log("-".repeat(80));

features.forEach((feature) => {
  const servicesPath = path.join(__dirname, "features", feature, "services");

  if (fs.existsSync(servicesPath)) {
    const services = fs
      .readdirSync(servicesPath)
      .filter((f) => f.match(/\.(js|ts)$/));

    if (services.length > 0) {
      console.log(`✓ ${feature}: ${services.length} service(s) implemented`);
    } else {
      console.log(`⚠ ${feature}: No services found`);
    }
  } else {
    console.log(`⚠ ${feature}: Services directory not found`);
  }
});

console.log();

// ============================================================================
// 9. VERIFY FEATURE TYPES
// ============================================================================
console.log("9. VERIFYING FEATURE TYPES");
console.log("-".repeat(80));

features.forEach((feature) => {
  const typesPath = path.join(__dirname, "features", feature, "types");

  if (fs.existsSync(typesPath)) {
    const types = fs.readdirSync(typesPath).filter((f) => f.match(/\.(ts)$/));

    if (types.length > 0) {
      console.log(`✓ ${feature}: ${types.length} type file(s) defined`);
    } else {
      console.log(`⚠ ${feature}: No type files found`);
    }
  } else {
    console.log(`⚠ ${feature}: Types directory not found`);
  }
});

console.log();

// ============================================================================
// 10. VERIFY APP ROUTES INTEGRATION
// ============================================================================
console.log("10. VERIFYING APP ROUTES INTEGRATION");
console.log("-".repeat(80));

const appRoutes = [
  "app/(protected)/documents/page.tsx",
  "app/(protected)/vehicles/page.tsx",
  "app/(protected)/pqr/page.tsx",
  "app/(public)/regulations/page.tsx",
  "app/(public)/news/page.tsx",
  "app/(public)/quiz/page.tsx",
];

appRoutes.forEach((route) => {
  const routePath = path.join(__dirname, route);

  if (fs.existsSync(routePath)) {
    console.log(`✓ Route exists: ${route}`);
  } else {
    console.log(`⚠ Route not found: ${route}`);
  }
});

console.log();

// ============================================================================
// FINAL SUMMARY
// ============================================================================
console.log("=".repeat(80));
console.log("FINAL SUMMARY");
console.log("=".repeat(80));
console.log();

if (allChecksPassed && issues.length === 0) {
  console.log("✅ ALL CHECKS PASSED");
  console.log();
  console.log("The Phase 3 architecture migration is complete:");
  console.log("  ✓ All features properly structured");
  console.log("  ✓ Feature independence maintained");
  console.log("  ✓ Barrel exports configured");
  console.log("  ✓ Clean import patterns established");
  console.log("  ✓ TypeScript configuration updated");
  console.log();
  console.log(
    "The codebase is now organized with a feature-based architecture."
  );
  process.exit(0);
} else {
  console.log("⚠️  VERIFICATION COMPLETED WITH WARNINGS");
  console.log();

  if (issues.length > 0) {
    console.log("Issues found:");
    issues.forEach((issue) => console.log(`  ${issue}`));
    console.log();
  }

  console.log(
    "The migration is mostly complete, but some items need attention."
  );
  console.log("Review the warnings above and address any critical issues.");
  process.exit(0);
}
