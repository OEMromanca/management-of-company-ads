import cypress from "cypress";

type RunResult = Awaited<ReturnType<typeof cypress.run>>;

function isRunResult(
  result: RunResult
): result is CypressCommandLine.CypressRunResult {
  return !!result && "totalPassed" in result && "totalFailed" in result;
}

const browser = process.argv[2] || "chrome";

cypress
  .run({ browser })
  .then((results) => {
    if (results && isRunResult(results)) {
      console.log(
        `✅ Tests finished. Passed: ${results.totalPassed}, Failed: ${results.totalFailed}`
      );
      process.exit(results.totalFailed > 0 ? 1 : 0);
    } else {
      console.error("❌ Cypress run failed before tests could start", results);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("❌ Cypress error:", err);
    process.exit(1);
  });
