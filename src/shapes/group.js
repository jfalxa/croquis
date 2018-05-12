import { h } from 'hyperapp'


const Group = ({ style }, children) => (
  <g {...style}>{children}</g>
)

Group.type = 'Group'


export default Group
