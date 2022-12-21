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
        this.setAdjList(matrix);
        this.setAdjList1(matrix1);
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

    private setAdjList1(matrix: Matrix) {
        for (let i = 0; i < this.vertexNum; ++i) this.adjacencyList1[i] = [];

        for (let i = 0; i < matrix.length; i++) {
            const visitedVertexTrueList: number[] = [];

            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j]) {
                    for (let k = 0; k < visitedVertexTrueList.length; k++) {
                        this.adjacencyList1[visitedVertexTrueList[k]].push(j);
                        this.adjacencyList1[j].push(visitedVertexTrueList[k]);
                    }
                    visitedVertexTrueList.push(j);
                }
            }
        }
    }

    public isomorphism(matrix: Matrix, matrix1: Matrix) {
        const tMatrix = [...matrix];
        const tMatrix1 = [...matrix1];
        this.bblSortY(tMatrix);
        this.bblSortY(tMatrix1);
        this.bblSortX(tMatrix);
        this.bblSortX(tMatrix1);
        return this.isEqualGraphs(tMatrix, tMatrix1);
    }

    public bblSortY(matrix: Matrix) {
        for (let i = 0; i < matrix[0].length; i++) {
            for (let j = 0; j < (matrix[0].length - i - 1); j++) {
                for (let k = 0; k < matrix.length; k++) {
                    if(matrix[k][j] === matrix[k][j + 1]) {
                        continue;
                    } else if (matrix[k][j] < matrix[k][j + 1]) {
                        const temp = matrix.map(val => val[j]);
                        for(let n = 0; n < matrix.length; n++) {
                            matrix[n][j] = matrix[n][j + 1];
                        }
                        for(let n = 0; n < matrix.length; n++) {
                            matrix[n][j + 1] = temp[n];
                        }
                    }
                }
            }
        }
    }

    public bblSortX(matrix: Matrix) {
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < (matrix.length - i - 1); j++) {
                for (let k = 0; k < matrix[0].length; k++) {
                    if(matrix[j][k] === matrix[j + 1][k]) {
                        continue
                    } else if(matrix[j][k] < matrix[j + 1][k]) {
                        const temp = matrix[j];
                        matrix[j] = [...matrix[j + 1]];
                        matrix[j + 1] = temp;
                    }
                }
            }
        }
    }

    public isEqualGraphs(matrix: Matrix, matrix1: Matrix) {
        for(let i = 0; i < matrix.length; i++) {
            for(let j = 0; j < matrix.length; j++) {
                if (matrix[i][j] !== matrix1[i][j]) {
                    return false;
                }
            }
        }
        return true;
    }
}
