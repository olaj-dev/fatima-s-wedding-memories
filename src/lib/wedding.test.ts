import { test } from "node:test";
import { strict as assert } from "node:assert";
import { wedding, programme } from "./wedding";

test("Nikkah starts at 10 AM Lagos time on November 7", () => {
  assert.equal(wedding.date, "2026-11-07T10:00:00+01:00");
  assert.equal(programme.find((item) => item.title === "Nikkah ceremony")?.time, "10:00 AM");
});
