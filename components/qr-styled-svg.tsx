"use client";

import { forwardRef, useMemo } from "react";
import QRCode from "qrcode";

export type QrModuleStyle = "classic" | "rounded" | "dot";

interface QrStyledSvgProps {
  value: string;
  size?: number;
  style?: QrModuleStyle;
  fgColor?: string;
  bgColor?: string;
  level?: "L" | "M" | "Q" | "H";
  marginSize?: number;
  className?: string;
  title?: string;
  "aria-hidden"?: boolean;
}

const ERROR_LEVEL_MAP = {
  L: "L" as const,
  M: "M" as const,
  Q: "Q" as const,
  H: "H" as const,
};

export const QrStyledSvg = forwardRef<SVGSVGElement, QrStyledSvgProps>(
  function QrStyledSvg(
    {
      value,
      size = 280,
      style = "classic",
      fgColor = "#000000",
      bgColor = "#ffffff",
      level = "M",
      marginSize = 2,
      className,
      title,
      "aria-hidden": ariaHidden,
    },
    ref
  ) {
    const qrData = useMemo(() => {
      try {
        return QRCode.create(value, {
          errorCorrectionLevel: ERROR_LEVEL_MAP[level],
        });
      } catch {
        return null;
      }
    }, [value, level]);

    const { viewBox, elements } = useMemo(() => {
      if (!qrData) {
        return { viewBox: "0 0 1 1", elements: null };
      }

      const modSize = qrData.modules.size;
      const data = qrData.modules.data;
      const numCells = modSize + marginSize * 2;
      const viewBox = `0 0 ${numCells} ${numCells}`;

      const cells: React.ReactNode[] = [];

      for (let row = 0; row < modSize; row++) {
        for (let col = 0; col < modSize; col++) {
          const idx = row * modSize + col;
          if (data[idx]) {
            const x = marginSize + col;
            const y = marginSize + row;

            if (style === "classic") {
              cells.push(
                <rect
                  key={`${row}-${col}`}
                  x={x}
                  y={y}
                  width={1}
                  height={1}
                  fill={fgColor}
                />
              );
            } else if (style === "rounded") {
              cells.push(
                <rect
                  key={`${row}-${col}`}
                  x={x}
                  y={y}
                  width={1}
                  height={1}
                  rx={0.4}
                  ry={0.4}
                  fill={fgColor}
                />
              );
            } else {
              cells.push(
                <circle
                  key={`${row}-${col}`}
                  cx={x + 0.5}
                  cy={y + 0.5}
                  r={0.45}
                  fill={fgColor}
                />
              );
            }
          }
        }
      }

      return {
        viewBox,
        elements: (
          <>
            <rect
              x={0}
              y={0}
              width={numCells}
              height={numCells}
              fill={bgColor}
            />
            {cells}
          </>
        ),
      };
    }, [qrData, marginSize, style, fgColor, bgColor]);

    if (!qrData) {
      return null;
    }

    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBox}
        width={size}
        height={size}
        className={className}
        aria-hidden={ariaHidden}
        shapeRendering="crispEdges"
      >
        {title ? <title>{title}</title> : null}
        {elements}
      </svg>
    );
  }
);
