import React, { useState, useMemo, useLayoutEffect, useContext } from "react"
import { useCell } from "./useCell"
import styled from "styled-components"
import { CellMapContext } from "./useCellMap"
export const cellPx = 4
export const CellItem = styled.div`
  width: ${cellPx}px;
  height: ${cellPx}px;
  background: ${({ value }) => (value ? "black" : "white")};
`

// const getId = (x, y) => `cell-${x}_${y}`
// const validCell = (xx, yy, size) =>
// !(xx < 0) && !(yy < 0) && !(size <= xx) && !(size <= yy)
// const adjCellIds = (x, y, size) =>
//   [x, x + 1, x - 1]
//     .map((xx) => [y, y + 1, y - 1].map((yy) => [xx, yy]))
//     .flat()
//     .filter(([xx, yy]) => !(xx === x && yy === y) && validCell(xx, yy, size))
export const Cell = ({ x, y, size }) => {
  const { getValue } = useContext(CellMapContext)
  const value = getValue(x, y)
  return <CellItem value={value} />
}
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ size }) => size}, ${cellPx}px);
`
