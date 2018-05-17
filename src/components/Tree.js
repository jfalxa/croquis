import { h } from 'hyperapp'


const Tree = ({ nodes, depth=0, renderNode:Node }) => (
  <ul>
    {nodes.map(node => (
      <Node
        key={node.id}
        depth={depth}
        {...node}
      >
        {(node.children && node.children.length > 0) && (
          <Tree
            nodes={node.children}
            depth={depth+1}
            renderNode={Node}
          />
        )}
      </Node>
    ))}
  </ul>
)


export default Tree
