export type TicketScanStatus = "valid" | "invalid" | "duplicate";

export function getTicketScanStatus(
  rawTicketId: string,
  registeredTicketId: string,
  alreadyScanned: boolean
): TicketScanStatus {
  const ticketId = rawTicketId.trim().toUpperCase();
  if (!ticketId || ticketId !== registeredTicketId.trim().toUpperCase())
    return "invalid";
  return alreadyScanned ? "duplicate" : "valid";
}
