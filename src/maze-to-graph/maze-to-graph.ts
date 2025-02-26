import { DX, DY } from "@/maze/gen";
import { E, N, S, W, U } from "@/maze/gen";

import { Vertex } from "./dijkstra-algorithm";

const isFaint = (gridValue: number, dx: number, dy: number) => {
  return (
    ((dx === 1 || dx === -1) && gridValue === 19) ||
    ((dy === 1 || dy === -1) && gridValue === 28)
  );
};

export const getVertexKey = (x: number, y: number, faint: boolean) => {
  let key = `${x},${y}`;
  if (faint) {
    key += "-faint";
  }
  return key;
};

/**
 * Converts a grid-based maze to a graph suitable for Dijkstra's algorithm
 *
 * @param grid The grid representation of the maze
 * @param initialX The starting X coordinate
 * @param initialY The starting Y coordinate
 * @returns A record mapping vertex names to Vertex objects
 */
export const convertGridToGraph = (
  grid: number[][],
  initialX: number,
  initialY: number
): Record<string, Vertex> => {
  throw new Error("Not implemented");
};
