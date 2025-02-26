interface NodeVertex {
  nameOfVertex: string;
  weight: number;
}

export class Vertex {
  name: string;
  nodes: NodeVertex[];
  weight: number;

  constructor(theName: string, theNodes: NodeVertex[], theWeight: number) {
    this.name = theName;
    this.nodes = theNodes;
    this.weight = theWeight;
  }
}

export class Dijkstra {
  vertices: Record<string, Vertex>;

  constructor() {
    this.vertices = {};
  }

  addVertex(vertex: Vertex): void {
    this.vertices[vertex.name] = vertex;
  }

  findPointsOfShortestWay(start: string, finish: string): string[] {
    let nextVertex: string = finish;
    let arrayWithVertex: string[] = [];
    while (nextVertex !== start) {
      let minWeigth: number = Number.MAX_VALUE;
      let minVertex: string = "";
      for (let i of this.vertices[nextVertex].nodes) {
        if (i.weight + this.vertices[i.nameOfVertex].weight < minWeigth) {
          minWeigth = this.vertices[i.nameOfVertex].weight;
          minVertex = i.nameOfVertex;
        }
      }
      arrayWithVertex.push(minVertex);
      nextVertex = minVertex;
    }
    return arrayWithVertex;
  }

  findShortestWay(start: string, finish: string): string[] {
    let nodes: any = {};

    for (let i in this.vertices) {
      if (this.vertices[i].name === start) {
        this.vertices[i].weight = 0;
      } else {
        this.vertices[i].weight = Number.MAX_VALUE;
      }
      nodes[this.vertices[i].name] = this.vertices[i].weight;
    }

    while (Object.keys(nodes).length !== 0) {
      let sortedVisitedByWeight: string[] = Object.keys(nodes).sort(
        (a, b) => this.vertices[a].weight - this.vertices[b].weight
      );
      let currentVertex: Vertex = this.vertices[sortedVisitedByWeight[0]];
      for (let j of currentVertex.nodes) {
        const calculateWeight: number = currentVertex.weight + j.weight;
        if (calculateWeight < this.vertices[j.nameOfVertex].weight) {
          this.vertices[j.nameOfVertex].weight = calculateWeight;
        }
      }
      delete nodes[sortedVisitedByWeight[0]];
    }
    const finishWeight: number = this.vertices[finish].weight;
    let arrayWithVertex: string[] = this.findPointsOfShortestWay(
      start,
      finish
    ).reverse();
    arrayWithVertex.push(finish, finishWeight.toString());
    return arrayWithVertex;
  }
}
