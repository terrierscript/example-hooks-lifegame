import { useState } from "react"
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
export const useCell = (initial) => {
  const [value, setValue] = useState(initial)
  const update = (num) => {
    setValue(next(value, num) ? 1 : 0)
  }
  return { value, update }
}
