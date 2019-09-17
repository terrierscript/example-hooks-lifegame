import React, { useState, useMemo, createContext } from "react"
import { render } from "react-dom"
import { Cell, Grid, CellItem } from "./Cell"

import { useCellMap } from "./useCellMap"
import { Stripe } from "./LinerGradient"
const App = () => {
  const [size, setSize] = useState(100)
  const cellMapCtx = useCellMap(size)
  const { cellMap, getCellToRows, time, diff } = cellMapCtx
  const rows = getCellToRows()
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
      {/* <CellMapContext.Providear value={cellMapCtx}> */}
      {rows.map((v, i) => {
        return <Stripe key={i} data={v} />
      })}
      {/* </CellMapContext.Provider> */}
    </div>
  )
}

render(<App />, document.querySelector("#container"))
