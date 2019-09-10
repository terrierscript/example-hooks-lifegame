import { useState, useEffect, useCallback, createContext } from "react"
import { initialArray } from "./initialArray"
import { useTimerEffect } from "./useTimerEffect"
import module from "../rust-life/Cargo.toml"

export const useCellMap = (size) => {
  const { time, diff } = useTimerEffect()
  const [cellMap, setMap] = useState(() => {
    const i = initialArray(size)

    return i
  })
  useEffect(() => {
    setMap(initialArray(size))
  }, [size])
  const getValue = useCallback(
    (i) => {
      return cellMap[i]
      // const idx = y * size + x
      // // if (idx > cellMap.length) {
      // //   throw new Error(`${x}_${y} ${cellMap.length}`)
      // // }
      // return !!cellMap[idx]
    },
    [cellMap]
  )
  const getXY = (i) => {
    const d = [i % size, Math.floor(i / size)]
    return d
  }
  // const memo = useMemo(() => Object.values(cellMap), [cellMap])
  useEffect(() => {
    const newMap = module.main(size, cellMap)
    // @ts-ignore
    setMap(Array.from(newMap))
  }, [time])
  return { cellMap, getValue, time, diff, getXY }
}

export const CellMapContext = createContext<ReturnType<typeof useCellMap>>(
  // @ts-ignore
  {}
)
