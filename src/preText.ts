// const chunk = (input, size) => {
//   return input.reduce((arr, item, idx) => {
//     return idx % size === 0
//       ? [...arr, [item]]
//       : [...arr.slice(0, -1), [...arr.slice(-1)[0], item]]
//   }, [])
// }

export const cellText = (cellMap, size) => {
  const m = Object.values(cellMap).reduce((acc, { x, y, v }) => {
    if (!Array.isArray(acc[y])) {
      acc[y] = []
    }
    acc[y][x] = v
    return acc
  }, [])
  return m.map((mm) => mm.join("")).join("\n")
}
