import { useState, useLayoutEffect } from "react"
const roopFn = (fn, time) => {
  // return setTimeout(fn, 1000)
  // return setTimeout(fn, time)
  // @ts-ignore
  return requestIdleCallback(fn, { timeout: time })
}
export const useTimerEffect = () => {
  const [uuid, _] = useState(Math.ceil(Math.random() * 1000))

  const [time, setTimer] = useState(new Date().getTime())
  const [diff, setDiff] = useState(0)
  const [clear, setClear] = useState(() => {
    return () => {}
  })
  useLayoutEffect(() => {
    // return
    const loop = () => {
      const clearFn = roopFn(() => {
        const f = new Date().getTime()
        setTimer((time) => {
          setDiff(f - time)
          return f
        })
        loop()
      }, 1000)
      setClear(clearFn)
    }
    loop()
    return () => {
      clear()
    }
  }, [])
  return { time, diff }
}
