import React, { useState, useEffect, useMemo, useLayoutEffect } from "react"
import { render } from "react-dom"
import styled from "styled-components"

const size = 50
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

const Cell = ({ x, y, initial, time }) => {
  const [start, setStart] = useState(false)
  const { value, update } = useCell(initial)
  const id = getId(x, y)
  const adjCells = useMemo(
    () => adjCellIds(x, y, size).map(([x, y]) => getId(x, y)),
    [x, y]
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
  return <CellItem id={id} data-value={value} value={value} />
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${size}, ${cellPx}px);
`
const initialArray = (size) =>
  Array(size)
    .fill([])
    .map((v) =>
      Array(size)
        .fill(0)
        .map(() => (Math.random() > 0.5 ? 1 : 0))
    )

const roopFn = (fn, time) => {
  // return setTimeout(fn, time)
  // @ts-ignore
  return requestIdleCallback(fn, { timeout: time })
}
const useTimerEffect = () => {
  const [time, setTimer] = useState(new Date().getTime())
  useLayoutEffect(() => {
    const loop = () => {
      roopFn(() => {
        setTimer(new Date().getTime())
        loop()
      }, 1000)
    }
    loop()
  }, [])
  return time
}

const App = () => {
  const time = useTimerEffect()
  const arr = initialArray(size)
  return (
    <div>
      frame: {time}
      <Grid>
        {arr.map((ys, y) =>
          ys.map((v, x) => (
            <Cell time={time} x={x} y={y} key={`${y}_${x}`} initial={v}></Cell>
          ))
        )}
      </Grid>
    </div>
  )
}

render(<App />, document.querySelector("#container"))
