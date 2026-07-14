import PDFDocument from "pdfkit";
import SVGtoPDF from "svg-to-pdfkit";

const MM_TO_PT = 72 / 25.4;

export async function generatePrintPdf(labelSvg, printPreset) {
  const width = printPreset.width * MM_TO_PT;
  const height = printPreset.height * MM_TO_PT;
  const document = new PDFDocument({ size: [width, height], margin: 0, compress: false });
  const chunks = [];
  document.on("data", (chunk) => chunks.push(chunk));
  const completed = new Promise((resolve, reject) => {
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);
  });
  SVGtoPDF(document, labelSvg, 0, 0, { width, height, preserveAspectRatio: "none" });
  document.end();
  return completed;
}
