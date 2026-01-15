#!/usr/bin/env node

/**
 * Phase 3 Test Verification Script
 *
 * This script verifies that all tests pass after the Phase 3 migration.
 * Run with: node verify-phase3-tests.js
 */

const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");

console.log("=".repeat(60));
console.log("Phase 3 Feature Organization - Test Verification");
console.log("=".repeat(60));
console.log();

// Test execution results
const results = {
  totalTests: 0,
  passedTests: 0,
  failedTests: 0,
  errors: [],
};

try {
  console.log("Running comprehensive test suite...");
  console.log();

  // Run Jest with coverage
  const output = execSync("npx jest --ci --coverage --passWithNoTests", {
    encoding: "utf-8",
    stdio: "pipe",
  });

  console.log(output);

  // Parse test results
  const testMatch = output.match(/Tests:\s+(\d+)\s+passed,\s+(\d+)\s+total/);
  if (testMatch) {
    results.passedTests = parseInt(testMatch[1]);
    results.totalTests = parseInt(testMatch[2]);
  }

  console.log();
  console.log("✓ All tests passed successfully!");
} catch (error) {
  console.error("✗ Test execution failed:");
  console.error(error.message);

  if (error.stdout) {
    console.log();
    console.log("Test output:");
    console.log(error.stdout.toString());
  }

  results.errors.push(error.message);
}

console.log();
console.log("=".repeat(60));
console.log("Test Summary");
console.log("=".repeat(60));
console.log(`Total Tests: ${results.totalTests}`);
console.log(`Passed: ${results.passedTests}`);
console.log(`Failed: ${results.failedTests}`);

if (results.errors.length > 0) {
  console.log();
  console.log("Errors:");
  results.errors.forEach((error, index) => {
    console.log(`  ${index + 1}. ${error}`);
  });
}

console.log();
console.log("=".repeat(60));

// Check for coverage report
const coveragePath = path.join(
  __dirname,
  "coverage",
  "lcov-report",
  "index.html"
);
if (fs.existsSync(coveragePath)) {
  console.log(`Coverage report available at: ${coveragePath}`);
}

console.log();

// Exit with appropriate code
process.exit(results.errors.length > 0 ? 1 : 0);
