import {Coordinate, CoordinateLineList, CoordinateList, Direction, Matrix} from "./hgTypes";

// export function createUniqueCoordinates(coordinates: CoordinateList, name: string) {
//   while (true) {
//     let o = true;
//     const [newX, newY] = [
//       Math.floor(Math.random() * window.innerWidth),
//       Math.floor(Math.random() * window.innerHeight),
//     ];
//     coordinates.forEach((val) => {
//       if (newX === val.x || newY === val.y) {
//         o = false;
//       }
//     });
//     if (o) return { x: newX, y: newY, color: "white", name: name };
//   }
// }

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
      x = 0.3 * screenWidth;
      difference = objNum * distance;
      yBegin = screenHeight / 2 - difference / 2;
      yEnd = screenHeight / 2 + difference / 2;
      step = difference / (objNum - 1);

      for(let i = 0; i < objNum; i++) {
        coordinates.push({x, y: yBegin + step * i});
      }
      break;
    case "up":
      y = 0.2 * screenHeight;
      difference = objNum * distance;
      xBegin = screenWidth / 2 - difference / 2;
      xEnd = screenWidth / 2 - difference / 2;
      step = difference / (objNum - 1);

      for(let i = 0; i < objNum; i++) {
        coordinates.push({x: xBegin + step * i, y});
      }
      break;
    case "right":
      x = 0.7 * screenWidth;
      difference = objNum * distance;
      yBegin = screenHeight / 2 - difference / 2;
      yEnd = screenHeight / 2 + difference / 2;
      step = difference / (objNum - 1);

      for(let i = 0; i < objNum; i++) {
        coordinates.push({x, y: yBegin + step * i});
      }
      break;
    case "down":
      y = 0.8 * screenHeight;
      difference = objNum * distance;
      xBegin = screenWidth / 2 - difference / 2;
      xEnd = screenWidth / 2 - difference / 2;
      step = difference / (objNum - 1);

      for(let i = 0; i < objNum; i++) {
        coordinates.push({x: xBegin + step * i, y});
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
