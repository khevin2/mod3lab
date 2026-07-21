import fs from "node:fs";
import path from "node:path";
import Ajv2020 from "ajv/dist/2020.js";

export const PRIORITIES = ["critical", "high", "medium", "low"];
export const CATEGORIES = [
  "account_access",
  "billing",
  "feature_request",
  "service_outage",
  "technical",
  "other",
];

export class HandoffValidationError extends Error {
  constructor(errors) {
    super("Stage 1 handoff failed validation");
    this.name = "HandoffValidationError";
    this.errors = errors;
  }
}

export function readJson(filePath, label) {
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

function semanticErrors(rawData, handoff) {
  const errors = [];

  if (handoff.dataset_id !== rawData.dataset_id) {
    errors.push(
      `dataset_id must be "${rawData.dataset_id}", received "${handoff.dataset_id}"`,
    );
  }

  const inputIds = rawData.tickets.map(({ ticket_id }) => ticket_id);
  const outputIds = handoff.tickets.map(({ ticket_id }) => ticket_id);
  const inputIdSet = new Set(inputIds);
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

  const inventedIds = outputIds.filter((id) => !inputIdSet.has(id));
  if (inventedIds.length > 0) {
    errors.push(`invented ticket IDs: ${[...new Set(inventedIds)].join(", ")}`);
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

export function validateHandoff(rawData, schema, handoff) {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  const validateSchema = ajv.compile(schema);

  if (!validateSchema(handoff)) {
    throw new HandoffValidationError(validateSchema.errors.map(formatAjvError));
  }

  const errors = semanticErrors(rawData, handoff);
  if (errors.length > 0) {
    throw new HandoffValidationError(errors);
  }
}

function compareTickets(left, right) {
  const priorityDifference =
    PRIORITIES.indexOf(left.priority) - PRIORITIES.indexOf(right.priority);
  if (priorityDifference !== 0) {
    return priorityDifference;
  }
  return left.ticket_id < right.ticket_id
    ? -1
    : left.ticket_id > right.ticket_id
      ? 1
      : 0;
}

function markdownCell(value) {
  return String(value)
    .replaceAll("\\", "\\\\")
    .replaceAll("|", "\\|")
    .replace(/\r?\n/g, "<br>");
}

function countBy(tickets, property, values) {
  return values.map((value) => [
    value,
    tickets.filter((ticket) => ticket[property] === value).length,
  ]);
}

export function buildActionReport(handoff) {
  const sortedTickets = [...handoff.tickets].sort(compareTickets);
  const clarificationTickets = sortedTickets.filter(
    ({ needs_clarification }) => needs_clarification,
  );
  const lines = [
    "# Prioritized Customer-Support Action Report",
    "",
    `- Dataset version: ${markdownCell(handoff.dataset_id)}`,
    `- Workflow version: ${markdownCell(handoff.workflow_version)}`,
    `- Total tickets: ${handoff.tickets.length}`,
    "",
    "This report formats the validated Stage 1 classifications without changing them.",
    "",
    "## Counts by priority",
    "",
    "| Priority | Count |",
    "| --- | ---: |",
    ...countBy(handoff.tickets, "priority", PRIORITIES).map(
      ([priority, count]) => `| ${priority} | ${count} |`,
    ),
    "",
    "## Counts by category",
    "",
    "| Category | Count |",
    "| --- | ---: |",
    ...countBy(handoff.tickets, "category", CATEGORIES).map(
      ([category, count]) => `| ${category} | ${count} |`,
    ),
    "",
    "## Priority-ordered tickets",
    "",
    "| Priority | Ticket ID | Category | Sentiment | Summary | Recommended action | Needs clarification |",
    "| --- | --- | --- | --- | --- | --- | --- |",
    ...sortedTickets.map(
      (ticket) =>
        `| ${ticket.priority} | ${ticket.ticket_id} | ${ticket.category} | ${ticket.sentiment} | ${markdownCell(ticket.summary)} | ${markdownCell(ticket.recommended_action)} | ${ticket.needs_clarification} |`,
    ),
    "",
    "## Clarification needed",
    "",
  ];

  if (clarificationTickets.length === 0) {
    lines.push("No tickets require clarification.", "");
  } else {
    for (const ticket of clarificationTickets) {
      lines.push(
        `### ${ticket.ticket_id}`,
        "",
        `- Summary: ${ticket.summary}`,
        `- Recommended action: ${ticket.recommended_action}`,
        "- Information gaps:",
        ...ticket.information_gaps.map((gap) => `  - ${gap}`),
        "",
      );
    }
  }

  return `${lines.join("\n").trimEnd()}\n`;
}

export function runStage2({ rawPath, schemaPath, handoffPath, outputPath }) {
  const rawData = readJson(rawPath, "Raw dataset");
  const schema = readJson(schemaPath, "Triage schema");
  const handoff = readJson(handoffPath, "Stage 1 handoff");

  validateHandoff(rawData, schema, handoff);
  const report = buildActionReport(handoff);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, report, "utf8");

  return { report, ticketCount: handoff.tickets.length };
}
