import React, { useState, useEffect, useMemo } from "react"
import { render } from "react-dom"
import { Cell, Grid } from "./Cell"
import { CellMapContext, useCellMap } from "./useCellMap"
import { cellText } from "./preText"

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
    </div>
  )
}

render(<App />, document.querySelector("#container"))
