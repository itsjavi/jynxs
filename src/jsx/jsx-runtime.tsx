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
  const childrenProps = Array<JSX.Element>().concat(children);
  return {
    type,
    props: {
      ...props,
      children: childrenProps.map((child: JSX.Element): JSX.Element => {
          return typeof child == 'object' ? child : {
            type: jsxTextNode,
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
jsx.customAttributes = ['children', 'className', 'key', 'props', 'dangerouslySetInnerHTML']

const isStandardAttribute = (key: string) => !jsx.customAttributes.includes(key)

jsx.Component = class implements JSX.Component {
  public _dom: HTMLElement | DocumentFragment | null = null

  render () {
    return jsx.emptyFragment
  }

  componentDidMount (element: JSX.ComponentDOM, props: JSX.ElementChildrenAttribute, propKeys: string[]): void {
    console.log('component did mount', element)
  }

  componentWillMount (element: JSX.ComponentDOM, props: JSX.ElementChildrenAttribute, propKeys: string[]): void {
    console.log('component will mount', element)
  }

}

jsx.renderDOM = (
  renderable: JSX.Element | JSX.Component,
  container: jsxDOMContainer = null,
  component: JSX.Component | null = null
): jsxDOMElement => {
  const isComponent = (renderable instanceof jsx.Component)
  // @ts-ignore
  let node: JSX.Element = isComponent ? renderable.render() : renderable
  if (isComponent) {
    // @ts-ignore
    component = renderable
  }

  console.log(renderable, isComponent, container, component)

  const doc = (container === null) ? document : container.ownerDocument;

  if (node.type === jsx.TextNode) {
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
  elem.dataset.component = component

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
      if (component !== null && (typeof attrVal === 'function')) {
        attrVal = attrVal.bind(component)
        attrVal(null)
      }
      // @ts-ignore
      elem[name.toLowerCase()] = attrVal
    })

  if (Array.isArray(node.props.children)) {
    node.props.children.forEach((child: JSX.Element) => jsx.renderDOM(child, elem, component))
  }

  if (isComponent && component !== null) {
    component._dom = elem
  }

  if (isComponent && component !== null && component.componentWillMount !== undefined) {
    component.componentWillMount(elem, props, propKeys)
  }

  if (container !== null) {
    container.appendChild(elem)
  }

  if (isComponent && component !== null && component.componentDidMount !== undefined) {
    component.componentDidMount(elem, props, propKeys)
  }

  return elem
}

export default jsx
export { jsx, jsx as jsxs, jsxFragment as Fragment }
