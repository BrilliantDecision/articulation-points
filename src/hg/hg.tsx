import {Coordinate, CoordinateLineList, CoordinateList, Direction, Matrix} from "./hgTypes";

function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
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

export function createCoordinates(objNum: number, direction: Direction, distance: number) {
  const coordinates: {x: number, y: number}[] = [];
  const screenWidth = window.innerWidth;
  const screenHeight = window.innerHeight;
  let x: number | null = null;
  let y: number | null = null;
  let xBegin: number | null = null;
  let yBegin: number | null = null; // from down to up
  let xEnd: number | null = null;
  let yEnd: number | null = null;
  let difference: number | null = null;
  let step: number | null = null;

  switch (direction) {
    case "left":
      xBegin = 50;
      xEnd = screenWidth / 2 - 50;
      yBegin = 50;
      yEnd = screenHeight - 50;

      for(let i = 0; i < objNum; i++) {
        coordinates.push({x: getRandomInt(xBegin, xEnd), y: getRandomInt(yBegin, yEnd)});
      }
      break;
    case "right":
      xBegin = screenWidth / 2 + 50;
      xEnd = screenWidth - 50;
      yBegin = 50;
      yEnd = screenHeight - 50;

      for(let i = 0; i < objNum; i++) {
        coordinates.push({x: getRandomInt(xBegin, xEnd), y: getRandomInt(yBegin, yEnd)});
      }
      break;
  }

  return coordinates;
}

export function setRandomVertexes(vertexNum: number, direction: Direction) {
  const coordinatesVertexes: CoordinateList = [];
  const coordinates = createCoordinates(vertexNum, direction, 30);

  for (let i = 0; i < vertexNum; i++) {
    coordinatesVertexes.push({
      id: 'v' + i.toString(),
      x: coordinates[i].x,
      y: coordinates[i].y,
      color: "white",
      name: 'v' + i.toString(),
  });
  }

  return coordinatesVertexes;
}

export function setRandomEdges(edgeNum: number, direction: Direction) {
  const coordinatesEdges: CoordinateList = [];
  const coordinates = createCoordinates(edgeNum, direction, 40);

  for (let i = 0; i < edgeNum; i++) {
    coordinatesEdges.push({
      id: 'e' + i.toString(),
      x: coordinates[i].x,
      y: coordinates[i].y,
      color: "white",
      name: 'e' + i.toString(),
    });
  }

  return coordinatesEdges;
}

export function shuffleMatrix(matrix: Matrix) {
  const newMatrix = [...matrix];

  for(let i = 0; i < 5; i++) {
    const rand = getRandomInt(0, matrix.length - 1);
    const rand1 = getRandomInt(0, matrix.length - 1);
    const temp = newMatrix[rand];
    newMatrix[rand] = [...newMatrix[rand1]];
    newMatrix[rand1] = [...temp];
  }

  for(let i = 0; i < 5; i++) {
    const rand = getRandomInt(0, matrix[0].length - 1);
    const rand1 = getRandomInt(0, matrix[0].length - 1);

    for(let j = 0; j < matrix.length; j++) {
      const temp = newMatrix[j][rand];
      newMatrix[j][rand] = newMatrix[j][rand1];
      newMatrix[j][rand1] = temp;
    }
  }

  return newMatrix;
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
