import ijJSX, { ComponentProps } from './jsx-types'

const jsxFragment = 'jsx.Fragment'
const jsxTextNode = 'jsx.Text'

type jsxDOMContainer = HTMLElement | DocumentFragment | null
type jsxDOMElement = Text | HTMLElement | DocumentFragment

function jsx (type: string | any, config: JSX.ElementChildrenAttribute): JSX.Element {
  if (typeof type === 'function') {
    if (type.prototype !== undefined) {
      return new type(config)
    }
    return type(config)
  }
  const { children = [], ...props } = config;
  const childrenProps = Array().concat(children);
  return {
    type,
    key: null,
    props: {
      ...props,
      children: childrenProps.map((child: JSX.Element): JSX.Element => {
          return typeof child == 'object' ? child : {
            type: jsxTextNode,
            key: null,
            props: {
              text: child,
              children: []
            }
          }
        }
      )
    }
  }
}

jsx.Fragment = jsxFragment
jsx.TextNode = jsxTextNode
jsx.emptyFragment = <></>
jsx.customAttributes = ['children', 'className', 'key', 'props']

const isStandardAttribute = (key: string) => !jsx.customAttributes.includes(key)

export class Component<P = {}> implements ijJSX.Component {
  element: ijJSX.ComponentDOMElement = null
  readonly props: P & ComponentProps<P>

  constructor (props: P & ComponentProps<P>) {
    this.props = props
  }

  render (): ijJSX.Node {
    return null;
  }
}

jsx.renderDOM = (
  renderable: ijJSX.Node,
  container: jsxDOMContainer = null,
  component: ijJSX.Component | null = null
): jsxDOMElement => {
  const isComponent = (renderable instanceof Component)
  // @ts-ignore
  let node: JSX.Element = isComponent ? renderable.render() : renderable
  if (isComponent) {
    // @ts-ignore
    component = renderable
  }

  const doc = (container === null) ? document : container.ownerDocument;

  if (node.type === jsx.TextNode) {
    if (node.props.text === undefined) {
      node.props.text = ''
    }
    const textElem = doc.createTextNode(node.props.text)
    if (container !== null) {
      container.appendChild(textElem)
    }

    return textElem
  }

  const elem: HTMLElement | DocumentFragment = (node.type === jsx.Fragment)
    ? doc.createDocumentFragment()
    : doc.createElement(node.type)

  // @ts-ignore
  elem.jsxComponent = component

  const props = node.props
  const propKeys = Object.keys(props)

  // classes
  if (props['className'] !== undefined) {
    props['class'] = props['className']
    delete props['className']
  }
  if ((props['class'] !== undefined) && Array.isArray(props['class'])) {
    props['class'] = props['class'].join(' ')
  }

  // assign attributes
  propKeys
    .filter(isStandardAttribute)
    .forEach((name) => {
      let attrVal = props[name]
      if (component !== null && (attrVal instanceof Function)) {
        attrVal = attrVal.bind(component)
        if (attrVal instanceof Function) {
          attrVal(null)
        }
      }
      // @ts-ignore
      elem[name.toLowerCase()] = attrVal
    })

  if (Array.isArray(node.props.children)) {
    node.props.children.forEach((child: ijJSX.Node) => jsx.renderDOM(child, elem, component))
  }

  let prevElement = null

  if (isComponent && component !== null) {
    prevElement = component.element
    component.element = elem
  }

  if (isComponent && component !== null && component.onWillMount !== undefined) {
    component.onWillMount(prevElement)
  }

  if (container !== null) {
    container.appendChild(elem)
  }

  if (isComponent && component !== null && component.onDidMount !== undefined) {
    component.onDidMount(prevElement)
  }

  return elem
}

export default jsx
export { jsx, jsx as jsxs, jsxFragment as Fragment }
