/**
 * Demo script to manually test searchGlossaryTerms function
 * Run with: npx ts-node src/services/api-demo-searchGlossaryTerms.ts
 */

import { searchGlossaryTerms } from "./api";

async function testSearchGlossaryTerms() {
  console.log("=== Testing searchGlossaryTerms ===\n");

  try {
    console.log("Test 1: Searching for 'conductor'...");
    const results = await searchGlossaryTerms("conductor");
    console.log(`✓ Found ${results.length} results`);
    if (results.length > 0) {
      console.log("First result:", {
        id: results[0].id,
        wordName: results[0].wordName,
        wordValue: results[0].wordValue?.substring(0, 50) + "...",
      });
    }
    console.log();

    console.log("Test 2: Searching for non-existent term...");
    const emptyResults = await searchGlossaryTerms("xyzabc123");
    console.log(`✓ Found ${emptyResults.length} results (expected 0)`);
    console.log();

    console.log("All tests completed successfully!");
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    if (error.statusCode) {
      console.error("Status code:", error.statusCode);
    }
  }
}

// Run the tests
testSearchGlossaryTerms();
