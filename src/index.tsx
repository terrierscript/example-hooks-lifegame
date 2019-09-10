import React, {
  useState,
  useEffect,
  useMemo,
  useLayoutEffect,
  createContext,
  useContext,
  useCallback
} from "react"
import { render } from "react-dom"
import styled from "styled-components"
import { Stage, Layer, Rect } from "react-konva"

const cellPx = 4

const next = (val, num) => {
  if (val) {
    if (num < 2) return false
    if (3 < num) return false
    return true
  } else {
    if (num === 3) return true
    return false
  }
}
const CellItem = styled.div`
  width: ${cellPx}px;
  height: ${cellPx}px;
  background: ${({ value }) => (value ? "black" : "white")};
`
const useTimerEffect = () => {
  const [time, setTimer] = useState(new Date().getTime())
  const [diff, setDiff] = useState(0)
  useLayoutEffect(() => {
    const loop = () => {
      roopFn(() => {
        const f = new Date().getTime()
        setTimer((time) => {
          setDiff(f - time)
          return f
        })
        loop()
      }, 1000)
    }
    loop()
  }, [])
  return { time, diff }
}

const useCellMap = (size) => {
  const { time, diff } = useTimerEffect()

  const [cellMap, setMap] = useState(() => {
    const arr = initialArray(size)
    return Object.fromEntries(
      arr.map((a) => {
        return [a.key, { x: a.x, y: a.y, v: a.v }]
      })
    )
  })

  const updateValue = useCallback(
    ({ x, y, v }) => {
      setMap((oldMap) => {
        return {
          ...oldMap,
          [`${x}_${y}`]: { x, y, v }
        }
      })
    },
    [setMap]
  )
  const getValue = (x, y) => {
    // console.log(x, y, cellMap[`${x}_${y}`], (cellMap[`${x}_${y}`] || {}).v)
    return (cellMap[`${x}_${y}`] || {}).v
  }
  const memo = useMemo(() => Object.values(cellMap), [cellMap])
  useEffect(() => {
    setMap(
      Object.fromEntries(
        memo.map(({ x, y, v }) => {
          const adjCellSize = adjCells(x, y, size)
          const vs = adjCellSize.map(([x, y]) => getValue(x, y))
          const num = vs.reduce((acc: number, curr) => acc + curr, 0)
          const nextValue = next(v, num) ? 1 : 0
          return [`${x}_${y}`, { x, y, v: nextValue }]
        })
      )
    )
  }, [time])
  return { cellMap, updateValue, getValue, time, diff }
}

const CellMapContext = React.createContext<ReturnType<typeof useCellMap>>(
  // @ts-ignore
  null
  //   {
  //   cellMap: {},
  //   updateValue: () => {},

  //   getValue: (x: number, y: number) => {
  //     console.error("Not init")
  //     // throw new Error("not initialized")
  //     return 0
  //   },
  //   time: 0,
  //   diff: 0
  // }
)

const adjCells = (x, y, size) =>
  [x, x + 1, x - 1]
    .map((xx) => [y, y + 1, y - 1].map((yy) => [xx, yy]))
    .flat()
    .filter(([xx, yy]) => !(xx === x && yy === y)) // && validCell(xx, yy, size))

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ size }) => size}, ${cellPx}px);
`
const initialArray = (size) => {
  return Array(size)
    .fill([])
    .map((_, y) => {
      return Array(size)
        .fill(0)
        .map((_, x) => ({
          key: `${x}_${y}`,
          x,
          y,
          v: Math.random() > 0.5 ? 1 : 0
        }))
    })
    .flat()
}
const roopFn = (fn, time) => {
  // return setTimeout(fn, 1000)
  // return setTimeout(fn, time)
  // @ts-ignore
  return requestIdleCallback(fn, { timeout: time })
}

const App = () => {
  const [size, setSize] = useState(80)
  const cellMapCtx = useCellMap(size)
  const { cellMap, time, diff } = cellMapCtx
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
          onChange={(e) => setSize(Number(e.target.value))}
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
            {Object.values(cellMap).map(({ x, y, v }) => (
              <Cell
                // time={time}
                x={x}
                y={y}
                v={v}
                size={size}
                key={`${size}_${y}_${x}`}
                // initial={v}
              ></Cell>
            ))}
          </Layer>
        </Stage>
      </CellMapContext.Provider>
    </div>
  )
}

const cellProps = (x, y, v) => {
  return {
    width: 4,
    height: 4,
    x: x * 4,
    y: y * 4,
    fill: v ? "black" : "white"
  }
}

const Cell = ({ x, y, v, size }) => {
  // console.log(x, y, value)

  const prop = cellProps(x, y, v)
  if (x == 5 && y == 5) {
    // console.log(prop, value)
  }
  return <Rect {...prop} />
}

render(<App />, document.querySelector("#container"))
