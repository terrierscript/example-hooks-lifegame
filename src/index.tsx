import React, { useState, useMemo, createContext } from "react"
import { render } from "react-dom"
import { Cell, Grid, CellItem } from "./Cell"

const chunk = (input, size) => {
  return input.reduce((arr, item, idx) => {
    return idx % size === 0
      ? [...arr, [item]]
      : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]]
  }, [])
}
const cellText = (cellMap, size) => {
  const arr = cellMap.map((c) => (c ? "■" : "□"))
  return chunk(arr, size)
    .map((c) => c.join(""))
    .join("\n")
}
import { useCellMap } from "./useCellMap"
const App = () => {
  const [size, setSize] = useState(100)
  const cellMapCtx = useCellMap(size)
  const { cellMap, time, diff } = cellMapCtx
  const ct = cellText(cellMap, size)
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
      <pre>
        <code>{ct}</code>
      </pre>
      {/* <CellMapContext.Providear value={cellMapCtx}> */}
      {/* <Grid size={size} key={size}>
        {cellMap.map((v, i) => {
          return <CellItem key={i} value={v} />
        })}
      </Grid> */}
      {/* </CellMapContext.Provider> */}
    </div>
  )
}

render(<App />, document.querySelector("#container"))
