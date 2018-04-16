import { h } from 'hyperapp'
import styled from './styled'


const Root = styled('div')({

  flexDirection: 'column',
  height: '100%',

  'null, html, body': {
    width: '100%',
    height: '100%',
    margin: 0,
    padding: 0
  },

  'null, body *': {
    display: 'flex',
    boxSizing: 'border-box'
  }
})


export default Root