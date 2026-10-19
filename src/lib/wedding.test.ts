import { test, expect } from "bun:test";
import { wedding, programme } from "./wedding";
import { createRsvpSubmission } from "./rsvp";

test("Nikkah starts at 10 AM Lagos time on November 7", () => {
  expect(wedding.date).toBe("2026-11-07T10:00:00+01:00");
  expect(programme.find((item) => item.title === "Nikkah ceremony")?.time).toBe("10:00 AM");
});

test("RSVP accepts Bride instead of a guest name", () => {
  expect(createRsvpSubmission("Bride", true, "", "")).toEqual({
    full_name: "Bride", attending: true, email: null, note: null,
  });
});

test("RSVP accepts Groom instead of a guest name", () => {
  expect(createRsvpSubmission("Groom", false, "", "")?.full_name).toBe("Groom");
});

test("RSVP requires a guest side and attendance choice", () => {
  expect(createRsvpSubmission(null, true, "", "")).toBeNull();
  expect(createRsvpSubmission("Bride", null, "", "")).toBeNull();
});