export const svgPath = ([first, ...rest], closed) => {
  const lines = rest.map(([x, y]) => `L${x},${y}`)
    .join(' ')

  return `M${first[0]},${first[1]} ${lines} ${closed ? 'Z' : ''}`
}



