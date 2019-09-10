export const initialArray = (size) => {
  return Array(size)
    .fill([])
    .map((v, y) => {
      return Array(size)
        .fill(0)
        .map((_, x) => ({ x, y, v: Math.random() > 0.5 ? 1 : 0 }))
    })
    .flat()
}
