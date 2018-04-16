import { h, app } from 'hyperapp'
import pico from 'picostyle'

const styled = pico(h)


const Root = styled('div')({
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


const state = {}

const actions = {}

const view = (state, actions) => (
  <Root>
    <h1>Hello.</h1>
  </Root>
)


app(state, actions, view, document.body)
