import { h } from 'hyperapp'
import styled from './style'


const TopbarContainer = styled('div')({
  zIndex: 1,
  border: '1px solid black'
})


const Topbar = (props) => (
  <TopbarContainer>
    <span>Salut.</span>
  </TopbarContainer>
)


export default Topbar
