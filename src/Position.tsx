import styled from "styled-components"
import { CellItem, cellPx } from "./CellItem"

export const PositionAbsolute = styled.div`
  position: relative;
`

export const PositionCell = styled.div.attrs(({ x, y }) => ({
  top: y * cellPx,
  left: x * cellPx
}))`
  position: absolute;
  width: ${cellPx}px;
  height: ${cellPx}px;
  background: ${(props) => (props.value ? "black" : "white")};
  top: ${({ top }) => top}px;
  left: ${({ left }) => left}px;
`
