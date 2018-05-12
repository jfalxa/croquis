import flatMap from 'lodash/flatMap'


function getRuler() {
  return document.getElementById('text-ruler')
}

export function fit(text, width, ruler) {
  let first = 0
  let length = -1
  let lines = []

  ruler.innerHTML = text

  text.split(' ').forEach((word, i, words) => {
    const potentialLength = length + 1 + word.length

    // if the length to the word end is too big, it means that until the word
    // before, we have a line
    if (length > 0 && ruler.getSubStringLength(first, potentialLength) > width) {
      lines.push(text.slice(first, first+length))
      first = first + length + 1 // +1 to take into account spaces that were removed by split
      length = word.length
    } else {
      length = potentialLength
    }
  })

  // don't forgot to put what's left of the string in the last line
  lines.push(text.slice(first))

  return lines
}

export function getTextLines(text, font={}, box) {
  const ruler = getRuler()

  if (!ruler) {
    return [text]
  }

  font.opacity = 0
  Object.keys(font).forEach(prop => ruler.setAttributeNS(null, prop, font[prop]))

  return flatMap(text.split(`\n`), line => fit(line, box.width, ruler))
}

