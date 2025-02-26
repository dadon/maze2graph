import { create } from "zustand";
import { createMaze } from "@/maze/gen";
import { SVG } from "@/maze/render-svg";
import { calculateRenderSize, createMazeSvg } from "@/maze/render-utils";
import { convertGridToGraph } from "@/maze-to-graph/maze-to-graph";
import { Dijkstra } from "@/maze-to-graph/dijkstra-algorithm";

interface MazeConfig {
  seed: string;

  width: number;
  height: number;

  density: number;
  loops: boolean;

  startX: number;
  startY: number;

  maxWidth: number;
  maxHeight: number;

  minWidth: number;
  minHeight: number;

  curved: boolean;
}

interface MazeData {
  grid: number[][];
  dijkstra: Dijkstra;
  cellSize: number;
  svg: SVG;
  mazeElement: HTMLDivElement;
  config: MazeConfig;
}

interface MazeState {
  // Maze data
  data: MazeData | null;

  // Interaction state
  hoveredCell: [number, number] | null;
  startPoint: [number, number] | null;
  endPoint: [number, number] | null;
  path: string[];

  // Actions
  initializeMaze: (config: MazeConfig, parentElement: HTMLDivElement) => void;
  resetMaze: () => void;

  setHoveredCell: (cell: [number, number] | null) => void;

  findShortestPath: (
    start: [number, number],
    end: [number, number]
  ) => string[];
  resetPath: () => void;
  handleCellClick: () => void;
}

export const useMazeStore = create<MazeState>((set, get) => ({
  data: null,
  hoveredCell: null,
  startPoint: null,
  endPoint: null,
  path: [],

  // Actions
  initializeMaze: (config: MazeConfig, parentElement: HTMLDivElement) => {
    console.log("initializeMaze", config, parentElement);
    // Create the maze
    const grid = createMaze(
      config.seed,
      config.width,
      config.height,
      config.density,
      config.loops,
      config.startX - 1,
      config.startY - 1
    );

    // Convert to graph - use the refactored function that returns vertices directly
    const vertices = convertGridToGraph(
      grid,
      config.startX - 1,
      config.startY - 1
    );
    const dijkstra = new Dijkstra();
    for (const key in vertices) {
      dijkstra.addVertex(vertices[key]);
    }

    const renderSize = calculateRenderSize(
      config.maxWidth,
      config.maxHeight,
      config.minWidth,
      config.minHeight
    );

    const svg = createMazeSvg(
      config.width,
      config.height,
      grid,
      parentElement,
      renderSize,
      config.curved
    );

    const cellSize = renderSize.width / config.width;

    const data: MazeData = {
      grid,
      dijkstra,
      config,
      cellSize,
      svg,
      mazeElement: parentElement,
    };

    set({ data });
  },

  resetMaze: () =>
    set({
      data: null,
      hoveredCell: null,
      startPoint: null,
      endPoint: null,
      path: [],
    }),

  setHoveredCell: (cell) => set({ hoveredCell: cell }),

  resetPath: () => set({ path: [], endPoint: null }),

  findShortestPath: (start, end) => {
    const { data } = get();
    if (!data) return [];

    const startKey = `${start[0]},${start[1]}`;
    const endKey = `${end[0]},${end[1]}`;

    // Find shortest path
    const shortestWay = data.dijkstra.findShortestWay(startKey, endKey);
    set({ path: shortestWay });

    return shortestWay;
  },

  handleCellClick: () => {
    const { hoveredCell, startPoint, endPoint, findShortestPath, resetPath } =
      get();

    if (!hoveredCell) return;

    if (!startPoint) {
      set({ startPoint: hoveredCell });
    } else if (!endPoint) {
      set({ endPoint: hoveredCell });
      // Find path once both points are selected
      findShortestPath(startPoint, hoveredCell);
    } else {
      // Reset and start over
      set({ startPoint: hoveredCell });
      resetPath();
    }
  },
}));
