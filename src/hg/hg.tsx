import { CoordinateLineList, CoordinateList, Matrix } from "./hgTypes";

// const coord = [1, -1, 2, -2, 3, -3];

// const getCoord

export function createUniqueCoordinates(coordinates: CoordinateList, name: string) {
  while (true) {
    let o = true;
    const [newX, newY] = [
      Math.floor(Math.random() * window.innerWidth),
      Math.floor(Math.random() * window.innerHeight),
    ];
    coordinates.forEach((val) => {
      if (newX === val.x || newY === val.y) {
        o = false;
      }
    });
    if (o) return { x: newX, y: newY, color: "white", name: name };
  }
}

export function setRandomMatrix(vertexNum: number, edgesNum: number) {
  const matrix: Matrix = [];

  for (let i = 0; i < edgesNum; i++) {
    const arr = [];
    for (let j = 0; j < vertexNum; j++) {
      arr.push(Boolean(Math.round(Math.random())));
    }
    matrix.push(arr);
  }

  return matrix;
}

export function setRandomVertexes(vertexNum: number) {
  const coordinatesVertexes: CoordinateList = [];

  for (let i = 0; i < vertexNum; i++) {
    coordinatesVertexes.push({
      id: 'v' + i.toString(),
      ...createUniqueCoordinates(coordinatesVertexes, 'v' + i.toString()),
    });
  }

  return coordinatesVertexes;
}

export function setRandomEdges(
  edgeNum: number,
  vertexNum: number,
  coordinatesVertexes: CoordinateList
) {
  const coordinatesEdges: CoordinateList = [];

  for (let i = 0; i < edgeNum; i++) {
    coordinatesEdges.push({
      id: 'e' + i.toString(),
      ...createUniqueCoordinates(coordinatesEdges.concat(coordinatesVertexes), 'e' + i.toString()),
    });
  }

  return coordinatesEdges;
}

export function setLines(
  vertexNum: number,
  edgeNum: number,
  matrix: Matrix,
  coordinatesEdges: CoordinateList,
  coordinatesVertexes: CoordinateList
) {
  const coordinatesLines: CoordinateLineList = [];

  for (let i = 0; i < edgeNum; i++) {
    for (let j = 0; j < vertexNum; j++) {
      if (matrix[i][j])
        coordinatesLines.push({
          id: 'l' + (i * vertexNum + j).toString(),
          opacity: 0,
          start: coordinatesEdges[i],
          finish: coordinatesVertexes[j],
          name: 'l' + (i * vertexNum + j).toString()
        });
    }
  }

  return coordinatesLines;
}
