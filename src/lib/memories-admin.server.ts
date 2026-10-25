// Server-only: never shipped to the browser.
const ADMIN_PIN = "0711";

export function isValidAdminPin(pin: string) {
  return typeof pin === "string" && pin.trim() === ADMIN_PIN;
}
