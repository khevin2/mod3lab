import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { HandoffValidationError, runStage2 } from "../src/stage2.mjs";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const [handoffArgument, outputArgument, rawArgument, schemaArgument] =
  process.argv.slice(2);

const paths = {
  handoffPath: path.resolve(projectRoot, handoffArgument ?? "handoff/triage.json"),
  outputPath: path.resolve(projectRoot, outputArgument ?? "output/action-report.md"),
  rawPath: path.resolve(projectRoot, rawArgument ?? "data/raw-tickets.json"),
  schemaPath: path.resolve(
    projectRoot,
    schemaArgument ?? "schemas/triage.schema.json",
  ),
};

try {
  const { ticketCount } = runStage2(paths);
  console.log(
    `Stage 2 completed: validated ${ticketCount} tickets and generated ${paths.outputPath}`,
  );
} catch (error) {
  if (error instanceof HandoffValidationError) {
    console.error(`${error.message}:`);
    for (const detail of error.errors) {
      console.error(`- ${detail}`);
    }
  } else {
    console.error(`Stage 2 failed: ${error.message}`);
  }
  process.exitCode = 1;
}
