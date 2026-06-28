"use client";

import Box from "@mui/material/Box";
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactElement } from "react";
import { ResponsiveContainer } from "recharts";

interface AdminChartBoxProps {
  height: number;
  children: ReactElement;
}

/**
 * 管理画面グラフ用。
 * Recharts 3 では ResponsiveContainer に % 指定すると初期 -1 警告が出るため、
 * 親要素の幅を計測してから数値 width/height を渡す。
 */
export default function AdminChartBox({ height, children }: AdminChartBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState(0);

  const syncWidth = useCallback(() => {
    const node = containerRef.current;
    if (!node) return;
    const next = Math.floor(node.getBoundingClientRect().width);
    if (next > 0) {
      setWidth((prev) => (prev === next ? prev : next));
    }
  }, []);

  useLayoutEffect(() => {
    syncWidth();
  }, [syncWidth]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;

    syncWidth();
    const observer = new ResizeObserver(() => syncWidth());
    observer.observe(node);
    window.addEventListener("resize", syncWidth);

    return () => {
      observer.disconnect();
      window.removeEventListener("resize", syncWidth);
    };
  }, [syncWidth]);

  return (
    <Box
      ref={containerRef}
      data-admin-chart
      data-chart-height={height}
      sx={{
        width: "100%",
        height,
        minWidth: 0,
        minHeight: height,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {width > 0 ? (
        <ResponsiveContainer width={width} height={height}>
          {children}
        </ResponsiveContainer>
      ) : null}
    </Box>
  );
}
