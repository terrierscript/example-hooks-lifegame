import React, { useState, useEffect } from "react"
import { render } from "react-dom"
import styled from "styled-components"

const size = 30
const cellPx = 10

const next = (val, adj) => {
  const num = adj.reduce((acc, curr) => acc + curr, 0)
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
  const update = (adj) => {
    setValue(next(value, adj) ? 1 : 0)
  }
  return { value, update }
}

const CellItem = styled.div`
  width: ${cellPx}px;
  height: ${cellPx}px;
  background: ${({ value }) => (value ? "black" : "white")};
`
const getId = (x, y) => `cell-${x}_${y}`
const Cell = ({ x, y, initial, time }) => {
  const { value, update } = useCell(initial)
  const id = getId(x, y)
  useEffect(() => {
    const adj = [x, x + 1, x - 1]
      .map((xx) => [y, y + 1, y - 1].map((yy) => [xx, yy]))
      .flat()
      .map(([x, y]) => getId(x, y))
      .filter((cellId) => id !== cellId)
      .map((cellId) => {
        return document.getElementById(cellId)
      })
      .map((elm) => {
        if (!elm) {
          return 0
        }
        return elm.dataset.value === "1" ? 1 : 0
      })
    update(adj)
  }, [time])
  return (
    <CellItem id={id} data-value={value} value={value}>
      {/* {value} */}
    </CellItem>
  )
}

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${size}, ${cellPx}px);
`
const App = () => {
  const arr = Array(size)
    .fill([])
    .map((v) =>
      Array(size)
        .fill(0)
        .map(() => (Math.random() > 0.5 ? 1 : 0))
    )

  const [time, setTimer] = useState(new Date().getTime())
  useEffect(() => {
    const loop = () => {
      requestIdleCallback(() => {
        setTimer(new Date().getTime())
        loop()
      }, {
        timeout: 100
      })
    }
    loop()
  }, [])
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
