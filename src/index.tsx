import React, { useState, useMemo, createContext } from "react"
import { render } from "react-dom"
import { Cell, Grid, CellItem, CellMesh } from "./Cell"
import { CellMapContext, useCellMap } from "./useCellMap"
import { Canvas } from "react-three-fiber"

const App = () => {
  const [size, setSize] = useState(80)
  const cellMapCtx = useCellMap(size)
  const { cellMap, time, diff, getValue } = cellMapCtx
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
        {/* <<<<<<< HEAD
        <Grid size={size} key={size}>
          {Object.values(cellMap).map(({ x, y }) => (
            <Cell x={x} y={y} size={size} key={`${size}_${y}_${x}`} />
          ))}
        </Grid> */}
        {/* <CellMapContext.Providear value={cellMapCtx}> */}
        {/* <Canvas camera={{ position: [30, 20, 50] }}> */}
        <Canvas camera={{ position: [50, 50, 100] }}>
          {Object.values(cellMap).map(({ x, y }, i) => {
            const value = getValue(x, y)
            if (!value) {
              return
            }
            return <CellMesh key={i} x={x} y={y} />
          })}
          {/* </Grid> */}
        </Canvas>
        {/* </CellMapContext.Provider> */}
      </CellMapContext.Provider>
    </div>
  )
}
type Foo = number
const z: Foo = NaN

render(<App />, document.querySelector("#container"))
