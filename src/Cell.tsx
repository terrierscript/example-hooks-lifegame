import React, { useState, useMemo, useLayoutEffect, useContext } from "react"
import { useCell } from "./useCell"
import styled from "styled-components"
import { CellMapContext } from "./useCellMap"
export const cellPx = 4
export const CellItem = styled.div`
  width: ${cellPx}px;
  height: ${cellPx}px;
  grid-column-start: ${({ x }) => x + 1};
  grid-row-start: ${({ y }) => y + 1};
  background: ${({ value }) => (value ? "black" : "white")};
`

export const Cell = ({ x, y, size }) => {
  const { getValue } = useContext(CellMapContext)
  const value = getValue(x, y)
  return <CellItem value={value} x={x} y={y} />
}
export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${({ size }) => size}, ${cellPx}px);
`
