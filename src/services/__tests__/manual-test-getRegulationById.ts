/**
 * Manual test script for getRegulationById
 * This can be run to verify the function works correctly
 */
import { getRegulationById } from "../api";

async function testGetRegulationById() {
  console.log("Testing getRegulationById function...\n");

  // Test 1: Valid ID (will fail if backend is not running)
  try {
    console.log("Test 1: Fetching regulation with valid ID");
    const regulation = await getRegulationById("test-id-123");
    console.log("✓ Success:", regulation);
  } catch (error: any) {
    console.log("✗ Expected error (backend not running):", error.message);
  }

  // Test 2: 404 case
  try {
    console.log("\nTest 2: Fetching regulation with non-existent ID");
    await getRegulationById("nonexistent-id");
    console.log("✗ Should have thrown an error");
  } catch (error: any) {
    console.log("✓ Correctly threw error:", error.message);
    console.log("  Status code:", error.statusCode);
  }

  console.log("\nManual tests completed!");
}

// Uncomment to run:
// testGetRegulationById();
