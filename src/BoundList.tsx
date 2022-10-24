import { Dispatch, FC, MouseEvent, SetStateAction, useRef } from "react";
import { CoordinateLineList, CoordinateList, Matrix } from "./hg/hgTypes";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setBoundListOpen } from "./store/slices/appSlice";

export interface BoundListProps {
  edges: CoordinateList | null;
  vertexes: CoordinateList | null;
  matrix: Matrix | null;
  setHGMatrix: Dispatch<SetStateAction<Matrix | null>>;
  setHGLines: Dispatch<SetStateAction<CoordinateLineList | null>>;
  setHGEdges: Dispatch<SetStateAction<CoordinateList | null>>;
  setHGVertexes: Dispatch<SetStateAction<CoordinateList | null>>;
}

const BoundList: FC<BoundListProps> = ({
  edges,
  vertexes,
  matrix,
  setHGMatrix,
  setHGLines,
  setHGEdges,
  setHGVertexes,
}) => {
  const dispatch = useAppDispatch();
  const { boundListOpen } = useAppSelector((state) => state.app);
  const divRef = useRef<HTMLDivElement | null>(null);

  const handleDelObject = (e: MouseEvent, id: string) => {
    if (id.includes("v")) {
      const eId = boundListOpen.id.substring(1);
      const vId = id.substring(1);

      setHGMatrix((prevState) => {
        if (!prevState) return prevState;

        const newState = [...prevState];
        newState[Number(eId)][Number(vId)] = false;
        return newState;
      });

      setHGLines((prevState) => {
        if (!prevState) return prevState;

        let newState = [...prevState];
        newState = newState.filter(val => !(val.start.id === boundListOpen.id && val.finish.id === id));

        return newState;
      });
    } else {
      const eId = id.substring(1);
      const vId = boundListOpen.id.substring(1);

      setHGMatrix((prevState) => {
        if (!prevState) return prevState;

        const newState = [...prevState];
        newState[Number(eId)][Number(vId)] = false;
        return newState;
      });

      setHGLines((prevState) => {
        if (!prevState) return prevState;

        let newState = [...prevState];
        newState = newState.filter(val => !(val.start.id === id && val.finish.id === boundListOpen.id));

        return newState;
      });
    }
  };

  return (
    <div
      ref={divRef}
      id="boundList"
      className={`bg-purple-100 p-5 bg-opacity-10 fixed flex flex-col w-[220px] h-full ${boundListOpen.open ? "right-0" : "-right-[220px]"
        } top-0 z-[9999] transition-all`}
    >
      <p className="text-2xl font-medium text-white">Связанные объекты</p>
      <div className="flex flex-col mt-5 gap-2 overflow-y-auto py-3 pr-3">
        {boundListOpen.id.includes("e") &&
          vertexes?.filter((val, i) =>(matrix as Matrix)[Number(boundListOpen.id.substring(1))][i]).map((val) => (
            <div key={val.id} className="flex flex-row items-center gap-2">
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
            <div key={val.id} className="flex flex-row items-center gap-2">
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
      {/* <button className="block px-5 py-2 rounded-md bg-white text-black bg-opacity-70 cursor-pointer hover:bg-opacity-100 transition-all focus:ring-0 outline-none">
        Добавить
      </button> */}
    </div>
  );
};

export default BoundList;
