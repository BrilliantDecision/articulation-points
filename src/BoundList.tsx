import { Dispatch, FC, MouseEvent, SetStateAction, useRef } from "react";
import {Coordinate, CoordinateLineList, CoordinateList, Matrix} from "./hg/hgTypes";
import { useAppSelector } from "./store/hooks";

export interface BoundListProps {
  edges: CoordinateList | null;
  vertexes: CoordinateList | null;
  matrix: Matrix | null;
  setHGMatrix: Dispatch<SetStateAction<Matrix | null>>;
  setHGLines: Dispatch<SetStateAction<CoordinateLineList | null>>;
  setHGEdges: Dispatch<SetStateAction<CoordinateList | null>>;
  setHGVertexes: Dispatch<SetStateAction<CoordinateList | null>>;
  showLines: boolean;
}

const BoundList: FC<BoundListProps> = ({
  edges,
  vertexes,
  matrix,
  setHGMatrix,
  setHGLines,
  setHGEdges,
  setHGVertexes,showLines
}) => {
  const { boundListOpen } = useAppSelector((state) => state.app);
  const divRef = useRef<HTMLDivElement | null>(null);

  const handleDelObject = (e: MouseEvent, id: string) => {
    if (id.includes("v")) {
      const eId = boundListOpen.id.substring(1);
      const vId = id.substring(1);

      setHGMatrix((prevState) => {
        if (!prevState) return prevState;
        console.log(prevState);

        const newState = [...prevState];
        newState[Number(eId)][Number(vId)] = false;
        console.log(newState);
        return newState;
      });

      setHGLines((prevState) => {
        if (!prevState) return prevState;

        let newState = [...prevState];
        newState = newState.filter(val => !(val.start.id === boundListOpen.id && val.finish.id === id));

        return newState;
      });
      setHGVertexes((prevState) => {
        const newState = [...(prevState as CoordinateList)];

        for(let i = 0; i < newState.length; i++) {
          if(newState[i].id === id) {
            newState[i].color = '#ffffff';
            break;
          }
        }

        return newState;
      });
    } else {
      const eId = id.substring(1);
      const vId = boundListOpen.id.substring(1);

      setHGMatrix((prevState) => {
        if (!prevState) return prevState;
        console.log(prevState);

        const newState = [...prevState];
        newState[Number(eId)][Number(vId)] = false;
        console.log(newState);
        return newState;
      });

      setHGLines((prevState) => {
        if (!prevState) return prevState;

        let newState = [...prevState];
        newState = newState.filter(val => !(val.start.id === id && val.finish.id === boundListOpen.id));

        return newState;
      });
      setHGEdges((prevState) => {
        const newState = [...(prevState as CoordinateList)];

        for(let i = 0; i < newState.length; i++) {
          if(newState[i].id === id) {
            newState[i].color = '#ffffff';
            break;
          }
        }

        return newState;
      });
    }
  };

  const onMouseEnterVertexEdge = (e: MouseEvent<HTMLDivElement>, id: string) => {
    if (id.includes('v')) {
      setHGVertexes((prevState) => {
        const newState = [...(prevState as CoordinateList)];

        for(let i = 0; i < newState.length; i++) {
          if(newState[i].id === id) {
            newState[i].color = '#028a0f';
            break;
          }
        }

        return newState;
      });
      !showLines && setHGLines((prevState) => {
        const newLines = [...(prevState as CoordinateLineList)];

        for(let i = 0; i < newLines.length; i++) {
          if(
              newLines[i].start.id === boundListOpen.id &&
              newLines[i].finish.id === id
          ) {
            newLines[i].opacity = 0.5;
            break;
          }
        }

        return newLines;
      });
    } else {
      setHGEdges((prevState) => {
        const newState = [...(prevState as CoordinateList)];

        for(let i = 0; i < newState.length; i++) {
          if(newState[i].id === id) {
            newState[i].color = '#e3242b';
            break;
          }
        }

        return newState;
      });
      !showLines && setHGLines((prevState) => {
        const newLines = [...(prevState as CoordinateLineList)];

        for(let i = 0; i < newLines.length; i++) {
          if(
              newLines[i].start.id === id &&
              newLines[i].finish.id === boundListOpen.id
          ) {
            newLines[i].opacity = 0.5;
            break;
          }
        }

        return newLines;
      });
    }
  }

  const onMouseLeaveVertexEdge = (e: MouseEvent<HTMLDivElement>, id: string) => {
    if (id.includes('v')) {
      setHGVertexes((prevState) => {
        const newState = [...(prevState as CoordinateList)];

        for(let i = 0; i < newState.length; i++) {
          if(newState[i].id === id) {
            newState[i].color = '#ffffff';
            break;
          }
        }

        return newState;
      });
      !showLines && setHGLines((prevState) => {
          const newLines = [...(prevState as CoordinateLineList)];

          for(let i = 0; i < newLines.length; i++) {
            if(
                newLines[i].start.id === boundListOpen.id &&
                newLines[i].finish.id === id
            ) {
              newLines[i].opacity = 0;
              break;
            }
          }

          return newLines;
      });
    } else {
      setHGEdges((prevState) => {
        const newState = [...(prevState as CoordinateList)];

        for(let i = 0; i < newState.length; i++) {
          if(newState[i].id === id) {
            newState[i].color = '#ffffff';
            break;
          }
        }

        return newState;
      });
      !showLines && setHGLines((prevState) => {
        const newLines = [...(prevState as CoordinateLineList)];

        for(let i = 0; i < newLines.length; i++) {
          if(
              newLines[i].start.id === id &&
              newLines[i].finish.id === boundListOpen.id
          ) {
            newLines[i].opacity = 0;
            break;
          }
        }

        return newLines;
      });
    }
  }

  const addVertexEdgeBound = (text: string) => {
    if(boundListOpen.id.includes('e')) {
      const foundV = vertexes?.find(val => val.name === text);
      if(!foundV) {
        alert("Объект не найден!");
        return;
      }
      setHGLines((prevState) => {
        if(!prevState || !edges || !vertexes) return prevState;

        const newState = [...prevState];
        const foundLine = newState.find(val => val.start.id === boundListOpen.id && val.finish.id === text);

        if(foundLine) {
          alert('Связь уже существует!');
          return newState;
        }

        const foundE = edges.find(val => val.id === boundListOpen.id) as Coordinate;
        newState.push({
          id: 'l' + newState.length,
          opacity: showLines ? 0.5 : 0,
          start: foundE,
          finish: foundV,
          name: 'l' + newState.length,
        });

        alert('Связь добавлена!');
        return newState;
      })
    } else {
      const foundE = edges?.find(val => val.name === text);
      if(!foundE) {
        alert("Объект не найден!");
        return;
      }
      setHGLines((prevState) => {
        if(!prevState || !edges || !vertexes) return prevState;

        const newState = [...prevState];
        const foundLine = newState.find(val => val.start.id === text && val.finish.id === boundListOpen.id);

        if(foundLine) {
          alert('Связь уже существует!');
          return newState;
        }

        const foundV = vertexes.find(val => val.id === boundListOpen.id) as Coordinate;
        newState.push({
          id: 'l' + newState.length,
          opacity: showLines ? 0.5 : 0,
          start: foundE,
          finish: foundV,
          name: 'l' + newState.length,
        });

        alert('Связь добавлена!');
        return newState;
      });
    }
  }

  return (
    <div
      ref={divRef}
      id="boundList"
      className={`bg-purple-100 p-5 bg-opacity-10 fixed flex flex-col w-[220px] h-full ${boundListOpen.open ? "right-0" : "-right-[220px]"
        } top-0 z-[9999] transition-all`}
    >
      <p className="text-2xl font-medium text-white">{`Связанные объекты ${boundListOpen.id}`}</p>
      <div className="flex flex-col mt-5 gap-2 overflow-y-auto py-3 pr-3">
        {boundListOpen.id.includes("e") &&
          vertexes?.filter((val, i) =>(matrix as Matrix)[Number(boundListOpen.id.substring(1))][i]).map((val) => (
            <div
                key={val.id}
                className="flex flex-row items-center gap-2"
                onMouseEnter={(e) => onMouseEnterVertexEdge(e, val.id)}
                onMouseLeave={(e) => onMouseLeaveVertexEdge(e, val.id)}
            >
              <div className="flex justify-center items-center px-5 py-2 rounded-md border-white border text-white hover:text-black w-full focus:ring-0 hover:bg-opacity-50 outline-none bg-white bg-opacity-10 transition-all">
                {val.name}
              </div>
              <img
                onClick={(e) => handleDelObject(e, val.id)}
                src={"delete-bin-2-line.svg"}
                alt="trash"
                className="p-1 w-10 h-10 rounded-md border-white border cursor-pointer hover:bg-opacity-50 bg-white bg-opacity-0 transition-all"
              />
            </div>
          ))}
        {boundListOpen.id.includes("v") &&
          edges?.filter((val, i) =>(matrix as Matrix)[i][Number(boundListOpen.id.substring(1))]).map((val) => (
            <div
                key={val.id}
                className="flex flex-row items-center gap-2"
                onMouseEnter={(e) => onMouseEnterVertexEdge(e, val.id)}
                onMouseLeave={(e) => onMouseLeaveVertexEdge(e, val.id)}
            >
              <div className="flex justify-center items-center px-5 py-2 rounded-md border-white border text-white hover:text-black w-full focus:ring-0 hover:bg-opacity-50 outline-none bg-white bg-opacity-10 transition-all">
                {val.name}
              </div>
              <img
                onClick={(e) => handleDelObject(e, val.id)}
                src={"delete-bin-2-line.svg"}
                alt="trash"
                className="p-1 w-10 h-10 rounded-md border-white border cursor-pointer hover:bg-opacity-50 bg-white bg-opacity-0 transition-all"
              />
            </div>
          ))}
      </div>
      {/*<input*/}
      {/*    onChange={(e) => addVertexEdgeBound(e.target.value)}*/}
      {/*    type="text"*/}
      {/*    placeholder={`Введите имя ${boundListOpen.id.includes('e') ? "вершины" : "ребра"}`}*/}
      {/*    className="text-sm absolute bottom-10 w-[180px] placeholder-white text-white focus:placeholder-black focus:text-black w-full focus:ring-0 focus:bg-opacity-50 outline-none bg-white bg-opacity-10 px-3 py-2 rounded-md transition-all"*/}
      {/*/>*/}
    </div>
  );
};

export default BoundList;
