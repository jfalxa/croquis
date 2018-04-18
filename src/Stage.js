import { h } from 'hyperapp'
import styled from './styled'
import { svgPath } from './utils/svg'


const StageSvg = styled('svg')({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%'
})



const Element = ({ id, type, path, closed, ...props }) => {
  switch(type) {
    case 'rect':
      return <rect {...props} />
    default:
      return (
        <path
          d={svgPath(path, closed)}
          fill="none"
          stroke="black"
          stroke-width="3"
          {...props}
        />
      )

  }
}


const Stage = (props, children) => (state, actions) => (
  <StageSvg>
    <g>
      {state.elements.map(element => (
        <Element { ...element } />
      ))}
    </g>

    {children}
  </StageSvg>
)


export default Stage
