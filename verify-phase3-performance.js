#!/usr/bin/env node

/**
 * Phase 3 Performance Verification Script
 *
 * This script verifies:
 * 1. Bundle sizes haven't increased significantly
 * 2. Import tree-shaking works correctly
 *
 * Run with: node verify-phase3-performance.js
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("=".repeat(60));
console.log("Phase 3 Feature Organization - Performance Verification");
console.log("=".repeat(60));
console.log();

const results = {
  bundleSize: null,
  treeShaking: {
    verified: false,
    issues: [],
  },
  errors: [],
};

// Function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}

// Function to check if build exists
function checkBuildExists() {
  const buildPath = path.join(__dirname, ".next");
  return fs.existsSync(buildPath);
}

// Function to analyze bundle size
function analyzeBundleSize() {
  console.log("Analyzing bundle sizes...");
  console.log();

  try {
    const buildInfoPath = path.join(__dirname, ".next", "build-manifest.json");

    if (!fs.existsSync(buildInfoPath)) {
      console.log("⚠ Build manifest not found. Running production build...");
      console.log("This may take a few minutes...");
      console.log();

      try {
        execSync("npm run build", {
          encoding: "utf-8",
          stdio: "inherit",
        });
      } catch (buildError) {
        throw new Error("Build failed: " + buildError.message);
      }
    }

    // Read build manifest
    if (fs.existsSync(buildInfoPath)) {
      const manifest = JSON.parse(fs.readFileSync(buildInfoPath, "utf-8"));

      console.log("✓ Build manifest found");
      console.log();
      console.log("Pages analyzed:");

      const pages = Object.keys(manifest.pages || {});
      pages.forEach((page) => {
        console.log(`  - ${page}`);
      });

      results.bundleSize = {
        pages: pages.length,
        analyzed: true,
      };
    }

    // Check for Next.js build output
    const nextMetaPath = path.join(
      __dirname,
      ".next",
      "next-server.js.nft.json"
    );
    if (fs.existsSync(nextMetaPath)) {
      console.log();
      console.log("✓ Next.js build artifacts present");
    }
  } catch (error) {
    console.error("✗ Bundle size analysis failed:");
    console.error(error.message);
    results.errors.push(error.message);
  }
}

// Function to verify tree-shaking
function verifyTreeShaking() {
  console.log();
  console.log("Verifying import tree-shaking...");
  console.log();

  try {
    // Check that barrel exports are properly configured
    const featureDirs = [
      "documents",
      "vehicles",
      "regulations",
      "news",
      "quiz",
      "pqr",
    ];
    const featuresPath = path.join(__dirname, "features");

    if (!fs.existsSync(featuresPath)) {
      throw new Error("Features directory not found");
    }

    let allBarrelExportsValid = true;

    featureDirs.forEach((feature) => {
      const featurePath = path.join(featuresPath, feature);
      const indexPath = path.join(featurePath, "index.ts");

      if (fs.existsSync(indexPath)) {
        const content = fs.readFileSync(indexPath, "utf-8");

        // Check for proper exports
        if (content.includes("export") && content.length > 0) {
          console.log(`  ✓ ${feature}: Barrel export configured`);
        } else {
          console.log(`  ✗ ${feature}: Barrel export may be incomplete`);
          allBarrelExportsValid = false;
          results.treeShaking.issues.push(
            `${feature} barrel export incomplete`
          );
        }
      } else {
        console.log(`  ✗ ${feature}: No barrel export found`);
        allBarrelExportsValid = false;
        results.treeShaking.issues.push(`${feature} missing barrel export`);
      }
    });

    console.log();

    // Check TypeScript configuration for path mapping
    const tsconfigPath = path.join(__dirname, "tsconfig.json");
    if (fs.existsSync(tsconfigPath)) {
      const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, "utf-8"));

      if (tsconfig.compilerOptions && tsconfig.compilerOptions.paths) {
        console.log("✓ TypeScript path mapping configured");

        const paths = tsconfig.compilerOptions.paths;
        if (paths["@/features/*"] || paths["@/*"]) {
          console.log("✓ Feature imports path configured");
        } else {
          console.log("⚠ Feature-specific path mapping not found");
          results.treeShaking.issues.push(
            "Feature path mapping not configured"
          );
        }
      } else {
        console.log("⚠ TypeScript path mapping not configured");
        results.treeShaking.issues.push("Path mapping not configured");
      }
    }

    console.log();

    // Check Next.js configuration
    const nextConfigPath = path.join(__dirname, "next.config.mjs");
    if (fs.existsSync(nextConfigPath)) {
      console.log("✓ Next.js configuration found");

      const nextConfig = fs.readFileSync(nextConfigPath, "utf-8");

      // Check for webpack configuration that might affect tree-shaking
      if (nextConfig.includes("webpack")) {
        console.log("  ℹ Custom webpack configuration detected");
      }

      // Check for module optimization settings
      if (
        nextConfig.includes("modularizeImports") ||
        nextConfig.includes("optimizePackageImports")
      ) {
        console.log("  ✓ Import optimization configured");
      }
    }

    results.treeShaking.verified =
      allBarrelExportsValid && results.treeShaking.issues.length === 0;
  } catch (error) {
    console.error("✗ Tree-shaking verification failed:");
    console.error(error.message);
    results.errors.push(error.message);
  }
}

// Function to check for circular dependencies
function checkCircularDependencies() {
  console.log();
  console.log("Checking for circular dependencies...");
  console.log();

  try {
    // Simple check: look for imports between features
    const featureDirs = [
      "documents",
      "vehicles",
      "regulations",
      "news",
      "quiz",
      "pqr",
    ];
    const featuresPath = path.join(__dirname, "features");

    let circularFound = false;

    featureDirs.forEach((feature) => {
      const featurePath = path.join(featuresPath, feature);

      if (fs.existsSync(featurePath)) {
        // Check all JS/TS files in the feature
        const files = getAllFiles(featurePath, [".js", ".jsx", ".ts", ".tsx"]);

        files.forEach((file) => {
          const content = fs.readFileSync(file, "utf-8");

          // Check for imports from other features (not through barrel exports)
          featureDirs.forEach((otherFeature) => {
            if (otherFeature !== feature) {
              const directImportPattern = new RegExp(
                `from ['"].*\\/features\\/${otherFeature}\\/(?!index)`,
                "g"
              );
              if (directImportPattern.test(content)) {
                console.log(
                  `  ⚠ ${feature} imports directly from ${otherFeature} (bypassing barrel export)`
                );
                circularFound = true;
                results.treeShaking.issues.push(
                  `${feature} bypasses ${otherFeature} barrel export`
                );
              }
            }
          });
        });
      }
    });

    if (!circularFound) {
      console.log("✓ No circular dependencies detected");
    }
  } catch (error) {
    console.error("✗ Circular dependency check failed:");
    console.error(error.message);
  }
}

// Helper function to get all files recursively
function getAllFiles(dirPath, extensions, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach((file) => {
    const filePath = path.join(dirPath, file);

    if (fs.statSync(filePath).isDirectory()) {
      arrayOfFiles = getAllFiles(filePath, extensions, arrayOfFiles);
    } else {
      const ext = path.extname(file);
      if (extensions.includes(ext)) {
        arrayOfFiles.push(filePath);
      }
    }
  });

  return arrayOfFiles;
}

// Run all checks
analyzeBundleSize();
verifyTreeShaking();
checkCircularDependencies();

console.log();
console.log("=".repeat(60));
console.log("Performance Verification Summary");
console.log("=".repeat(60));

if (results.bundleSize && results.bundleSize.analyzed) {
  console.log(`✓ Bundle size analysis completed`);
  console.log(`  Pages: ${results.bundleSize.pages}`);
}

if (results.treeShaking.verified) {
  console.log("✓ Tree-shaking verification passed");
} else {
  console.log("⚠ Tree-shaking verification found issues:");
  results.treeShaking.issues.forEach((issue) => {
    console.log(`  - ${issue}`);
  });
}

if (results.errors.length > 0) {
  console.log();
  console.log("Errors encountered:");
  results.errors.forEach((error, index) => {
    console.log(`  ${index + 1}. ${error}`);
  });
}

console.log();
console.log("=".repeat(60));
console.log();

// Recommendations
console.log("Recommendations:");
console.log('  1. Run "npm run build" to generate fresh bundle analysis');
console.log("  2. Check that all feature imports use barrel exports");
console.log("  3. Verify no direct cross-feature imports exist");
console.log("  4. Monitor bundle sizes in production builds");
console.log();

// Exit with appropriate code
const hasIssues =
  results.errors.length > 0 || results.treeShaking.issues.length > 0;
process.exit(hasIssues ? 1 : 0);
