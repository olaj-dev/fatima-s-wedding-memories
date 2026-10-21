import { test } from "node:test";
import { strict as assert } from "node:assert";
import {
  wedding,
  programme,
  contacts,
  telHref,
  whatsappHref,
  dialDigits,
  noteToFatima,
  isLetterFullyOpen,
  MAX_UPLOAD_MB,
  bridalWeek,
  memoryCategories,
} from "./wedding";

test("Nikkah starts at 10 AM Lagos time on November 7", () => {
  assert.equal(wedding.date, "2026-11-07T10:00:00+01:00");
  assert.equal(programme.find((item) => item.title === "Nikkah ceremony")?.time, "10:00 AM");
});

test("contact cards carry no role text", () => {
  assert.deepEqual(contacts.map((c) => Object.keys(c)), [
    ["name", "phone"],
    ["name", "phone"],
  ]);
});

test("contact phones dial and open WhatsApp in international format", () => {
  const expected = [
    { name: "Bride", tel: "tel:+2347060636825", wa: "https://wa.me/2347060636825" },
    { name: "Groom", tel: "tel:+2347032455376", wa: "https://wa.me/2347032455376" },
  ];
  assert.equal(dialDigits("07060636825"), "2347060636825");
  assert.equal(contacts.length, expected.length);
  contacts.forEach((c, i) => {
    assert.equal(c.name, expected[i]?.name);
    assert.equal(telHref(c.phone), expected[i]?.tel);
    assert.equal(whatsappHref(c.phone), expected[i]?.wa);
  });
});

test("letter teaser shows the first two paragraphs before the reveal", () => {
  assert.equal(noteToFatima.teaserParagraphs, 2);
  assert.ok(noteToFatima.paragraphs.length > noteToFatima.teaserParagraphs);
  assert.equal(noteToFatima.signature, "Abdullateef");
  assert.ok(noteToFatima.dua.length > 0);
});

test("letter opens in full only on the Nikkah morning, November 7", () => {
  assert.equal(isLetterFullyOpen(new Date("2026-11-06T23:59:00+01:00")), false);
  assert.equal(isLetterFullyOpen(new Date("2026-11-07T00:00:00+01:00")), true);
  assert.equal(isLetterFullyOpen(new Date("2026-11-08T09:00:00+01:00")), true);
});

test("memory wall accepts uploads up to 1GB", () => {
  assert.equal(MAX_UPLOAD_MB, 1024);
});

test("bridal week covers Nov 3 to Nov 7 and matches the event tags", () => {
  assert.deepEqual(
    bridalWeek.map((d) => d.date),
    ["2026-11-03", "2026-11-04", "2026-11-05", "2026-11-06", "2026-11-07"],
  );
  const ids = memoryCategories.map((c) => c.id) as string[];
  for (const id of ["soiree", "dance", "henna", "engagement", "nikkah", "general"]) {
    assert.ok(ids.includes(id), `missing category: ${id}`);
  }
});
