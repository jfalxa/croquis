import { h } from 'hyperapp'
import { findCommonSiblings } from '../../utils/tree'
import { getSelectionElements } from '../../utils/helpers'
import { findAligned, listChunks } from '../../utils/snapping'


const Snapping = ({ elements, selection }) => {
  const selectionElements = getSelectionElements({ tree: elements, selection })
  const siblings = findCommonSiblings(elements, selectionElements)
    .filter(sibling => !selection.includes(sibling.id))

  const aligned = findAligned(siblings, selectionElements)

  return (
    <g>
      {aligned.map(([boxEdge, siblingEdge]) => (
        <g stroke-width={3}>
          <line
            x1={boxEdge[0].x} y1={boxEdge[0].y}
            x2={boxEdge[1].x} y2={boxEdge[1].y}
            stroke="cyan"
          />

          <line
            x1={siblingEdge[0].x} y1={siblingEdge[0].y}
            x2={siblingEdge[1].x} y2={siblingEdge[1].y}
            stroke="cyan"
          />

          {listChunks(boxEdge, siblingEdge).map(([p1, p2]) => (
            <line
              x1={p1.x} y1={p1.y}
              x2={p2.x} y2={p2.y}
              stroke="orange"
            />
          ))}
        </g>
      ))}
    </g>
  )
}


export default Snapping
