import { Coordinate, CoordinateLineList, CoordinateList, Matrix } from "./hgTypes";

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
  let vIndex = 0;
  const vertexesPerEdge = Math.floor(vertexNum / edgesNum);
  const vertexGap = Math.floor(vertexNum / vertexesPerEdge);

  for (let i = 0; i < edgesNum; i++) {
    const arr: boolean[] = new Array(vertexNum).fill(false);

    for (let j = vIndex + 1; j < vIndex + vertexesPerEdge && j < vertexNum; j++) {
      arr[j] = true;
    }
    arr[Math.floor((Math.random() * vertexGap) + 1) * vertexesPerEdge - 1] = true;
    vIndex += vertexesPerEdge;
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

const randomColor = () => {
  const arrColors = ["ffffff", "ffecd3", "bfcfff"];
  return "#" + arrColors[Math.floor((Math.random() * 3))];
}

export type StarList = Star[];

export interface Star extends Coordinate {
  radius: number;
}

export const generateStars = (starsNum: number, minRadiusStar: number, maxRadiusStar: number) => {
  const stars: StarList = [];

  for (let i = 0; i < starsNum; i++) {
    const [newX, newY] = [
      Math.floor(Math.random() * window.innerWidth),
      Math.floor(Math.random() * window.innerHeight),
    ];

    stars.push({
      id: 's' + i.toString(),
      x: newX,
      y: newY,
      color: randomColor(),
      name: 's' + i.toString(),
      radius: Math.floor((Math.random() * maxRadiusStar) + minRadiusStar)
    })
  }

  return stars;
}

export const setRandomRadius = (currentRadius: number, minRadiusStar: number, maxRadiusStar: number) => {
  if (Math.round(currentRadius) === minRadiusStar) return currentRadius + 0.15;
  else if (Math.round(currentRadius) === maxRadiusStar) return currentRadius - 0.15;
  else {
    const isAdd = Math.round(Math.random());

    if (isAdd) return currentRadius + 0.15;
    else return currentRadius - 0.15;
  }
}
