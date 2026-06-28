import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import {
  addPdfPagesFromCanvas,
  applyChartExportOverlays,
  shouldIgnoreForHtml2Canvas,
  waitForAdminChartsReady,
} from "@/lib/admin/analytics-chart-capture";

type ExportElementToPdfOptions = {
  filename: string;
  backgroundColor?: string;
};

/** 画面表示どおりの DOM をキャプチャして PDF 化する */
export async function exportElementToPdf(
  element: HTMLElement,
  { filename, backgroundColor = "#0a0f18" }: ExportElementToPdfOptions,
): Promise<void> {
  const previousOverflow = element.style.overflow;
  element.style.overflow = "visible";

  try {
    window.scrollTo(0, 0);
    element.scrollIntoView({ block: "start", behavior: "instant" });
    await waitForAdminChartsReady(element);

    const removeOverlays = await applyChartExportOverlays(element);

    try {
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()));
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
      removeOverlays();
    }
  } finally {
    element.style.overflow = previousOverflow;
    window.dispatchEvent(new Event("resize"));
  }
}

export function getAnalyticsPeriodLabel(period: "day" | "week" | "month"): string {
  if (period === "week") return "週別";
  if (period === "month") return "月別";
  return "日別";
}
