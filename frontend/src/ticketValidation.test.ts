import { getTicketScanStatus } from "./ticketValidation.ts";

const registered = "TKT-2026-E1-R1";
const randomTicket = `TKT-2026-RANDOM-${crypto.randomUUID()}`;
const checks: [string, boolean, string][] = [
  [registered, false, "valid"],
  [randomTicket, false, "invalid"],
  [registered, true, "duplicate"],
  ["  tkt-2026-e1-r1  ", false, "valid"],
];
for (const [ticketId, scanned, expected] of checks) {
  const actual = getTicketScanStatus(ticketId, registered, scanned);
  if (actual !== expected) throw new Error(`${ticketId}: expected ${expected}, received ${actual}`);
}
console.log("Ticket scanner validation passed: valid, random, duplicate, and normalized IDs.");
