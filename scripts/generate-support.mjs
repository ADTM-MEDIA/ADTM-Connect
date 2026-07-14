import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { assertValid, loadContext } from "./lib/context.mjs";
import { generateLabelSvg } from "./generate-label.mjs";
import { generatePrintPdf } from "./generate-print-pdf.mjs";
import { generateQrPng, generateQrSvg } from "./generate-qr.mjs";

export async function generateSupport(fixture, outputDir) {
  const context = await loadContext();
  const { bien, support } = fixture;
  assertValid(context.validateBien, bien, "Bien");
  assertValid(context.validateSupport, support, "Support");

  if (support.id_support !== support.code_source) throw new Error("ID_SUPPORT doit être identique à CODE_SOURCE");
  if (support.bien_associe !== bien.reference_projest) throw new Error("Le support ne correspond pas au bien");
  if (support.id_support !== bien.identifiant_panneau) throw new Error("Le panneau ne correspond pas à IDENTIFIANT_PANNEAU");
  const type = context.supportTypes.supportTypes.find(({ code }) => code === support.type_support);
  if (!type || type.prefix !== "PA") throw new Error("Cette phase accepte uniquement un panneau PA");

  const name = `${support.id_support}-v${support.version}`;
  const qrSvg = await generateQrSvg(support.url_destination, context.qrPreset);
  const qrPng = await generateQrPng(support.url_destination, context.qrPreset);
  const labelSvg = await generateLabelSvg({ bien, support, qrSvg, printPreset: context.printPreset });
  const pdf = await generatePrintPdf(labelSvg, context.printPreset);

  await mkdir(outputDir, { recursive: true });
  const files = {
    qrSvg: resolve(outputDir, `${name}.qr.svg`),
    qrPng: resolve(outputDir, `${name}.qr.png`),
    labelSvg: resolve(outputDir, `${name}.label.svg`),
    pdf: resolve(outputDir, `${name}.print.pdf`)
  };
  await Promise.all([
    writeFile(files.qrSvg, qrSvg),
    writeFile(files.qrPng, qrPng),
    writeFile(files.labelSvg, labelSvg),
    writeFile(files.pdf, pdf)
  ]);
  return { files, buffers: { qrSvg, qrPng, labelSvg, pdf }, context };
}

const invokedPath = process.argv[1] ? pathToFileURL(resolve(process.argv[1])).href : "";
if (import.meta.url === invokedPath) {
  const fixturePath = resolve(process.argv[2] || "tests/fixtures/VA1928-PA01.json");
  const outputDir = resolve(process.argv[3] || ".tmp/generated");
  const fixture = JSON.parse(await readFile(fixturePath, "utf8"));
  const result = await generateSupport(fixture, outputDir);
  console.log(`Génération terminée: ${basename(result.files.pdf)}`);
}
