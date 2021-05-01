import {JSDOM} from 'jsdom'
import {jsx, render} from '../dist/jsx-runtime.module'

const helpers = () => {
  const dom = new JSDOM('<html lang="en"><body></body></html>')
  const document = dom.window.document
  const window = document.defaultView

// noinspection JSConstantReassignment
  global.document = document
// @ts-ignore
// noinspection JSConstantReassignment
  global.window = window

  if (global.window === null) {
    throw new Error('global.window is null')
  }

  return {dom, document, window}
}

const createBlankPageCallback = () => {
  const page = helpers()
  if (page.window === null) {
    throw new Error('page.window is null')
  }
  jsx.setGlobalThis(page.window)
}

const h = (node, container = null) => {
  return render(node, container)
}

export {helpers, createBlankPageCallback, h}
