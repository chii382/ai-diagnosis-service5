import html2canvas from "html2canvas";
import type { jsPDF } from "jspdf";

const CHART_CAPTURE_BG = "#0a0f18";

function isLineChartNode(node: HTMLElement): boolean {
  return node.querySelector(".recharts-line, .recharts-line-curve") !== null;
}

function isChartReady(node: HTMLElement): boolean {
  const svg = node.querySelector("svg.recharts-surface");
  if (!svg) return false;
  const rect = svg.getBoundingClientRect();
  return rect.width > 10 && rect.height > 10;
}

function prepareSvgForExport(svg: SVGSVGElement): SVGSVGElement {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  const width =
    clone.width.baseVal.value || Number(clone.getAttribute("width")) || svg.getBoundingClientRect().width;
  const height =
    clone.height.baseVal.value || Number(clone.getAttribute("height")) || svg.getBoundingClientRect().height;
  const viewBox = clone.getAttribute("viewBox");

  clone.setAttribute("width", String(Math.round(width)));
  clone.setAttribute("height", String(Math.round(height)));
  if (viewBox) {
    clone.setAttribute("viewBox", viewBox);
  }
  if (!clone.getAttribute("xmlns")) {
    clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  }

  clone.querySelectorAll("path").forEach((path) => {
    path.setAttribute("fill", "none");
  });

  clone.querySelectorAll(".recharts-tooltip-cursor, .recharts-active-dot").forEach((node) => {
    node.remove();
  });

  return clone;
}

