import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const page = await readFile(new URL("../bien/VA1932/index.html", import.meta.url), "utf8");
const property = JSON.parse(await readFile(new URL("../bien/VA1932/property.json", import.meta.url), "utf8"));
const profile = await readFile(new URL("../lucas-werny/index.html", import.meta.url), "utf8");
const legacyProfile = await readFile(new URL("../lucas-verny/index.html", import.meta.url), "utf8");
const existingFixture = JSON.parse(await readFile(new URL("./fixtures/VA1928-PA01.json", import.meta.url), "utf8"));

test("la fiche VA1932 expose les informations et les contacts attendus", () => {
  assert.equal(property.reference_projest, "VA1932");
  assert.equal(property.prix_eur, 55000);
  assert.equal(property.surface_m2, 63.25);
  assert.equal(property.conseiller.telephone, "+33777818100");
  assert.match(page, /Référence VA1932/u);
  assert.match(page, /55 000 €/u);
  assert.match(page, /tel:\+33777818100/u);
  assert.match(page, /wa\.me\/33777818100/u);
});

test("les deux entrées de la fiche sont suspendues sans modifier les biens conservés", () => {
  for (const entry of [profile, legacyProfile]) {
    assert.match(entry, /<h1>Service temporairement indisponible<\/h1>/u);
    assert.doesNotMatch(entry, /<(?:a|script|iframe|form|img|link)\b/iu);
    assert.doesNotMatch(entry, /tel:|mailto:|wa\.me|projest|VA1932|Lucas/iu);
    assert.doesNotMatch(entry, /http-equiv\s*=\s*["']?refresh/iu);
  }
  assert.equal(existingFixture.bien.reference_projest, "VA1928");
  assert.match(page, /VA1932/u);
});
