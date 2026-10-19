export type GuestSide = "Bride" | "Groom";

export function createRsvpSubmission(
  side: GuestSide | null,
  attending: boolean | null,
  email: string,
  note: string,
) {
  if (side === null || attending === null) return null;
  return {
    full_name: side,
    attending,
    email: email.trim().slice(0, 120) || null,
    note: note.trim().slice(0, 500) || null,
  };
}