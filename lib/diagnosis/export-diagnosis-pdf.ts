import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  addPdfPagesFromCanvas,
  shouldIgnoreForHtml2Canvas,
} from "@/lib/admin/analytics-chart-capture";

type ExportDiagnosisResultToPdfOptions = {
  filename: string;
  backgroundColor?: string;
};

const PDF_CAPTURE_CLASS = "diagnosis-pdf-export-capture";

/** 診断結果画面の DOM をキャプチャして PDF 化する */
export async function exportDiagnosisResultToPdf(
  element: HTMLElement,
  { filename, backgroundColor = "#0a0f18" }: ExportDiagnosisResultToPdfOptions,
): Promise<void> {
  const previousOverflow = element.style.overflow;
  element.style.overflow = "visible";
  element.classList.add(PDF_CAPTURE_CLASS);

  try {
    window.scrollTo(0, 0);
    element.scrollIntoView({ block: "start", behavior: "instant" });

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
    });
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 350);
    });

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      backgroundColor,
      logging: false,
      ignoreElements: shouldIgnoreForHtml2Canvas,
    });

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error("PDFの生成に失敗しました。ページを再読み込みして再度お試しください。");
    }

    const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    addPdfPagesFromCanvas(pdf, canvas, 8);
    pdf.save(filename);
  } finally {
    element.classList.remove(PDF_CAPTURE_CLASS);
    element.style.overflow = previousOverflow;
    window.dispatchEvent(new Event("resize"));
  }
}

export function buildDiagnosisPdfFilename(diagnosisId: string, createdAt: string | Date): string {
  const date =
    createdAt instanceof Date
      ? createdAt.toISOString().slice(0, 10)
      : new Date(createdAt).toISOString().slice(0, 10);
  const shortId = diagnosisId.slice(-8);
  return `diagnosis-result-${date}-${shortId}.pdf`;
}
