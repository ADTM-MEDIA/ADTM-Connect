import QRCode from "qrcode";

function options(preset) {
  return {
    errorCorrectionLevel: preset.errorCorrectionLevel,
    margin: preset.marginModules,
    color: { dark: preset.foreground, light: preset.background }
  };
}

export async function generateQrSvg(url, preset) {
  return QRCode.toString(url, { ...options(preset), type: "svg" });
}

export async function generateQrPng(url, preset) {
  return QRCode.toBuffer(url, {
    ...options(preset),
    type: "png",
    width: preset.pngPreviewSizePx
  });
}
