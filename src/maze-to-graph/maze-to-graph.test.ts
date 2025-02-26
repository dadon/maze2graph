import { createMaze } from "@/maze/gen";
import { Dijkstra, Vertex } from "@/maze-to-graph/dijkstra-algorithm";
import {
  convertGridToGraph,
  getVertexKey,
} from "@/maze-to-graph/maze-to-graph";

describe("convert maze grid to graph", () => {
  const seed = "123";
  const width = 6;
  const height = 6;
  const density = 50;
  const loops = true;
  const dropX = Math.ceil(width / 2);
  const dropY = Math.ceil(height / 2);

  let grid: number[][];
  let vertices: Record<string, Vertex>;

  beforeEach(() => {
    // Create a maze grid with default settings
    grid = createMaze(
      seed,
      width,
      height,
      density,
      loops,
      dropX - 1,
      dropY - 1
    );

    // Convert grid to graph
    vertices = convertGridToGraph(grid, dropX, dropY);
  });

  test("should create starting vertex 4 connections", () => {
    // Check that vertices object is not empty
    expect(Object.keys(vertices).length).toBeGreaterThan(0);

    // Check that the starting vertex exists
    const startVertexKey = getVertexKey(dropX - 1, dropY - 1, false);
    expect(vertices[startVertexKey]).toBeDefined();

    // Check that the starting vertex has connections
    expect(vertices[startVertexKey].nodes.length).toBe(4);
  });

  test("should create proper bidirectional connections", () => {
    // Get all vertices with connections
    const verticesWithConnections = Object.values(vertices).filter(
      (vertex) => vertex.nodes.length > 0
    );

    // For each vertex with connections, check that every connection is bidirectional
    verticesWithConnections.forEach((vertex) => {
      vertex.nodes.forEach((connection) => {
        const connectedVertex = vertices[connection.nameOfVertex];
        expect(connectedVertex).toBeDefined();

        // Check that there's a connection back to this vertex
        const hasBackConnection = connectedVertex.nodes.some(
          (node) => node.nameOfVertex === vertex.name
        );
        expect(hasBackConnection).toBe(true);
      });
    });
  });

  test("should assign weight value of 1 to edges", () => {
    // Check that all connections have a weight of 1
    Object.values(vertices).forEach((vertex) => {
      vertex.nodes.forEach((connection) => {
        expect(connection.weight).toBe(1);
      });
    });
  });

  test("should create vertices with proper connections", () => {
    const sampleGraph: any = {
      "0,0": ["1,0"],
      "0,1": ["1,1"],
      "0,2": ["0,3", "1,2"],
      "0,3": ["0,4", "0,2"],
      "0,4": ["1,4", "0,3", "0,5"],
      "0,5": ["0,4"],
      "1,0": ["1,1", "0,0"],
      "1,1": ["1,2", "1,0", "0,1"],
      "1,2": ["0,2", "1,1", "2,2"],
      "1,3": ["2,3", "1,4-faint"],
      "1,4": ["2,4", "0,4"],
      "1,4-faint": ["1,3", "1,5"],
      "1,5": ["1,4-faint", "2,5"],
      "2,0": ["3,0"],
      "2,1": ["2,2"],
      "2,2": ["3,2", "2,1", "2,3", "1,2"],
      "2,3": ["2,2", "2,4", "3,3-faint", "1,3"],
      "2,4": ["2,3", "1,4"],
      "2,5": ["1,5"],
      "3,0": ["4,0", "3,1", "2,0"],
      "3,1": ["3,0", "4,1"],
      "3,2": ["3,3", "2,2"],
      "3,3": ["3,2", "3,4"],
      "3,3-faint": ["2,3", "4,3"],
      "3,4": ["4,4", "3,3", "3,5"],
      "3,5": ["3,4"],
      "4,0": ["4,1-faint", "3,0"],
      "4,1": ["3,1", "5,1"],
      "4,1-faint": ["4,2", "4,0"],
      "4,2": ["4,3", "4,1-faint", "5,2"],
      "4,3": ["3,3-faint", "4,2", "4,4"],
      "4,4": ["4,3", "4,5", "5,4", "3,4"],
      "4,5": ["4,4", "5,5"],
      "5,0": ["5,1"],
      "5,1": ["4,1", "5,0"],
      "5,2": ["4,2"],
      "5,3": ["5,4"],
      "5,4": ["4,4", "5,3"],
      "5,5": ["4,5"],
    };

    for (const key in sampleGraph) {
      const vertex = vertices[key];

      const connections: string[] = sampleGraph[key];
      expect(vertex).toBeDefined();
      expect(vertex.nodes.length).toBe(connections.length);
      const nodeNames = vertex.nodes.map((node) => node.nameOfVertex);

      for (const connection of connections) {
        expect(nodeNames).toContain(connection);
      }
    }
  });

  test("should find shortest way with respect to underways", () => {
    const dijkstra = new Dijkstra();
    for (const key in vertices) {
      dijkstra.addVertex(vertices[key]);
    }

    const shortestWay = dijkstra.findShortestWay("4,1", "4,2");
    expect(shortestWay.length).toBe(7);

    expect(shortestWay[0]).toBe("4,1");
    expect(shortestWay[1]).toBe("3,1");
    expect(shortestWay[2]).toBe("3,0");
    expect(shortestWay[3]).toBe("4,0");
    expect(shortestWay[4]).toBe("4,1-faint");
    expect(shortestWay[5]).toBe("4,2");
    expect(shortestWay[6]).toBe("5");

    console.log("shortestWay", shortestWay);
  });
});
