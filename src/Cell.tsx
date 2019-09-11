import React, { useState, useMemo, useLayoutEffect, useContext } from "react"
import { useCell } from "./useCell"
import styled from "styled-components"
import { CellMapContext } from "./useCellMap"
import * as THREE from "three"
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
  grid-column-start: ${({ x }) => x + 1};
  grid-row-start: ${({ y }) => y + 1};
  background: ${({ value }) => (value ? "black" : "white")};
`
// export const CellItem = styled.div.attrs((props) => ({
//   color: props.value ? "black" : "white"
// }))`
//   width: ${cellPx}px;
//   height: ${cellPx}px;
//   background: ${(props) => props.color};
// `

export const Cell = ({ x, y, size }) => {
  const { getValue } = useContext(CellMapContext)
  const value = getValue(x, y)
  return <CellItem value={value} x={x} y={y} />
}

export const Grid = styled.div<any>`
  display: grid;
  grid-template-columns: repeat(${({ size }) => size}, ${cellPx}px);
`

export const CellMesh = ({ x, y }) => {
  const px = 1
  const { getValue } = useContext(CellMapContext)
  const value = getValue(x, y)

  if (value == null) {
    return
  }
  return (
    <mesh position={[x * px, y * px, 0]}>
      <boxBufferGeometry attach="geometry" args={[1, 1, 1]} />
      <meshNormalMaterial attach="material" color="black" />
    </mesh>
  )
}
