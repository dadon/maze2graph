import { Vertex } from "./dijkstra-algorithm";

/**
 * Creates a simplified dump of the graph
 * @param vertices The graph vertices
 * @returns An object mapping each vertex key to an array of connected vertex keys
 */
export const dumpGraph = (
  vertices: Record<string, Vertex>
): Record<string, string[]> => {
  const result: Record<string, string[]> = {};

  // Process each vertex in the graph
  Object.keys(vertices).forEach((vertexKey) => {
    // Get the list of connected vertex keys
    const connectedKeys = vertices[vertexKey].nodes.map(
      (node) => node.nameOfVertex
    );
    // Store in the result
    result[vertexKey] = Array.from(new Set(connectedKeys));
  });

  return result;
};

/**
 * Prints a graph dump to the console in a readable format
 * @param graphDump The graph dump produced by dumpGraph
 */
export const printGraphDump = (graphDump: Record<string, string[]>): void => {
  console.log("Graph Connections:");
  console.log("=================");

  Object.keys(graphDump)
    .sort()
    .forEach((key) => {
      const connections = graphDump[key].sort().join(", ");
      console.log(`${key} => [${connections}]`);
    });

  console.log("=================");
  console.log(`Total vertices: ${Object.keys(graphDump).length}`);
};
