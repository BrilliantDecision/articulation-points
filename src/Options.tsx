import { Dispatch, FC, SetStateAction, useEffect, useState } from "react";
import { TarjanAlgorithm } from "./algorithms/tarjanAlgorithm";
import {
  createCoordinates,
  setLines,
  setRandomEdges,
  setRandomMatrix,
  setRandomVertexes,
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
  showLines: boolean;
  setVertexNum: Dispatch<SetStateAction<number>>;
  setEdgeNum: Dispatch<SetStateAction<number>>;
  setHGMatrix: Dispatch<SetStateAction<Matrix | null>>;
  setHGEdges: Dispatch<SetStateAction<CoordinateList | null>>;
  setHGVertexes: Dispatch<SetStateAction<CoordinateList | null>>;
  setHGLines: Dispatch<SetStateAction<CoordinateLineList | null>>;
  setShowStars: Dispatch<SetStateAction<boolean>>;
  setShowLines: Dispatch<SetStateAction<boolean>>;
  setShowNames: Dispatch<SetStateAction<boolean>>;
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
  setHGLines,setShowStars,setShowLines,setShowNames, vertexes, edges,showLines
}) => {
  const dispatch = useAppDispatch();
  const [isShowing, setIsShowing] = useState(false);

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.isComposing || event.keyCode === 229) {
      return;
    }
    if (event.key === "o") setIsShowing((prevState) => !prevState);
    else if(event.key === 'ArrowUp' || event.key === 'ArrowLeft') onClickView('v');
    else if(event.key === 'ArrowDown' || event.key === 'ArrowRight') onClickView('h');
  };

  const handleCreateHypergraph = () => {
    dispatch(setBoundListOpen({ id: "", open: false }));

    const matrix = setRandomMatrix(vertexNum, edgeNum);
    const vertexes = setRandomVertexes(vertexNum, 'right');
    const edges = setRandomEdges(edgeNum, 'left');
    const lines = setLines(vertexNum, edgeNum, matrix, edges, vertexes);

    setHGMatrix(() => matrix);
    setHGVertexes(() => vertexes);
    setHGEdges(() => edges);
    setHGLines(() => lines.map(val => ({...val, opacity: showLines ? 0.5 : 0})));
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

  const onClickView = (direction: 'h' | 'v') => {
    if(!matrix) return;

    const vertexesCoordinates = createCoordinates(vertexNum, direction === 'h' ? 'right' : 'down', 30);
    const edgesCoordinates = createCoordinates(edgeNum, direction === 'h' ? 'left' : 'up',40);
    let newVertexes: CoordinateList | [] = [];
    let newEdges: CoordinateList | [] = [];

    if(vertexes) {
      newVertexes = [...vertexes];
      for (let i = 0; i < newVertexes.length; i++) {
        newVertexes[i].x = vertexesCoordinates[i].x;
        newVertexes[i].y = vertexesCoordinates[i].y;
      }
      setHGVertexes(() => newVertexes);
    }

    if(edges) {
      newEdges = [...edges];
      for (let i = 0; i < newEdges.length; i++) {
        newEdges[i].x = edgesCoordinates[i].x;
        newEdges[i].y = edgesCoordinates[i].y;
      }
      setHGEdges(() => newEdges);
    }

    const lines = setLines(vertexNum, edgeNum, matrix, newEdges, newVertexes);
    setHGLines(() => lines.map(val => ({...val, opacity: showLines ? 0.5 : 0})));
  }

  useEffect(() => {
    document.removeEventListener("keydown", handleKeyDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [matrix, edges, vertexes, showLines]);

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
        <button
            onClick={() => setShowLines((prevState) => !prevState)}
            className="px-5 py-2 rounded-md bg-white text-black bg-opacity-70 cursor-pointer hover:bg-opacity-100 transition-all focus:ring-0 outline-none"
        >
          Линии
        </button>
        <button
            onClick={() => setShowNames((prevState) => !prevState)}
            className="px-5 py-2 rounded-md bg-white text-black bg-opacity-70 cursor-pointer hover:bg-opacity-100 transition-all focus:ring-0 outline-none"
        >
          Имена
        </button>
        {/*<div className={'flex flex-row justify-center gap-5'}>*/}
        {/*  <img*/}
        {/*      onClick={() => onClickView('h')}*/}
        {/*      src={"arrow-right-line.svg"}*/}
        {/*      alt="trash"*/}
        {/*      className="p-1 w-10 h-10 rounded-full border-white border cursor-pointer hover:bg-opacity-50 bg-white bg-opacity-0 transition-all"*/}
        {/*  />*/}
        {/*  <img*/}
        {/*      onClick={() => onClickView('v')}*/}
        {/*      src={"arrow-down-line.svg"}*/}
        {/*      alt="trash"*/}
        {/*      className="p-1 w-10 h-10 rounded-full border-white border cursor-pointer hover:bg-opacity-50 bg-white bg-opacity-0 transition-all"*/}
        {/*  />*/}
        {/*</div>*/}
      </div>
    </div>
  );
};

export default Options;
