import React, { useState, useMemo, useLayoutEffect } from "react"
import { useCell } from "./useCell"
import styled from "styled-components"
// import styled from "@emotion/styled"
export const cellPx = 4

type CellType = {
  value: boolean | number
  x: number
  y: number
}
export const CellItem = styled.div.attrs<CellType>({
  style: ({ x, y, value }) => ({
    gridColumnStart: x + 1,
    gridRowStart: y + 1,
    background: value ? "black" : "white"
  })
})`
  width: ${cellPx}px;
  height: ${cellPx}px;
`
// export const CellItem = styled.div.attrs((props) => ({
//   color: props.value ? "black" : "white"
// }))`
//   width: ${cellPx}px;
//   height: ${cellPx}px;
//   background: ${(props) => props.color};
// `

const getId = (x, y) => `cell-${x}_${y}`
const validCell = (xx, yy, size) =>
  !(xx < 0) && !(yy < 0) && !(size <= xx) && !(size <= yy)
const adjCellIds = (x, y, size) =>
  [x, x + 1, x - 1]
    .map((xx) => [y, y + 1, y - 1].map((yy) => [xx, yy]))
    .flat()
    .filter(([xx, yy]) => !(xx === x && yy === y) && validCell(xx, yy, size))

export const Cell = ({ x, y, initial, time, size }) => {
  const [start, setStart] = useState(false)
  const { value, update } = useCell(initial)
  const id = getId(x, y)
  const adjCells = useMemo(
    () => adjCellIds(x, y, size).map(([x, y]) => getId(x, y)),
    [x, y, size]
  )
  // console.log(adjCells)
  const adjCellElms = useMemo(() => {
    return adjCells
      .map((id) => document.getElementById(id))
      .filter((elm) => !!elm)
    //  === "1" ? 1 : 0))
  }, [time, adjCells])

  const adj = useMemo(() => {
    return adjCellElms.map((elm) => elm && elm.dataset.value)
    //  === "1" ? 1 : 0))
  }, [time, adjCells])

  console.log(x, y, value, adjCellElms)

  useLayoutEffect(() => {
    if (!adj || adj.every((a) => a === null)) {
      return
    }
    setStart(true)
  }, [start, adjCellElms])

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
  if (!value) {
    return null
  }
  return <CellItem x={x} y={y} id={id} data-value={value} value={value} />
}

export const Grid = styled.div<any>`
  display: grid;
  grid-template-columns: repeat(${({ size }) => size}, ${cellPx}px);
`