async function rasterizeBarChartSvg(svg: SVGSVGElement): Promise<string> {
  const prepared = prepareSvgForExport(svg);
  const serialized = new XMLSerializer().serializeToString(prepared);
  const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(serialized)}`;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = 2;
      const width = img.naturalWidth || prepared.width.baseVal.value;
      const height = img.naturalHeight || prepared.height.baseVal.value;
      const canvas = document.createElement("canvas");
      canvas.width = Math.max(1, Math.round(width * scale));
      canvas.height = Math.max(1, Math.round(height * scale));
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("グラフ画像の生成に失敗しました"));
        return;
      }
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/png"));
    };
    img.onerror = () => reject(new Error("グラフ画像の変換に失敗しました"));
    img.src = svgUrl;
  });
}

/** 折れ線グラフは SVG 直変換で clipPath / animation が壊れるため DOM をそのままキャプチャ */
async function captureLineChartWrapper(wrapper: HTMLElement): Promise<string> {
  const canvas = await html2canvas(wrapper, {
    scale: 2,
    backgroundColor: CHART_CAPTURE_BG,
    logging: false,
    ignoreElements: shouldIgnoreForHtml2Canvas,
  });
  return canvas.toDataURL("image/png");
}

async function captureChartImage(node: HTMLElement): Promise<{
  pngDataUrl: string;
  overlayTop: number;
  overlayLeft: number;
  overlayWidth: number;
  overlayHeight: number;
}> {
  const nodeRect = node.getBoundingClientRect();

  if (isLineChartNode(node)) {
    const wrapper = node.querySelector<HTMLElement>(".recharts-wrapper");
    if (!wrapper) {
      throw new Error("折れ線グラフのキャプチャに失敗しました");
    }
    const wrapperRect = wrapper.getBoundingClientRect();
    const pngDataUrl = await captureLineChartWrapper(wrapper);

    return {
      pngDataUrl,
      overlayTop: wrapperRect.top - nodeRect.top,
      overlayLeft: wrapperRect.left - nodeRect.left,
      overlayWidth: wrapperRect.width,
      overlayHeight: wrapperRect.height,
    };
  }

  const svg = node.querySelector("svg.recharts-surface");
  if (!(svg instanceof SVGSVGElement)) {
    throw new Error("グラフのキャプチャに失敗しました");
  }

  const svgRect = svg.getBoundingClientRect();
  const pngDataUrl = await rasterizeBarChartSvg(svg);

  return {
    pngDataUrl,
    overlayTop: svgRect.top - nodeRect.top,
    overlayLeft: svgRect.left - nodeRect.left,
    overlayWidth: svgRect.width,
    overlayHeight: svgRect.height,
  };
}

export async function waitForAdminChartsReady(root: HTMLElement): Promise<void> {
  window.dispatchEvent(new Event("resize"));

  for (let attempt = 0; attempt < 50; attempt += 1) {
    const charts = root.querySelectorAll<HTMLElement>("[data-admin-chart]");
    const ready = charts.length > 0 && Array.from(charts).every(isChartReady);

    if (ready) {
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 350);
      });
      return;
    }

    window.dispatchEvent(new Event("resize"));
    await new Promise<void>((resolve) => {
      window.setTimeout(resolve, 100);
    });
  }
}

/** キャプチャ直前にグラフを PNG オーバーレイへ差し替え（React DOM は保持） */
export async function applyChartExportOverlays(root: HTMLElement): Promise<() => void> {
  const cleanups: Array<() => void> = [];
  const charts = root.querySelectorAll<HTMLElement>("[data-admin-chart]");

  for (const node of charts) {
    const { pngDataUrl, overlayTop, overlayLeft, overlayWidth, overlayHeight } =
      await captureChartImage(node);
    const chartRoot = node.querySelector<HTMLElement>(".recharts-responsive-container");

    if (chartRoot) {
      chartRoot.dataset.html2canvasIgnore = "true";
      chartRoot.style.display = "none";
    }

    const previousPosition = node.style.position;
    if (!previousPosition || previousPosition === "static") {
      node.style.position = "relative";
    }

    const img = document.createElement("img");
    img.src = pngDataUrl;
    img.alt = "";
    img.dataset.exportOverlay = "true";
    img.style.position = "absolute";
    img.style.top = `${overlayTop}px`;
    img.style.left = `${overlayLeft}px`;
    img.style.width = `${overlayWidth}px`;
    img.style.height = `${overlayHeight}px`;
    img.style.display = "block";
    img.style.pointerEvents = "none";
    node.appendChild(img);

    cleanups.push(() => {
      img.remove();
      if (chartRoot) {
        delete chartRoot.dataset.html2canvasIgnore;
        chartRoot.style.display = "";
      }
      if (!previousPosition || previousPosition === "static") {
        node.style.position = previousPosition;
      }
    });
  }

  await new Promise<void>((resolve) => {
    window.setTimeout(resolve, 150);
  });

  return () => {
    cleanups.forEach((cleanup) => cleanup());
  };
}

export function shouldIgnoreForHtml2Canvas(node: Element): boolean {
  if (node instanceof HTMLElement && node.dataset.html2canvasIgnore === "true") {
    return true;
  }

  if (node.tagName === "SCRIPT" || node.tagName === "NOSCRIPT" || node.tagName === "IFRAME") {
    return true;
  }

  if (node instanceof HTMLImageElement) {
    const src = node.currentSrc || node.src;
    if (src.startsWith("chrome-extension://") || src.startsWith("moz-extension://")) {
      return true;
    }
  }

  if (node instanceof HTMLElement) {
    const id = node.id.toLowerCase();
    if (
      id.includes("grammarly") ||
      id.includes("extension") ||
      id.startsWith("chrome-") ||
      id.startsWith("firefox-")
    ) {
      return true;
    }
  }

  return false;
}

export function addPdfPagesFromCanvas(
  pdf: jsPDF,
  canvas: HTMLCanvasElement,
  margin: number,
): void {
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  const printableHeight = pageHeight - margin * 2;
  const sliceHeightPx = Math.floor((printableHeight * canvas.width) / contentWidth);

  let offsetY = 0;
  let pageIndex = 0;

  while (offsetY < canvas.height) {
    const heightPx = Math.min(sliceHeightPx, canvas.height - offsetY);
    const sliceCanvas = document.createElement("canvas");
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = heightPx;

    const ctx = sliceCanvas.getContext("2d");
    if (!ctx) {
      throw new Error("PDFの生成に失敗しました");
    }

    ctx.drawImage(canvas, 0, offsetY, canvas.width, heightPx, 0, 0, canvas.width, heightPx);

    const sliceHeightMm = (heightPx * contentWidth) / canvas.width;
    const sliceData = sliceCanvas.toDataURL("image/png");

    if (pageIndex > 0) {
      pdf.addPage();
    }
    pdf.addImage(sliceData, "PNG", margin, margin, contentWidth, sliceHeightMm);

    offsetY += heightPx;
    pageIndex += 1;
  }
}
