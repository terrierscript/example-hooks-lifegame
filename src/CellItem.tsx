// import styled from "@emotion/styled"
import styled from "styled-components"
export const cellPx = 4

export const CellItem = styled.div<{
  value: boolean
}>`
  width: ${cellPx}px;
  height: ${cellPx}px;
  background: ${(props) => (props.value ? "black" : "white")};
`
