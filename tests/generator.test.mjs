import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, stat } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import test from "node:test";
import { generateSupport } from "../scripts/generate-support.mjs";
import { assertValid } from "../scripts/lib/context.mjs";

const fixture = JSON.parse(await readFile(resolve("tests/fixtures/VA1928-PA01.json"), "utf8"));

test("VA1928-PA01 respecte les schémas V2 et produit les quatre formats", async (t) => {
  const output = await mkdtemp(join(tmpdir(), "adtm-connect-v2-"));
  t.after(() => rm(output, { recursive: true, force: true }));
  const result = await generateSupport(fixture, output);

  assertValid(result.context.validateBien, fixture.bien, "Bien");
  assertValid(result.context.validateSupport, fixture.support, "Support");
  assert.equal(fixture.support.id_support, "VA1928-PA01");
  assert.match(result.buffers.qrSvg, /<svg/u);
  assert.match(result.buffers.labelSvg, /width="50mm" height="60mm"/u);
  assert.match(result.buffers.labelSvg, /VA1928-PA01/u);
  assert.deepEqual([...result.buffers.qrPng.subarray(0, 8)], [137, 80, 78, 71, 13, 10, 26, 10]);
  assert.equal(result.buffers.pdf.subarray(0, 5).toString("ascii"), "%PDF-");

  for (const file of Object.values(result.files)) {
    assert.ok((await stat(file)).size > 100, `${file} doit être non vide`);
  }
});

test("une incohérence ID_SUPPORT/CODE_SOURCE est rejetée", async (t) => {
  const output = await mkdtemp(join(tmpdir(), "adtm-connect-v2-invalid-"));
  t.after(() => rm(output, { recursive: true, force: true }));
  const invalid = structuredClone(fixture);
  invalid.support.code_source = "VA1928-PA02";
  await assert.rejects(() => generateSupport(invalid, output), /ID_SUPPORT/u);
});
