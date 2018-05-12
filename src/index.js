import { h, app } from 'hyperapp'
import App from './components/App'
import * as shapes from './shapes'
import * as actions from './actions'


const state = {

  tools: {
    selected: 'selection',
  },

  stage: {
    zoom: 1,
    pan: { x: 0, y: 0 }
  },

  elements: {
    selection: [],

    tree: [
      { id: 2, type: 'Group', children: [
        { id: 3, type: 'Group', children: [
          shapes.Rectangle.create({ id: 0, x: 200, y: 300, width: 400, height: 100 }),
          shapes.Rectangle.create({ id: 1, x: 300, y: 100, width: 100, height: 150 }),
        ]}
      ]},
      { id: 4, type: 'Group', children: [
        { id: 5, type: 'Group', children: [
          shapes.Rectangle.create({ id: 6, x: 200, y: 300, width: 400, height: 100 }),
          shapes.Rectangle.create({ id: 7, x: 300, y: 100, width: 100, height: 150 }),
          shapes.Rectangle.create({ id: 8, x: 300, y: 100, width: 100, height: 150 }),
        ]}
      ]},
      shapes.Text.create({ id: 9, x: 400, y: 50, width: 125, height: 50, text: 'Salut les amis des ordinateurs' })
    ]
  }
}


app(state, actions, App, document.body)
