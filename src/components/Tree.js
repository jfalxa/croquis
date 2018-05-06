import { h } from 'hyperapp'


const Tree = ({ nodes, renderNode:Node }) => (
  <ul>
    {nodes.map(({ ...node, children }) => (
      <Node key={node.id} {...node}>
        {(children && children.length > 0) && (
          <Tree nodes={children} renderNode={Node} />
        )}
      </Node>
    ))}
  </ul>
)


export default Tree
