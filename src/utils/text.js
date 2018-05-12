import flatMap from 'lodash/flatMap'


function getRuler() {
  return document.getElementById('text-ruler')
}

export function fit(text, width, ruler) {
  let first = 0
  let last = 0
  let lines = []

  ruler.innerHTML = text

  text.split(' ').forEach((word, i, words) => {
    const wordEnd = last + word.length

    // if the length to the word end is too big, it means that until the word
    // before, we have a line
    if (first < last && ruler.getSubStringLength(first, wordEnd) > width) {
      lines.push(text.slice(first, last-1))
      first = last
    }

    // always add what's left of the string as the last line
    if (i === words.length-1) {
      lines.push(text.slice(first, wordEnd))
    }

    last = wordEnd + 1 // +1 for the space that is removed by the split earlier
  })

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

