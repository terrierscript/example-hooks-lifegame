export const initialArray = (size) => {
  return Array(size * size)
    .fill(1)
    .map(() => (Math.random() > 0.5 ? 1 : 0))
}
