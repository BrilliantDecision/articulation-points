import "./styles/index.css";
import { useRef, useState } from "react";
import { Circle, Layer, Line, Stage } from "react-konva";
import Konva from "konva";
import KonvaEventObject = Konva.KonvaEventObject;
import Vector2d = Konva.Vector2d;
import { CoordinateLineList, CoordinateList, Matrix } from "./hg/hgTypes";
import Options from "./Options";
import BoundList from "./BoundList";
import { useAppDispatch, useAppSelector } from "./store/hooks";
import { setBoundListOpen } from "./store/slices/appSlice";

function App() {
  const dispatch = useAppDispatch();
  const scaleBy = 1.01;
  const stageRef = useRef<Konva.Stage>(null);
  const [lastCenter, setLastCenter] = useState<Vector2d | null>(null);
  const [lastDist, setLastDist] = useState<number>(0);

  // interface
  const [vertexNum, setVertexNum] = useState(0);
  const [edgeNum, setEdgeNum] = useState(0);
  const { boundListOpen } = useAppSelector((state) => state.app);

  // hypergraph state
  const [matrix, setHGMatrix] = useState<Matrix | null>(null);
  const [vertexes, setHGVertexes] = useState<CoordinateList | null>(null);
  const [edges, setHGEdges] = useState<CoordinateList | null>(null);
  const [lines, setHGLines] = useState<CoordinateLineList | null>(null);

  // HYPERGRAPH FUNCTIONS

  const setNewVertexesEdges = (
    e: KonvaEventObject<DragEvent>,
    prevState: CoordinateList | null
  ) => {
    if (!prevState) return prevState;

    const newState = [...prevState];

    for (let i = 0; i < newState.length; i++) {
      if (newState[i].id === e.target.id()) {
        newState[i].x = e.target.x();
        newState[i].y = e.target.y();
        break;
      }
    }

    return newState;
  };

  const setNewLines = (
    e: KonvaEventObject<DragEvent>,
    prevState: CoordinateLineList | null
  ) => {
    if (!prevState) return prevState;

    const newState = [...prevState];

    for (let i = 0; i < newState.length; i++) {
      if (newState[i].start.id === e.target.id()) {
        newState[i].start.x = e.target.x();
        newState[i].start.y = e.target.y();
      } else if (newState[i].finish.id === e.target.id()) {
        newState[i].finish.x = e.target.x();
        newState[i].finish.y = e.target.y();
      }
    }

    return newState;
  };

  const handleDragMove = (e: KonvaEventObject<DragEvent>) => {
    setHGVertexes((prevState) => setNewVertexesEdges(e, prevState));
    setHGEdges((prevState) => setNewVertexesEdges(e, prevState));
    setHGLines((prevState) => setNewLines(e, prevState));
  };

  const handleMouseEnterLeaveVertexEdge = (
    e: KonvaEventObject<MouseEvent>,
    opacity: number
  ) => {
    setHGLines((prevState) => {
      if (!prevState) return prevState;

      const newState = [...prevState];

      for (let i = 0; i < newState.length; i++) {
        if (
          newState[i].start.id === e.target.id() ||
          newState[i].finish.id === e.target.id()
        ) {
          newState[i].opacity = opacity;
        }
      }

      return newState;
    });
  };

  // STAGE FUNCTIONS

  const getDistance = (p1: Vector2d, p2: Vector2d) => {
    return Math.sqrt(Math.pow(p2.x - p1.x, 2) + Math.pow(p2.y - p1.y, 2));
  };

  const getCenter = (p1: Vector2d, p2: Vector2d) => {
    return {
      x: (p1.x + p2.x) / 2,
      y: (p1.y + p2.y) / 2,
    };
  };

  const zoomStage = (event: KonvaEventObject<WheelEvent>) => {
    event.evt.preventDefault();

    if (stageRef.current !== null) {
      const stage = stageRef.current;
      const oldScale = stage.scaleX();
      const { x: pointerX, y: pointerY } =
        stage.getPointerPosition() as Vector2d;
      const mousePointTo = {
        x: (pointerX - stage.x()) / oldScale,
        y: (pointerY - stage.y()) / oldScale,
      };
      const newScale =
        event.evt.deltaY > 0
          ? oldScale * scaleBy - 0.02
          : oldScale / scaleBy + 0.02;
      stage.scale({ x: newScale, y: newScale });
      const newPos = {
        x: pointerX - mousePointTo.x * newScale,
        y: pointerY - mousePointTo.y * newScale,
      };
      stage.position(newPos);
      stage.batchDraw();
    }
  };

  const handleTouch = (e: KonvaEventObject<TouchEvent>) => {
    e.evt.preventDefault();
    const touch1 = e.evt.touches[0];
    const touch2 = e.evt.touches[1];
    const stage = stageRef.current;

    if (stage !== null) {
      if (touch1 && touch2) {
        if (stage.isDragging()) {
          stage.stopDrag();
        }

        const p1 = {
          x: touch1.clientX,
          y: touch1.clientY,
        };
        const p2 = {
          x: touch2.clientX,
          y: touch2.clientY,
        };

        if (!lastCenter) {
          setLastCenter(() => getCenter(p1, p2));
          return;
        }
        const newCenter = getCenter(p1, p2);

        const dist = getDistance(p1, p2);

        const tempDist = dist;

        if (!lastDist) {
          setLastDist(() => dist);
        }

        // local coordinates of center point
        const pointTo = {
          x: (newCenter.x - stage.x()) / stage.scaleX(),
          y: (newCenter.y - stage.y()) / stage.scaleX(),
        };

        const scale = stage.scaleX() * (dist / lastDist ? lastDist : tempDist);

        stage.scaleX(scale);
        stage.scaleY(scale);

        // calculate new position of the stage
        const dx = newCenter.x - lastCenter.x;
        const dy = newCenter.y - lastCenter.y;

        const newPos = {
          x: newCenter.x - pointTo.x * scale + dx,
          y: newCenter.y - pointTo.y * scale + dy,
        };

        stage.position(newPos);
        stage.batchDraw();

        setLastDist(() => dist);
        setLastCenter(() => newCenter);
      }
    }
  };

  const handleTouchEnd = (e: KonvaEventObject<TouchEvent>) => {
    setLastCenter(() => null);
    setLastDist(() => 0);
  };

  const handleOnDblClickVertex = (e: KonvaEventObject<MouseEvent>) => {
      if (!boundListOpen.open) dispatch(setBoundListOpen({ id: e.target.id(), open: true }));
      else if (boundListOpen.id && e.target.id() !== boundListOpen.id) dispatch(setBoundListOpen({ id: e.target.id(), open: true }));
      else dispatch(setBoundListOpen( { id: boundListOpen.id, open: false }));
      console.log(matrix);
  };

  return (
    <div className="relative bg-[#240e4a]">
      <Options
        vertexNum={vertexNum}
        edgeNum={edgeNum}
        matrix={matrix}
        setEdgeNum={setEdgeNum}
        setVertexNum={setVertexNum}
        setHGMatrix={setHGMatrix}
        setHGEdges={setHGEdges}
        setHGVertexes={setHGVertexes}
        setHGLines={setHGLines}
      />
      <BoundList
        vertexes={vertexes}
        edges={edges}
        matrix={matrix}
        setHGMatrix={setHGMatrix}
        setHGLines={setHGLines}
        setHGEdges={setHGEdges}
        setHGVertexes={setHGVertexes}
      />
      <Stage
        draggable={true}
        width={window.innerWidth}
        height={window.innerHeight}
        // onWheel={(e) => zoomStage(e)}
        onTouchMove={(e) => handleTouch(e)}
        onTouchEnd={(e) => handleTouchEnd(e)}
        ref={stageRef}
        scaleX={1}
        scaleY={1}
      >
        <Layer>
          {lines &&
            lines.map((coord) => (
              <Line
                id={coord.id}
                key={coord.id}
                points={[
                  coord.start.x,
                  coord.start.y,
                  coord.finish.x,
                  coord.finish.y,
                ]}
                stroke={"white"}
                strokeWidth={1}
                lineCap="round"
                lineJoin="round"
                perfectDrawEnabled={false}
                opacity={coord.opacity}
              />
            ))}
          {edges &&
            edges.map((coord) => (
              <Circle
                shadowBlur={16}
                shadowColor={coord.color}
                draggable={true}
                id={coord.id}
                key={coord.id}
                x={coord.x}
                y={coord.y}
                radius={16}
                fill={coord.color}
                perfectDrawEnabled={false}
                onDragMove={(e) => handleDragMove(e)}
                onDblClick={(e) => handleOnDblClickVertex(e)}
                onMouseEnter={(e) => handleMouseEnterLeaveVertexEdge(e, 0.5)}
                onMouseLeave={(e) => handleMouseEnterLeaveVertexEdge(e, 0)}
              />
            ))}
          {vertexes &&
            vertexes.map((coord) => (
              <Circle
                shadowBlur={12}
                shadowColor={coord.color}
                draggable={true}
                id={coord.id}
                key={coord.id}
                x={coord.x}
                y={coord.y}
                radius={8}
                fill={coord.color}
                perfectDrawEnabled={false}
                onDragMove={(e) => handleDragMove(e)}
                onDblClick={(e) => handleOnDblClickVertex(e)}
                onMouseEnter={(e) => handleMouseEnterLeaveVertexEdge(e, 0.5)}
                onMouseLeave={(e) => handleMouseEnterLeaveVertexEdge(e, 0)}
              />
            ))}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
