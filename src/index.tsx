import React, {
  useState,
  useEffect,
  useMemo,
  useLayoutEffect,
  createContext,
  useContext,
  useCallback
} from "react";
import { render } from "react-dom";
import styled from "@emotion/styled";
import { Stage, Layer, Rect } from "react-konva";

import module from "../rust-life/Cargo.toml";
// import module from "./rust-life/src/lib.rs"
const cellPx = 4;

const CellItem = styled.div`
  width: ${cellPx}px;
  height: ${cellPx}px;
  background: ${({ value }) => (value ? "black" : "white")};
  /* border: 1px solid red; */
`;
const useTimerEffect = () => {
  const [time, setTimer] = useState(new Date().getTime());
  const [diff, setDiff] = useState(0);
  useLayoutEffect(() => {
    const loop = () => {
      roopFn(() => {
        const f = new Date().getTime();
        setTimer(time => {
          setDiff(f - time);
          return f;
        });
        loop();
      }, 1000);
    };
    loop();
  }, []);
  return { time, diff };
};

const useCellMap = size => {
  const { time, diff } = useTimerEffect();

  const [cellMap, setMap] = useState(() => {
    const i = initialArray(size);
    // console.log(i)
    return i;
  });

  useEffect(() => {
    setMap(initialArray(size));
  }, [size]);

  const getValue = useCallback(
    i => {
      return cellMap[i];
      // const idx = y * size + x
      // // if (idx > cellMap.length) {
      // //   throw new Error(`${x}_${y} ${cellMap.length}`)
      // // }
      // return !!cellMap[idx]
    },
    [cellMap]
  );

  const getXY = i => {
    const d = [i % size, Math.floor(i / size)];
    return d;
  };

  // const memo = useMemo(() => Object.values(cellMap), [cellMap])
  useEffect(() => {
    const newMap = module.main(size, cellMap);
    // @ts-ignore
    setMap(Array.from(newMap));
  }, [time]);
  return { cellMap, getValue, time, diff, getXY };
};

const CellMapContext = createContext<ReturnType<typeof useCellMap>>(
  // @ts-ignore
  {}
);

// const _Cell = ({ x, y,value }) => {
//   // const { getValue } = useContext(CellMapContext)
//   const value = getValue(x, y)
//   return <CellItem value={value} />
// }

// const Cell = _Cell
// const Cell = React.memo(_Cell)

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ size }) => size}, ${cellPx}px);
`;
const initialArray = size => {
  return Array(size * size)
    .fill(1)
    .map(() => (Math.random() > 0.5 ? 1 : 0));
};

const roopFn = (fn, time) => {
  // return setTimeout(fn, time)
  // @ts-ignore
  return requestIdleCallback(fn, { timeout: time });
};

const App = () => {
  const [size, setSize] = useState(30);
  const cellMapCtx = useCellMap(size);
  const { cellMap, time, diff, getXY } = cellMapCtx;

  return (
    <div>
      <div>
        frame: {time}(diff: {diff})
      </div>
      <div>
        size
        <input
          type="number"
          value={size}
          onChange={e => setSize(Number(e.target.value))}
        ></input>
        <button onClick={() => setSize(10)}>cell: 10</button>
        <button onClick={() => setSize(30)}>cell: 30</button>
        <button onClick={() => setSize(50)}>cell: 50</button>
        <button onClick={() => setSize(80)}>cell: 80</button>
        <button onClick={() => setSize(100)}>cell: 100</button>
      </div>

      <CellMapContext.Provider value={cellMapCtx}>
        <Stage width={size * 4} height={size * 4}>
          <Layer>
            {cellMap.map((v, i) => {
              const [x, y] = getXY(i);
              return (
                <Cell
                key={i}
                  // time={time}
                  x={x}
                  y={y}
                  v={v}
                  size={size}
                  // initial={v}
                ></Cell>
              );
            })}
          </Layer>
        </Stage>
      </CellMapContext.Provider>
    </div>
  );
};

const cellProps = (x, y, v) => {
  return {
    width: 4,
    height: 4,
    x: x * 4,
    y: y * 4,
    fill: v ? "black" : "white"
  };
};

const Cell = ({ x, y, v, size }) => {
  // console.log(x, y, value)

  const prop = cellProps(x, y, v);
  if (x == 5 && y == 5) {
    // console.log(prop, value)
  }
  return <Rect {...prop} />;
};

render(<App />, document.querySelector("#container"));
