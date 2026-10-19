import { test } from "node:test";
import { strict as assert } from "node:assert";
import { wedding, programme, contacts, telHref, whatsappHref, dialDigits } from "./wedding";

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
