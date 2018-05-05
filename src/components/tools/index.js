import { h } from 'hyperapp'
import RectangleTool from './RectangleTool'
import SelectionTool from './SelectionTool'


const Tools = (props) => {
  switch (props.selected) {
    case 'rectangle':
      return <RectangleTool />

    case 'selection':
    default:
      return <SelectionTool />
  }
}


export default Tools
