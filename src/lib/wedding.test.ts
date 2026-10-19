import { test, expect } from "bun:test";
import { wedding, programme } from "./wedding";

test("Nikkah starts at 10 AM Lagos time on November 7", () => {
  expect(wedding.date).toBe("2026-11-07T10:00:00+01:00");
  expect(programme.find((item) => item.title === "Nikkah ceremony")?.time).toBe("10:00 AM");
});
