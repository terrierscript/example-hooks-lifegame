import React, { useState, useEffect, useMemo } from "react"
import { render } from "react-dom"
import { Cell, Grid } from "./Cell"
import { CellMapContext, useCellMap } from "./useCellMap"

const App = () => {
  const [size, setSize] = useState(30)
  const cellMapCtx = useCellMap(size)
  const { cellMap, time, diff } = cellMapCtx

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
      <CellMapContext.Provider value={cellMapCtx}>
        <Grid size={size} key={size}>
          {Object.values(cellMap).map(({ x, y }) => (
            <Cell x={x} y={y} size={size} key={`${size}_${y}_${x}`}></Cell>
          ))}
        </Grid>
      </CellMapContext.Provider>
    </div>
  )
}

render(<App />, document.querySelector("#container"))
