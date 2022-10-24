import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { TarjanAlgorithm } from "./algorithms/tarjanAlgorithm";
import {
  setLines,
  setRandomEdges,
  setRandomMatrix,
  setRandomVertexes,
} from "./hg/hg";
import { CoordinateLineList, CoordinateList, Matrix } from "./hg/hgTypes";

export interface OptionsProps {
  vertexNum: number;
  edgeNum: number;
  matrix: Matrix | null;
  setVertexNum: Dispatch<SetStateAction<number>>;
  setEdgeNum: Dispatch<SetStateAction<number>>;
  setHGMatrix: Dispatch<SetStateAction<Matrix | null>>;
  setHGEdges: Dispatch<SetStateAction<CoordinateList | null>>;
  setHGVertexes: Dispatch<SetStateAction<CoordinateList | null>>;
  setHGLines: Dispatch<SetStateAction<CoordinateLineList | null>>;
}

const Options: FC<OptionsProps> = ({
  vertexNum,
  edgeNum,
  matrix,
  setEdgeNum,
  setVertexNum,
  setHGMatrix,
  setHGEdges,
  setHGVertexes,
  setHGLines,
}) => {
  const [isShowing, setIsShowing] = useState(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    if (event.key === "o") setIsShowing((prevState) => !prevState);
  };

  const handleCreateHypergraph = () => {
    const matrix = setRandomMatrix(vertexNum, edgeNum);
    const vertexes = setRandomVertexes(vertexNum);
    const edges = setRandomEdges(edgeNum, vertexNum, vertexes);
    const lines = setLines(vertexNum, edgeNum, matrix, edges, vertexes);

    setHGMatrix(() => matrix);
    setHGVertexes(() => vertexes);
    setHGEdges(() => edges);
    setHGLines(() => lines);
  };

  const handleSearchPoints = () => {
    if (!matrix) return;

    const hypergraph = new TarjanAlgorithm(matrix, vertexNum);
    const ap = hypergraph.AP();
    alert(ap.length);

    setHGVertexes((prevState) => {
      if(!prevState) return prevState;

      const newState = [...prevState];
      
      for (let i = 0; i < newState.length; i++) {
        if (ap.includes(Number(newState[i].id))) {
          newState[i].color = "orange";
        }
      }

      return newState;
    });
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div
      className={`bg-purple-100 p-5 bg-opacity-10 fixed flex flex-col w-[200px] h-full ${
        isShowing ? "left-0" : "-left-[200px]"
      } top-0 z-[9999] transition-all`}
    >
      <p className="text-2xl font-medium text-white">Настройки</p>
      <div className="flex flex-col mt-5 gap-2">
        <input
          onChange={(e) => setVertexNum(() => Number(e.target.value))}
          type="number"
          placeholder="Число вершин"
          className=" placeholder-white text-white focus:placeholder-black focus:text-black w-full focus:ring-0 focus:bg-opacity-50 outline-none bg-white bg-opacity-10 px-3 py-2 rounded-md transition-all"
        />
        <input
          onChange={(e) => setEdgeNum(() => Number(e.target.value))}
          type="number"
          placeholder="Число ребер"
          className="placeholder-white text-white focus:placeholder-black focus:text-black w-full focus:ring-0 focus:bg-opacity-50 outline-none bg-white bg-opacity-10 px-3 py-2 rounded-md transition-all"
        />
        <button
          onClick={() => handleCreateHypergraph()}
          className="px-5 py-2 rounded-md bg-white text-black bg-opacity-70 cursor-pointer hover:bg-opacity-100 transition-all focus:ring-0 outline-none"
        >
          Задать граф
        </button>
        <button
          onClick={() => handleSearchPoints()}
          className="px-5 py-2 rounded-md bg-white text-black bg-opacity-70 cursor-pointer hover:bg-opacity-100 transition-all focus:ring-0 outline-none"
        >
          Найти точки
        </button>
      </div>
    </div>
  );
};

export default Options;
