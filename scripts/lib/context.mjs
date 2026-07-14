import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

export const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), "../..");

export async function readJson(relativePath) {
  return JSON.parse(await readFile(resolve(rootDir, relativePath), "utf8"));
}

export async function loadContext() {
  const [qrConfig, printConfig, supportTypes, bienSchema, supportSchema, resultSchema] = await Promise.all([
    readJson("config/qr-presets.json"),
    readJson("config/print-presets.json"),
    readJson("config/support-types.json"),
    readJson("schemas/bien.schema.json"),
    readJson("schemas/support.schema.json"),
    readJson("schemas/generation-result.schema.json")
  ]);

  const ajv = new Ajv2020({ allErrors: true, strict: false });
  addFormats(ajv);
  return {
    qrPreset: qrConfig.presets[qrConfig.defaultPreset],
    printPreset: printConfig.presets[printConfig.defaultPreset],
    supportTypes,
    validateBien: ajv.compile(bienSchema),
    validateSupport: ajv.compile(supportSchema),
    validateResult: ajv.compile(resultSchema)
  };
}

export function assertValid(validate, value, label) {
  if (!validate(value)) {
    throw new Error(`${label} invalide: ${JSON.stringify(validate.errors)}`);
  }
}
