import { getHeight } from "@/lib/utils";
import { getWidth } from "@/lib/utils";
import { createMaze } from "./gen";
import { SVG } from "./render-svg";

export function createMazeSvg(parent: HTMLDivElement) {
  const width = 10;
  const height = 10;
  const density = 50;
  const loops = true;
  const dropX = width / 2;
  const dropY = height / 2;
  const seed = "123";
  const curve = false;
  const renderSize = calculateRenderSize(540, 540);

  const grid = createMaze(
    seed,
    width,
    height,
    density,
    loops,
    dropX - 1,
    dropY - 1
  );

  const svg = new SVG(grid, {
    width,
    height,
    draw_with_curves: curve,
    pageWidth: renderSize.width,
    pageHeight: renderSize.height,
    color: `var(--strokeColor)`,
  });

  parent.innerHTML = svg.image();
  parent.style.width = `${renderSize.width}px`;
  parent.style.height = `${renderSize.height}px`;
}

function calculateRenderSize(pageWidth: number, pageHeight: number) {
  const screenWidth = getWidth();
  const screenHeight = getHeight();
  const paddingVertial = 32 * 2;
  const paddingHorizontal = 32 * 2;

  let width = pageWidth;
  let height = pageHeight;
  const effectiverWidth = pageWidth + paddingHorizontal;
  const effectiveHeight = pageHeight + paddingVertial;

  let ratio = 1;
  if (screenWidth > screenHeight && effectiveHeight > screenHeight) {
    ratio = screenHeight / effectiveHeight;
  } else if (screenWidth < screenHeight && effectiverWidth > screenWidth) {
    ratio = screenWidth / effectiverWidth;
  }

  width = Math.max(Math.floor(width * ratio), 240);
  height = Math.max(Math.floor(height * ratio), 240);

  return { width, height };
}
