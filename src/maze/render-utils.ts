import { getHeight } from "@/lib/utils";
import { getWidth } from "@/lib/utils";

import { SVG } from "./render-svg";

export function createMazeSvg(
  width: number,
  height: number,
  grid: number[][],
  parent: HTMLDivElement,
  renderSize: { width: number; height: number },
  curved: boolean = false
) {
  const svg = new SVG(grid, {
    width,
    height,
    draw_with_curves: curved,
    pageWidth: renderSize.width,
    pageHeight: renderSize.height,
    color: `var(--strokeColor)`,
  });

  parent.innerHTML = svg.image();
  parent.style.width = `${renderSize.width}px`;
  parent.style.height = `${renderSize.height}px`;

  return svg;
}

export function calculateRenderSize(
  maxWidth: number,
  maxHeight: number,
  minWidth: number,
  minHeight: number,
  padding: number = 32
) {
  const screenWidth = getWidth();
  const screenHeight = getHeight();
  const paddingVertial = padding * 2;
  const paddingHorizontal = padding * 2;

  let width = maxWidth;
  let height = maxHeight;
  const effectiverWidth = maxWidth + paddingHorizontal;
  const effectiveHeight = maxHeight + paddingVertial;

  let ratio = 1;
  if (screenWidth > screenHeight && effectiveHeight > screenHeight) {
    ratio = screenHeight / effectiveHeight;
  } else if (screenWidth < screenHeight && effectiverWidth > screenWidth) {
    ratio = screenWidth / effectiverWidth;
  }

  width = Math.max(Math.floor(width * ratio), minWidth);
  height = Math.max(Math.floor(height * ratio), minHeight);

  return { width, height };
}
