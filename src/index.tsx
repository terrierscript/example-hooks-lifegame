import React, { useState, useEffect, useMemo } from "react"
import { render } from "react-dom"
import { Cell, Grid } from "./Cell"
import { initialArray } from "./initialArray"
import { useTimerEffect } from "./useTimerEffect"

const App = () => {
  const { time, diff } = useTimerEffect()
  const [size, setSize] = useState(30)
  const arr = useMemo(() => {
    const arr = initialArray(size)
    return arr
  }, [size])
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
      <Grid size={size} key={size}>
        {arr.map(({ x, y, v }) => (
          <Cell
            time={time}
            x={x}
            y={y}
            size={size}
            key={`${size}_${y}_${x}`}
            initial={v}
          ></Cell>
        ))}
      </Grid>
    </div>
  )
}

render(<App />, document.querySelector("#container"))
