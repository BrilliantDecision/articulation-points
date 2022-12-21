// A Javascript program to find articulation points in an undirected graph

// This class represents an undirected graph using adjacency list
// representation
import { Matrix } from "../hg/hgTypes";

export class IsomorphismAlgorithm {
    private readonly vertexNum: number;
    private readonly adjacencyList: Array<Array<number>>;
    private readonly adjacencyList1: Array<Array<number>>;

    constructor(matrix: Matrix, matrix1: Matrix, vertexNum: number) {
        this.vertexNum = vertexNum;
        this.adjacencyList = new Array(this.vertexNum);
        this.adjacencyList1 = new Array(this.vertexNum);
        this.setAdjList(matrix, this.adjacencyList);
        this.setAdjList(matrix1, this.adjacencyList1);
    }

    private setAdjList(matrix: Matrix, adjList: Array<Array<number>>) {
        for (let i = 0; i < this.vertexNum; ++i) this.adjacencyList[i] = [];

        for (let i = 0; i < matrix.length; i++) {
            const visitedVertexTrueList: number[] = [];

            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j]) {
                    for (let k = 0; k < visitedVertexTrueList.length; k++) {
                        adjList[visitedVertexTrueList[k]].push(j);
                        adjList[j].push(visitedVertexTrueList[k]);
                    }
                    visitedVertexTrueList.push(j);
                }
            }
        }
    }

    private isomorphism() {

    }

    public bblSortY(matrix: Matrix) {
        for (let i = 0; i < matrix[0].length; i++) {
            for (let j = 0; j < (matrix[0].length - i - 1); j++) {

                for (let k = 0; k < matrix.length; k++) {
                    if(matrix[k][j] == matrix[k][j + 1]) {
                        continue;
                    } else {

                    }
                }
            }
        }
    }

}
