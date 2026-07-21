import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";
import { fileURLToPath } from "node:url";
import {
  HandoffValidationError,
  runStage2,
  validateHandoff,
} from "../src/stage2.mjs";

const testDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(testDirectory, "..");
const rawPath = path.join(projectRoot, "data", "raw-tickets.json");
const schemaPath = path.join(projectRoot, "schemas", "triage.schema.json");
const handoffPath = path.join(projectRoot, "handoff", "triage.json");
const rawData = JSON.parse(fs.readFileSync(rawPath, "utf8"));
const schema = JSON.parse(fs.readFileSync(schemaPath, "utf8"));
const validHandoff = JSON.parse(fs.readFileSync(handoffPath, "utf8"));

function copyHandoff() {
  return structuredClone(validHandoff);
}

function validationErrors(handoff) {
  assert.throws(
    () => validateHandoff(rawData, schema, handoff),
    (error) => {
      assert.ok(error instanceof HandoffValidationError);
      validationErrors.last = error.errors;
      return true;
    },
  );
  return validationErrors.last;
}

test("valid handoff generates the complete report deterministically", () => {
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "mod3lab-stage2-"),
  );
  const outputPath = path.join(temporaryDirectory, "action-report.md");

  const firstRun = runStage2({ rawPath, schemaPath, handoffPath, outputPath });
  const firstFile = fs.readFileSync(outputPath, "utf8");
  const secondRun = runStage2({ rawPath, schemaPath, handoffPath, outputPath });

  assert.equal(firstRun.ticketCount, 10);
  assert.equal(firstRun.report, firstFile);
  assert.equal(secondRun.report, firstRun.report);
  assert.match(firstRun.report, /- Dataset version: synthetic-support-v1/);
  assert.match(firstRun.report, /- Workflow version: 1\.0/);
  assert.match(firstRun.report, /- Total tickets: 10/);
  assert.match(firstRun.report, /\| critical \| 1 \|/);
  assert.match(firstRun.report, /\| billing \| 3 \|/);
  assert.match(firstRun.report, /### TKT-010/);

  const criticalIndex = firstRun.report.indexOf("| critical | TKT-005 |");
  const highIndex = firstRun.report.indexOf("| high | TKT-001 |");
  const mediumIndex = firstRun.report.indexOf("| medium | TKT-003 |");
  const lowIndex = firstRun.report.indexOf("| low | TKT-004 |");
  assert.ok(criticalIndex < highIndex);
  assert.ok(highIndex < mediumIndex);
  assert.ok(mediumIndex < lowIndex);
});

test("invalid schema is rejected with a field-specific error", () => {
  const handoff = copyHandoff();
  delete handoff.tickets[0].category;

  const errors = validationErrors(handoff);
  assert.ok(errors.some((error) => error.includes("required property 'category'")));
});

test("a missing input ticket ID is rejected", () => {
  const handoff = copyHandoff();
  handoff.tickets = handoff.tickets.filter(
    ({ ticket_id }) => ticket_id !== "TKT-010",
  );

  assert.deepEqual(validationErrors(handoff), ["missing ticket IDs: TKT-010"]);
});

test("a duplicate ticket ID is rejected", () => {
  const handoff = copyHandoff();
  handoff.tickets.at(-1).ticket_id = "TKT-001";

  const errors = validationErrors(handoff);
  assert.ok(errors.includes("duplicate ticket IDs: TKT-001"));
  assert.ok(errors.includes("missing ticket IDs: TKT-010"));
});

test("an invented ticket ID is rejected", () => {
  const handoff = copyHandoff();
  handoff.tickets.at(-1).ticket_id = "TKT-999";

  const errors = validationErrors(handoff);
  assert.ok(errors.includes("invented ticket IDs: TKT-999"));
  assert.ok(errors.includes("missing ticket IDs: TKT-010"));
});

test("a dataset mismatch is rejected", () => {
  const handoff = copyHandoff();
  handoff.dataset_id = "different-dataset-v1";

  assert.deepEqual(validationErrors(handoff), [
    'dataset_id must be "synthetic-support-v1", received "different-dataset-v1"',
  ]);
});

test("clarification true with no information gaps is rejected", () => {
  const handoff = copyHandoff();
  handoff.tickets.at(-1).information_gaps = [];

  assert.deepEqual(validationErrors(handoff), [
    "TKT-010: needs_clarification is true but information_gaps is empty",
  ]);
});

test("clarification false with information gaps is rejected", () => {
  const handoff = copyHandoff();
  handoff.tickets[0].information_gaps = ["Unexpected gap"];

  assert.deepEqual(validationErrors(handoff), [
    "TKT-001: needs_clarification is false but information_gaps is not empty",
  ]);
});

test("an empty ticket list is rejected by the schema", () => {
  const handoff = copyHandoff();
  handoff.tickets = [];

  const errors = validationErrors(handoff);
  assert.ok(errors.some((error) => error.includes("must NOT have fewer than 1 items")));
});

test("the CLI returns non-zero and writes no report for invalid input", () => {
  const temporaryDirectory = fs.mkdtempSync(
    path.join(os.tmpdir(), "mod3lab-stage2-cli-"),
  );
  const invalidHandoffPath = path.join(temporaryDirectory, "invalid.json");
  const outputPath = path.join(temporaryDirectory, "should-not-exist.md");
  const handoff = copyHandoff();
  handoff.dataset_id = "wrong-dataset";
  fs.writeFileSync(invalidHandoffPath, JSON.stringify(handoff), "utf8");

  const result = spawnSync(
    process.execPath,
    [
      path.join(projectRoot, "scripts", "run-stage2.mjs"),
      invalidHandoffPath,
      outputPath,
      rawPath,
      schemaPath,
    ],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 1);
  assert.match(result.stderr, /dataset_id must be/);
  assert.equal(fs.existsSync(outputPath), false);
});
