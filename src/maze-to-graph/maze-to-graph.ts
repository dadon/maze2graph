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
  const vertices: Record<string, Vertex> = {};
  const visited = new Set<string>();

  // Helper function to get or create a vertex
  const getOrCreateVertex = (x: number, y: number, faint: boolean): Vertex => {
    const key = getVertexKey(x, y, faint);
    if (!vertices[key]) {
      // Initialize with empty nodes and default weight
      vertices[key] = new Vertex(key, [], Number.MAX_VALUE);
    }
    return vertices[key];
  };

  // Helper function to process a cell in the grid
  const processCell = (x: number, y: number) => {
    const vertexKey = getVertexKey(x, y, false); // Start cells are never faint

    // Skip if already visited
    if (visited.has(vertexKey)) {
      return;
    }

    visited.add(vertexKey);

    for (const direction of [N, S, E, W]) {
      if (!(grid[y][x] & direction)) {
        continue;
      }

      const dx = DX[direction];
      const dy = DY[direction];

      let nx = x + dx;
      let ny = y + dy;
      let gridValue = grid[ny][nx];
      const faint = isFaint(gridValue, dx, dy);

      let currentVertex = getOrCreateVertex(x, y, false);
      let neighborVertex = getOrCreateVertex(nx, ny, faint);

      // Add edge (with weight 1 for simplicity)
      let connectionAdded = false;
      if (
        !currentVertex.nodes.some(
          (node) => node.nameOfVertex === neighborVertex.name
        )
      ) {
        currentVertex.nodes.push({
          nameOfVertex: neighborVertex.name,
          weight: 1,
        });
        connectionAdded = true;
      }

      if (
        !neighborVertex.nodes.some(
          (node) => node.nameOfVertex === currentVertex.name
        )
      ) {
        neighborVertex.nodes.push({
          nameOfVertex: currentVertex.name,
          weight: 1,
        });
      }

      if (!connectionAdded) {
        continue;
      }

      // Handle "jump over" cells (marked with U)
      while (gridValue & U) {
        currentVertex = neighborVertex;

        nx += dx;
        ny += dy;

        gridValue = grid[ny][nx];
        const nextFaint = isFaint(gridValue, dx, dy);
        neighborVertex = getOrCreateVertex(nx, ny, nextFaint);

        // Connect vertices
        if (
          !currentVertex.nodes.some(
            (node) => node.nameOfVertex === neighborVertex.name
          )
        ) {
          currentVertex.nodes.push({
            nameOfVertex: neighborVertex.name,
            weight: 1,
          });
        }

        if (
          !neighborVertex.nodes.some(
            (node) => node.nameOfVertex === currentVertex.name
          )
        ) {
          neighborVertex.nodes.push({
            nameOfVertex: currentVertex.name,
            weight: 1,
          });
        }
      }

      // Continue exploring from the neighbor
      processCell(nx, ny);
    }
  };

  // Start processing from the initial coordinates
  processCell(initialX, initialY);

  return vertices;
};
