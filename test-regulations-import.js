/**
 * Quick test to verify regulations feature can be imported
 */

console.log("Testing regulations feature imports...\n");

try {
  // Test service import
  const {
    regulationsService,
  } = require("./features/regulations/services/regulationsService");
  console.log("✓ regulationsService imported successfully");
  console.log(
    "  - Methods:",
    Object.keys(regulationsService).slice(0, 5).join(", "),
    "..."
  );

  // Test that service has expected methods
  const expectedMethods = [
    "fetchRegulations",
    "fetchRegulationById",
    "searchRegulations",
    "filterRegulations",
    "saveSelectedRegulation",
  ];

  let allMethodsPresent = true;
  for (const method of expectedMethods) {
    if (typeof regulationsService[method] !== "function") {
      console.log(`✗ Missing method: ${method}`);
      allMethodsPresent = false;
    }
  }

  if (allMethodsPresent) {
    console.log("✓ All expected service methods present");
  }

  // Test async fetch
  console.log("\nTesting fetchRegulations...");
  regulationsService.fetchRegulations().then((regulations) => {
    console.log(
      `✓ fetchRegulations returned ${regulations.length} regulations`
    );
    if (regulations.length > 0) {
      console.log(`  - First regulation: ${regulations[0].title}`);
    }
  });

  console.log("\n✓ All imports successful!");
} catch (error) {
  console.error("✗ Import failed:", error.message);
  process.exit(1);
}
