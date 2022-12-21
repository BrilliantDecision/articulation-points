import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { TarjanAlgorithm } from "./algorithms/tarjanAlgorithm";
import {
  createCoordinates,
  setLines,
  setRandomEdges,
  setRandomMatrix,
  setRandomVertexes,
  shuffleMatrix,
} from "./hg/hg";
import { CoordinateLineList, CoordinateList, Matrix } from "./hg/hgTypes";
import { useAppDispatch } from "./store/hooks";
import { setBoundListOpen } from "./store/slices/appSlice";

export interface OptionsProps {
  vertexNum: number;
  edgeNum: number;
  vertexes: CoordinateList | null;
  edges: CoordinateList | null;
  matrix: Matrix | null;
  vertexes1: CoordinateList | null;
  edges1: CoordinateList | null;
  matrix1: Matrix | null;
  showLines: boolean;
  setVertexNum: Dispatch<SetStateAction<number>>;
  setEdgeNum: Dispatch<SetStateAction<number>>;
  setHGMatrix: Dispatch<SetStateAction<Matrix | null>>;
  setHGEdges: Dispatch<SetStateAction<CoordinateList | null>>;
  setHGVertexes: Dispatch<SetStateAction<CoordinateList | null>>;
  setHGLines: Dispatch<SetStateAction<CoordinateLineList | null>>;
  setHGMatrix1: Dispatch<SetStateAction<Matrix | null>>;
  setHGEdges1: Dispatch<SetStateAction<CoordinateList | null>>;
  setHGVertexes1: Dispatch<SetStateAction<CoordinateList | null>>;
  setHGLines1: Dispatch<SetStateAction<CoordinateLineList | null>>;
  setShowStars: Dispatch<SetStateAction<boolean>>;
  setShowLines: Dispatch<SetStateAction<boolean>>;
  setShowNames: Dispatch<SetStateAction<boolean>>;
}

const Options: FC<OptionsProps> = ({
                                     vertexNum,
                                     edgeNum,
                                     matrix,
                                     matrix1,
                                     setEdgeNum,
                                     setVertexNum,
                                     setHGMatrix,
                                     setHGEdges,
                                     setHGVertexes,
                                     setHGLines,
                                     setShowStars,
                                     setShowLines,
                                     setShowNames,
                                     vertexes,
                                     edges,
                                     vertexes1,
                                     edges1,
                                     showLines,
                                     setHGMatrix1,
                                     setHGEdges1,
                                     setHGVertexes1,
                                     setHGLines1
}) => {
  const dispatch = useAppDispatch();
  const [isShowing, setIsShowing] = useState(false);

  const handleCreateHypergraph = () => {
    dispatch(setBoundListOpen({ id: "", open: false }));

    const matrix = setRandomMatrix(vertexNum, edgeNum);
    const vertexes = setRandomVertexes(vertexNum, 'left');
    const edges = setRandomEdges(edgeNum, 'left');
    const lines = setLines(vertexNum, edgeNum, matrix, edges, vertexes);
    const matrix1 = shuffleMatrix(matrix);
    const vertexes1 = setRandomVertexes(vertexNum, 'right');
    const edges1 = setRandomEdges(edgeNum, 'right');
    const lines1 = setLines(vertexNum, edgeNum, matrix1, edges1, vertexes1);

    setHGMatrix(() => matrix);
    setHGVertexes(() => vertexes);
    setHGEdges(() => edges);
    setHGLines(() => lines.map(val => ({...val, opacity: showLines ? 0.5 : 0})));
    setHGMatrix1(() => matrix1);
    setHGVertexes1(() => vertexes1);
    setHGEdges1(() => edges1);
    setHGLines1(() => lines1.map(val => ({...val, opacity: showLines ? 0.5 : 0})));
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
        if (ap.includes(Number(newState[i].id.substring(1)))) {
          newState[i].color = "orange";
        }
      }

      return newState;
    });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    if (event.key === "o") setIsShowing((prevState) => !prevState);
  };

  useEffect(() => {
    document.removeEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [matrix, edges, vertexes, matrix1, edges1, vertexes1 ,showLines]);

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
        <button
            onClick={() => setShowStars((prevState) => !prevState)}
            className="px-5 py-2 rounded-md bg-white text-black bg-opacity-70 cursor-pointer hover:bg-opacity-100 transition-all focus:ring-0 outline-none"
        >
          Звёзды
        </button>
      </div>
    </div>
  );
};

export default Options;
