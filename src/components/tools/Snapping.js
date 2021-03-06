import { h } from 'hyperapp'
import { unproject } from '../../utils/geometry'
import { findSiblings } from '../../utils/tree'
import { bbox } from '../../utils/elements'
import { getSelectionElements } from '../../utils/helpers'
import { findAligned, listChunks } from '../../utils/snapping'


const Snapping = ({ elements, selection, stage: { zoom, pan } }) => {
  const selectionElements = getSelectionElements({ tree: elements, selection })

  const siblings = findSiblings(elements, { id: selection[0] })
    .filter(sibling => !selection.includes(sibling.id))

  const siblingBoxes = siblings.map(sibling => bbox(sibling))
    .map(box => unproject(box, zoom, pan))

  const alignedEdges = findAligned(siblings, selectionElements, 0, true)
    .map(({ edge, aligned }) => ({
      edge: edge.map(point => unproject(point, zoom, pan)),
      aligned: aligned.map(alignedEdge => alignedEdge.map(point => unproject(point, zoom, pan)))
    }))

  return (
    <g>
      {siblingBoxes.map(box => (
        <rect
          {...box}
          fill="none"
          stroke="cyan"
        />
      ))}

      {alignedEdges.map(({ edge, aligned }) => (
        <g stroke-width={3}>
          <line
            x1={edge[0].x} y1={edge[0].y}
            x2={edge[1].x} y2={edge[1].y}
            stroke="cyan"
          />

          {aligned.map(alignedEdge => [
            <line
              x1={alignedEdge[0].x} y1={alignedEdge[0].y}
              x2={alignedEdge[1].x} y2={alignedEdge[1].y}
              stroke="cyan"
            />,

            listChunks(edge, alignedEdge).map(([p1, p2]) => (
              <line
                x1={p1.x} y1={p1.y}
                x2={p2.x} y2={p2.y}
                stroke="orange"
              />
            ))
          ])}
        </g>
      ))}
    </g>
  )
}


export default Snapping
