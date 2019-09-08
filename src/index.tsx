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
  const getValue = useCallback(
    (x, y) => {
      return cellMap[`${x}_${y}`].v
    },
    [cellMap]
  )
  return { cellMap, updateValue, getValue, time, diff }
}

const CellMapContext = createContext<ReturnType<typeof useCellMap>>({
  cellMap: {},
  updateValue: () => {},
  getValue: (x: number, y: number) => {
    return 0
  },
  time: 0,
  diff: 0
})

// const getId = (x, y) => `cell-${x}_${y}`

const validCell = (xx, yy, size) =>
  !(xx < 0) && !(yy < 0) && !(size <= xx) && !(size <= yy)

const adjCells = (x, y, size) =>
  [x, x + 1, x - 1]
    .map((xx) => [y, y + 1, y - 1].map((yy) => [xx, yy]))
    .flat()
    .filter(([xx, yy]) => !(xx === x && yy === y) && validCell(xx, yy, size))

const Cell = ({ x, y, size }) => {
  const { updateValue, getValue, time } = useContext(CellMapContext)
  const value = getValue(x, y)
  const adjCellSize = useMemo(() => adjCells(x, y, size), [x, y, size])
  // useLayoutEffect(() => {
  //   const vs = adjCellSize.map(([x, y]) => getValue(x, y))
  //   const num = vs
  //     .map((c) => (c === 1 ? 1 : 0))
  //     .reduce((acc: number, curr) => acc + curr, 0)
  //   const nextValue = next(value, num) ? 1 : 0
  //   updateValue({ x, y, v: nextValue })
  // }, [time])
  return <CellItem value={value} />
}

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
  // return setTimeout(fn, time)
  // @ts-ignore
  return requestIdleCallback(fn, { timeout: time })
}

const App = () => {
  const [size, setSize] = useState(30)
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
        <Grid size={size} key={size}>
          {Object.values(cellMap).map(({ x, y }) => (
            <Cell x={x} y={y} size={size} key={`${size}_${y}_${x}`}></Cell>
          ))}
        </Grid>
      </CellMapContext.Provider>
    </div>
  )
}

render(<App />, document.querySelector("#container"))
