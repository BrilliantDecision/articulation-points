// A Javascript program to find articulation points in an undirected graph

// This class represents an undirected graph using adjacency list
// representation
import { Matrix } from "./../hg/hgTypes";

export class TarjanAlgorithm {
  private readonly vertexNum: number;
  private readonly adjacencyList: Array<Array<number>>;
  private readonly NIL: number;
  private time: number;

  constructor(matrix: Matrix, vertexNum: number) {
    this.vertexNum = vertexNum;
    this.adjacencyList = new Array(this.vertexNum);
    this.NIL = -1;
    this.time = 0;
    this.setAdjList(matrix);
  }

  private setAdjList(matrix: Matrix) {
    for (let i = 0; i < this.vertexNum; ++i) this.adjacencyList[i] = [];

    for (let i = 0; i < matrix.length; i++) {
      const visitedVertexTrueList: number[] = [];

      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j]) {
          for (let k = 0; k < visitedVertexTrueList.length; k++) {
            this.adjacencyList[visitedVertexTrueList[k]].push(j);
            this.adjacencyList[j].push(visitedVertexTrueList[k]);
          }
          visitedVertexTrueList.push(j);
        }
      }
    }
  }

  // A recursive function that find articulation points using DFS
  // u --> The vertex to be visited next
  // visited[] --> keeps track of visited vertices
  // disc[] --> Stores discovery times of visited vertices
  // parent[] --> Stores parent vertices in DFS tree
  // ap[] --> Store articulation points
  private APUtil(
    u: number,
    visited: boolean[],
    disc: number[],
    low: number[],
    parent: number[],
    ap: boolean[]
  ) {
    // Count of children in DFS Tree
    let children = 0;
    // Mark the current node as visited
    visited[u] = true;
    // Initialize discovery time and low value
    disc[u] = low[u] = ++this.time;
    // Go through all vertices adjacent to this
    for (let i of this.adjacencyList[u]) {
      let v = i; // v is current adjacent of u
      // If v is not visited yet, then make it a child of u
      // in DFS tree and recur for it
      if (!visited[v]) {
        children++;
        parent[v] = u;
        this.APUtil(v, visited, disc, low, parent, ap);
        // Check if the subtree rooted with v has a connection to
        // one of the ancestors of u
        low[u] = Math.min(low[u], low[v]);
        // u is an articulation point in following cases
        // (1) u is root of DFS tree and has two or more children.
        if (parent[u] === this.NIL && children > 1) ap[u] = true;
        // (2) If u is not root and low value of one of its child
        // is more than discovery value of u.
        if (parent[u] !== this.NIL && low[v] >= disc[u]) ap[u] = true;
      }
      // Update low value of u for parent function calls.
      else if (v !== parent[u]) low[u] = Math.min(low[u], disc[v]);
    }
  }

  // The function to do DFS traversal. It uses recursive function APUtil()
  AP() {
    // Mark all the vertices as not visited
    let visited = new Array(this.vertexNum);
    let disc = new Array(this.vertexNum);
    let low = new Array(this.vertexNum);
    let parent = new Array(this.vertexNum);
    let ap = new Array(this.vertexNum); // To store articulation points
    // Initialize parent and visited, and ap(articulation point)
    // arrays
    for (let i = 0; i < this.vertexNum; i++) {
      parent[i] = this.NIL;
      visited[i] = false;
      ap[i] = false;
    }
    // Call the recursive helper function to find articulation
    // points in DFS tree rooted with vertex 'i'
    for (let i = 0; i < this.vertexNum; i++)
      if (visited[i] === false) this.APUtil(i, visited, disc, low, parent, ap);

    const trueAp: number[] = [];
    // Now ap[] contains articulation points, print them
    for (let i = 0; i < this.vertexNum; i++) if (ap[i] === true) trueAp.push(i);

    return trueAp;
  }
}
// This code is contributed by avanitrachhadiya2155 and fixed by BrilliantDecision
