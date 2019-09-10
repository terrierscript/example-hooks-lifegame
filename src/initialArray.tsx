export const initialArray = (size) => {
  return Array(size)
    .fill([])
    .map((_, y) => {
      return Array(size)
        .fill(0)
        .map((_, x) => ({
          key: `${x}_${y}`,
          x,
          y,
          v: Math.random() > 0.5 ? 1 : 0
        }))
    })
    .flat()
}
