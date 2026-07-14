import { readFile } from "node:fs/promises";
import { resolve } from "node:path";
import { rootDir } from "./lib/context.mjs";

const escapeXml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&apos;");

function qrBody(svg) {
  return svg
    .replace(/^<\?xml[^>]*>\s*/u, "")
    .replace(/^<svg[^>]*>/u, "")
    .replace(/<\/svg>\s*$/u, "");
}

export async function generateLabelSvg({ bien, support, qrSvg, printPreset }) {
  const template = await readFile(resolve(rootDir, "templates/labels/property-panel.svg"), "utf8");
  const width = printPreset.width;
  const height = printPreset.height;
  const qrSize = 31;
  const viewBoxMatch = qrSvg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/u);
  if (!viewBoxMatch) throw new Error("QR SVG sans viewBox exploitable");
  const sourceSize = Number(viewBoxMatch[1]);
  const replacements = {
    WIDTH_MM: width,
    HEIGHT_MM: height,
    BORDER_WIDTH: width - 1.2,
    BORDER_HEIGHT: height - 1.2,
    CENTER_X: width / 2,
    PROPERTY_NAME: escapeXml(bien.nom_bien),
    PROPERTY_REFERENCE: escapeXml(bien.reference_projest),
    SUPPORT_ID: escapeXml(support.id_support),
    VERSION: support.version,
    QR_X: (width - qrSize) / 2,
    QR_Y: 14,
    QR_SCALE: qrSize / sourceSize,
    QR_CONTENT: qrBody(qrSvg)
  };
  return Object.entries(replacements).reduce(
    (svg, [key, value]) => svg.replaceAll(`{{${key}}}`, String(value)),
    template
  );
}
