import Rand from "rand-seed";

import { getRandomInt, shuffle } from "@/lib/utils";
import { Tree } from "./tree";

/**
 * An implementation of a "weave" maze generator. Weave mazes are those
 * with passages that pass both over and under other passages. The
 * technique used in this program was described by Robin Houston,
 * and works by first decorating the blank grid with the over/under
 * crossings, and then using Kruskal's algorithm to fill out the rest
 * of the grid. (Kruskal's is very well-suited to this approach, since
 * it treats the cells as separate sets and joins them together.)
 *
 * Please note: this program was oringinally ported from
 * https://gist.github.com/856138
 */

export const N = 1,
  S = 2,
  E = 4,
  W = 8,
  U = 16;

export const DX: Record<number, number> = { [E]: 1, [W]: -1, [N]: 0, [S]: 0 };
export const DY: Record<number, number> = { [E]: 0, [W]: 0, [N]: -1, [S]: 1 };

export const OPPOSITE: Record<number, number> = {
  [E]: W,
  [W]: E,
  [N]: S,
  [S]: N,
};

export function createMaze(
  seed: string,
  width: number,
  height: number,
  density: number,
  addALoop: boolean,
  startX?: number,
  startY?: number
): number[][] {
  const rand = new Rand(seed);
  const randomFunction = () => rand.next();

  const grid: number[][] = Array(height)
    .fill(0)
    .map(() => Array(width).fill(0));
  const sets: Tree[][] = Array(height)
    .fill(0)
    .map(() =>
      Array(width)
        .fill(0)
        .map(() => new Tree())
    );

  let edges: [number, number, number][] = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (y > 0) edges.push([x, y, N]);
      if (x > 0) edges.push([x, y, W]);
    }
  }

  edges = shuffle(edges, randomFunction);

  // Code to add a 4 directional cross road at the center of the field
  if (startX === undefined) {
    startX = Math.floor(width / 2);
  }
  if (startY === undefined) {
    startY = Math.floor(height / 2);
  }

  // create cross road on the start point if it is not on the border
  let cell = 0;
  if (startY < height - 2) {
    grid[startY + 1][startX] |= N; // set the South cel
    cell |= S;
  }
  if (startY > 1) {
    grid[startY - 1][startX] |= S; // set the North cell
    cell |= N;
  }
  if (startX < width - 2) {
    grid[startY][startX + 1] |= W; // set the East cell
    cell |= E;
  }
  if (startX > 1) {
    grid[startY][startX - 1] |= E; // set the West cell
    cell |= W;
  }
  grid[startY][startX] = cell;

  for (let cy = 1; cy < height - 1; cy++) {
    for (let cx = 1; cx < width - 1; cx++) {
      if (getRandomInt(0, 100, randomFunction) < density) {
        continue;
      }

      const nx = cx;
      const ny = cy - 1;
      const wx = cx - 1;
      const wy = cy;
      const ex = cx + 1;
      const ey = cy;
      const sx = cx;
      const sy = cy + 1;

      if (
        grid[cy][cx] !== 0 ||
        sets[ny][nx].connected(sets[sy][sx]) ||
        sets[ey][ex].connected(sets[wy][wx])
      ) {
        continue;
      }

      sets[ny][nx].connect(sets[sy][sx]);
      sets[ey][ex].connect(sets[wy][wx]);

      if (randomFunction() < 0.5) {
        grid[cy][cx] = E | W | U;
      } else {
        grid[cy][cx] = N | S | U;
      }

      grid[ny][nx] |= S;
      grid[wy][wx] |= E;
      grid[ey][ex] |= W;
      grid[sy][sx] |= N;

      const edgesClean = [];
      for (const edge of edges) {
        const [x, y, d] = edge;
        if (
          !(
            (x === cx && y === cy) ||
            (x === ex && y === ey && d === W) ||
            (x === sx && y === sy && d === N)
          )
        ) {
          edgesClean.push(edge);
        }
      }

      edges = edgesClean;
    }
  }

  while (edges.length > 0) {
    const [x, y, direction] = edges.pop()!;
    const nx = x + DX[direction];
    const ny = y + DY[direction];
    const set1 = sets[y][x];
    const set2 = sets[ny][nx];

    if (!set1.connected(set2)) {
      set1.connect(set2);
      grid[y][x] |= direction;
      grid[ny][nx] |= OPPOSITE[direction];
    }
  }

  if (addALoop) {
    let candidates: [number, number][] = [];
    for (let cy = 1; cy < height - 1; cy++) {
      for (let cx = 1; cx < width - 1; cx++) {
        if ([U | N | S, U | E | W].includes(grid[cy][cx]))
          candidates.push([cy, cx]);
      }
    }

    if (candidates.length > 0) {
      candidates = shuffle(candidates, randomFunction);
      const [cy, cx] = candidates[0];
      grid[cy][cx] = N | S | W | E;
    }
  }

  return grid;
}
