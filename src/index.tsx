import React, { useState, useEffect, useMemo, useLayoutEffect } from "react"
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
const useCell = (initial) => {
  const [value, setValue] = useState(initial)
  const update = (num) => {
    setValue(next(value, num) ? 1 : 0)
  }
  return { value, update }
}

const CellItem = styled.div`
  width: ${cellPx}px;
  height: ${cellPx}px;
  background: ${({ value }) => (value ? "black" : "white")};
`
const getId = (x, y) => `cell-${x}_${y}`

const validCell = (xx, yy, size) =>
  !(xx < 0) && !(yy < 0) && !(size <= xx) && !(size <= yy)

const adjCellIds = (x, y, size) =>
  [x, x + 1, x - 1]
    .map((xx) => [y, y + 1, y - 1].map((yy) => [xx, yy]))
    .flat()
    .filter(([xx, yy]) => !(xx === x && yy === y) && validCell(xx, yy, size))

const cellProps = (x, y, v) => {
  return {
    width: 4,
    height: 4,
    x: x * 4,
    y: y * 4,
    fill: v ? "black" : "white"
  }
}
const Cell = ({ x, y, initial, time, size }) => {
  const [start, setStart] = useState(false)
  const { value, update } = useCell(initial)
  const id = getId(x, y)
  const adjCells = useMemo(
    () => adjCellIds(x, y, size).map(([x, y]) => getId(x, y)),
    [x, y, size]
  )

  // console.log(adjCells)
  const adj = useMemo(() => {
    return adjCells
      .map((id) => document.getElementById(id))
      .map((elm) => elm && elm.dataset.value)
    //  === "1" ? 1 : 0))
  }, [time, adjCells])
  useLayoutEffect(() => {
    if (adj[0] === null) {
      return
    }
    setStart(true)
  }, [start, adj])
  const num = useMemo(
    () =>
      adj
        .map((c) => (c === "1" ? 1 : 0))
        .reduce((acc: number, curr) => acc + curr, 0),
    [adj]
  )

  // console.log(x, y, adj)
  useLayoutEffect(() => {
    if (start) {
      update(num)
    }
  }, [start, num])
  const props = cellProps(x, y, value)
  if(x == 10 &&y==10){

    console.log(props)
  }
  return <Rect {...props} />
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ size }) => size}, ${cellPx}px);
`
const initialArray = (size) => {
  return Array(size)
    .fill([])
    .map((v, y) => {
      return Array(size)
        .fill(0)
        .map((_, x) => ({ x, y, v: Math.random() > 0.5 ? 1 : 0 }))
    })
    .flat()
}
const roopFn = (fn, time) => {
  // return setTimeout(fn, time)
  // @ts-ignore
  return requestIdleCallback(fn, { timeout: time })
}
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

const App = () => {
  const { time, diff } = useTimerEffect()
  const [size, setSize] = useState(30)
  const arr = useMemo(() => {
    const arr = initialArray(size)
    return arr
  }, [size])
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
      <Stage width={size * 4} height={size * 4}>
        <Layer>
          {arr.map(({ x, y, v }) => (
            <Cell
              time={time}
              x={x}
              y={y}
              size={size}
              key={`${size}_${y}_${x}`}
              initial={v}
            ></Cell>
          ))}
        </Layer>
      </Stage>
    </div>
  )
}

render(<App />, document.querySelector("#container"))
