import { h } from 'hyperapp'
import RectangleTool from './RectangleTool'
import SelectionTool from './SelectionTool'


const Tools = () => (state, actions) => {
  switch (state.selectedTool) {
    case 'rectangle':
      return <RectangleTool />

    case 'selection':
    default:
      return <SelectionTool />
  }
}


export default Tools
