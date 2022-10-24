export type CoordinateList = Coordinate[];
export type CoordinateLineList = CoordinateLine[];
export type Matrix = Array<Array<boolean>>;

export interface Coordinate {
  id: string;
  x: number;
  y: number;
  color: string;
  name: string;
}

export interface CoordinateLine {
  id: string;
  start: Coordinate;
  finish: Coordinate;
  opacity: number;
  name: string;
}
