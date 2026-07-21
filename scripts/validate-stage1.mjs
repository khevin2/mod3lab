import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const handoffPath = path.resolve(
  process.cwd(),
  process.argv[2] ?? "handoff/triage.json",
);

function readJson(filePath, label) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (error) {
    throw new Error(`${label} is not valid readable JSON: ${error.message}`);
  }
}

function formatAjvError(error) {
  const location = error.instancePath || "/";
  return `${location}: ${error.message}`;
}

function validateSemanticRules(rawData, handoff) {
  const errors = [];

  if (handoff.dataset_id !== rawData.dataset_id) {
    errors.push(
      `dataset_id must be "${rawData.dataset_id}", received "${handoff.dataset_id}"`,
    );
  }

  const inputIds = rawData.tickets.map(({ ticket_id }) => ticket_id);
  const outputIds = handoff.tickets.map(({ ticket_id }) => ticket_id);
  const outputIdSet = new Set(outputIds);

  const duplicateIds = outputIds.filter(
    (id, index) => outputIds.indexOf(id) !== index,
  );
  if (duplicateIds.length > 0) {
    errors.push(`duplicate ticket IDs: ${[...new Set(duplicateIds)].join(", ")}`);
  }

  const missingIds = inputIds.filter((id) => !outputIdSet.has(id));
  if (missingIds.length > 0) {
    errors.push(`missing ticket IDs: ${missingIds.join(", ")}`);
  }

  const inputIdSet = new Set(inputIds);
  const inventedIds = outputIds.filter((id) => !inputIdSet.has(id));
  if (inventedIds.length > 0) {
    errors.push(`invented ticket IDs: ${inventedIds.join(", ")}`);
  }

  for (const ticket of handoff.tickets) {
    if (ticket.needs_clarification && ticket.information_gaps.length === 0) {
      errors.push(
        `${ticket.ticket_id}: needs_clarification is true but information_gaps is empty`,
      );
    }
    if (!ticket.needs_clarification && ticket.information_gaps.length > 0) {
      errors.push(
        `${ticket.ticket_id}: needs_clarification is false but information_gaps is not empty`,
      );
    }
  }

  return errors;
}

try {
  const rawData = readJson(
    path.join(projectRoot, "data", "raw-tickets.json"),
    "Raw dataset",
  );
  const schema = readJson(
    path.join(projectRoot, "schemas", "triage.schema.json"),
    "Triage schema",
  );
  const handoff = readJson(handoffPath, "Stage 1 handoff");

  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validateSchema = ajv.compile(schema);
  const schemaIsValid = validateSchema(handoff);
  const errors = schemaIsValid
    ? []
    : validateSchema.errors.map(formatAjvError);

  errors.push(...validateSemanticRules(rawData, handoff));

  if (errors.length > 0) {
    console.error("Stage 1 handoff validation failed:");
    for (const error of errors) {
      console.error(`- ${error}`);
    }
    process.exitCode = 1;
  } else {
    console.log(
      `Stage 1 handoff passed JSON Schema and semantic validation for ${handoff.tickets.length} tickets.`,
    );
  }
} catch (error) {
  console.error(`Stage 1 handoff validation failed: ${error.message}`);
  process.exitCode = 1;
}

