import { createContext, useState, useCallback, useMemo, useEffect } from "react"
import { useTimerEffect } from "./useTimerEffect"
import { initialArray } from "./initialArray"

const adjCells = (x, y, size) =>
  [x, x + 1, x - 1]
    .map((xx) => [y, y + 1, y - 1].map((yy) => [xx, yy]))
    .flat()
    .filter(([xx, yy]) => !(xx === x && yy === y)) // && validCell(xx, yy, size))

const next = (val, num) => {
  if (val) {
    if (num < 2) return false
    if (3 < num) return false
    return true
  } else {
    if (num === 3) return true
    return false
  }
}

export const useCellMap = (size) => {
  const { time, diff } = useTimerEffect()

  const initCells = () => {
    const arr = initialArray(size)
    return Object.fromEntries(
      arr.map((a) => {
        return [a.key, { x: a.x, y: a.y, v: a.v }]
      })
    )
  }
  const [cellMap, setMap] = useState(() => {
    return initCells()
  })
  useEffect(() => {
    setMap(initCells())
  }, [size])

  const updateValue = useCallback(
    ({ x, y, v }) => {
      setMap((oldMap) => {
        return {
          ...oldMap,
          [`${x}_${y}`]: { x, y, v }
        }
      })
    },
    [setMap]
  )
  const getValue = useCallback(
    (x, y) => {
      return (cellMap[`${x}_${y}`] || {}).v
    },
    [cellMap]
  )
  const memo = useMemo(() => Object.values(cellMap), [cellMap])
  useEffect(() => {
    setMap(
      Object.fromEntries(
        memo.map(({ x, y, v }) => {
          const adjCellSize = adjCells(x, y, size)
          const vs = adjCellSize.map(([x, y]) => getValue(x, y))
          const num = vs.reduce((acc: number, curr) => acc + curr, 0)
          const nextValue = next(v, num) ? 1 : 0
          return [`${x}_${y}`, { x, y, v: nextValue }]
        })
      )
    )
  }, [time])
  return { cellMap, updateValue, getValue, time, diff }
}

export const CellMapContext = createContext<ReturnType<typeof useCellMap>>({
  cellMap: {},
  updateValue: () => {},
  getValue: (x: number, y: number) => {
    return 0
  },
  time: 0,
  diff: 0
})
