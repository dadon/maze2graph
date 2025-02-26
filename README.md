# Maze2Graph - Converting Weave Mazes to Graph Data Structures

## Project Overview

Maze2Graph is a project demonstrating how to convert a specialized weave maze representation to a graph data structure suitable for pathfinding algorithms.

## What are Weave Mazes?

Weave mazes are a special type of maze where passages can pass both over and under other passages, creating a 3D-like structure in a 2D representation. This adds complexity to both the maze generation and pathfinding processes.

## The Challenge

This project presents a specific technical challenge:

1. The maze generator produces a 2D grid (matrix) where each cell contains encoded information
2. Each cell value encodes possible movement directions (North, South, East, West)
3. The "Under" (U) direction is used to indicate passages that go underneath other passages
4. This complex representation needs to be converted into a standard graph structure for Dijkstra's algorithm

## Key Concepts

### Grid Representation

The maze generator returns a 2D matrix (`grid`) where each cell value is a number encoding:

- North (N = 1)
- South (S = 2)
- East (E = 4)
- West (W = 8)
- Under (U = 16)

For example, a cell with value 5 (1 + 4) means you can move North and East from that position.

### Faint Passages

Some passages in the maze are "faint" which are special connections in the weave maze. These are encoded in certain grid values:

- Value 19 for horizontal faint passages
- Value 28 for vertical faint passages

### Graph Structure

The graph structure consists of:

- Vertices (representing maze cells)
- Edges (representing connections between cells)
- Each vertex has a unique key based on its coordinates
- Faint passages have a special marking in their vertex key

## The Task

Implement the `convertGridToGraph` method in `src/maze-to-graph/maze-to-graph.ts`:

```typescript
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
  // Implementation goes here
};
```

This method takes:

- `grid`: The 2D matrix representation of the maze
- `initialX` and `initialY`: The starting point for exploring the maze

It should return a Record (map) of vertex names to Vertex objects suitable for use with the Dijkstra algorithm implementation.

## Testing Your Implementation

You can test your implementation in two ways:

1. **Run the tests**: `npm run test`

   - This will run the automated tests to verify your implementation

2. **Use the UI**: `npm run dev`
   - This starts the React application
   - View the maze visualization
   - Use the interactive overlay to:
     - Click on a cell to set start point (A)
     - Click on another cell to set end point (B)
     - See the shortest path between them rendered on the maze

## Project Structure

- `src/maze/` - Contains the maze generation logic
- `src/maze-to-graph/` - Contains the conversion logic and Dijkstra implementation
- `src/components/` - React components for visualization
- `src/store/` - State management for the application
