import { spawn } from "child_process";
import cypress from "cypress";

const browser = process.argv[2] || "chrome";

const server = spawn("npm", ["--workspace", "server", "run", "dev"], {
  stdio: "inherit",
  shell: true,
});

const waitForServer = () =>
  new Promise<void>((resolve) => setTimeout(resolve, 5000)); // 5 sekúnd

waitForServer()
  .then(() => cypress.run({ browser }))
  .then((results) => {
    // typ guard pre Cypress výsledok
    if ("totalFailed" in results) {
      process.exit(results.totalFailed > 0 ? 1 : 0);
    } else {
      console.error("Cypress run failed before tests could start", results);
      process.exit(1);
    }
  })
  .finally(() => {
    // kill server
    server.kill();
  })
  .catch((err) => {
    console.error(err);
    server.kill();
    process.exit(1);
  });
