import BaseComponent from "./BaseComponent"
import { NanoJSX } from "./interface"

const JSX_FRAGMENT = "jsx.Fragment"
const JSX_TEXT_NODE = "jsx.Text"

const jsx = (type: string | any, config: JSX.ElementChildrenAttribute): JSX.Element => {
  if (typeof type === "function") {
    if (type.prototype !== undefined) {
      return new type(config)
    }
    return type(config)
  }

  const { children = [], ...props } = config
  const childrenProps = Array().concat(children)

  return {
    type,
    key: null,
    props: {
      ...props,
      children: childrenProps.map((child: JSX.Element): JSX.Element => {
        return typeof child == "object"
          ? child
          : {
              type: JSX_TEXT_NODE,
              key: null,
              props: {
                text: child,
                children: [],
              },
            }
      }),
    },
  }
}

jsx.Fragment = JSX_FRAGMENT
jsx.TextNode = JSX_TEXT_NODE
jsx.customAttributes = ["children", "key", "props"]
jsx._globalThis = null

jsx.setGlobalThis = (newThis: Window & typeof globalThis) => {
  jsx._globalThis = newThis
}

if (typeof window !== "undefined") {
  jsx._globalThis = window
}

const standardAttributeFilter = (key: string) => !jsx.customAttributes.includes(key)

jsx.renderDOM = (
  renderable: NanoJSX.Node,
  container: NanoJSX.DOMContainer = null,
  component: NanoJSX.Component | null = null
): NanoJSX.DOMElement => {
  let comp = component
  const isBaseComponent = renderable instanceof BaseComponent
  // @ts-ignore
  let node: JSX.Element = isBaseComponent ? renderable.render() : renderable
  if (isBaseComponent) {
    comp = renderable
  }

  const doc = container === null ? jsx._globalThis?.document : container.ownerDocument

  if (!doc) {
    throw new Error("Not in a HTML Document context.")
  }

  if (node.type === jsx.TextNode) {
    if (node.props.text === undefined) {
      node.props.text = ""
    }
    const textElem = doc.createTextNode(node.props.text)
    if (container !== null) {
      container.appendChild(textElem)
    }

    return textElem
  }

  const elem: HTMLElement | DocumentFragment =
    node.type === jsx.Fragment
      ? doc.createDocumentFragment()
      : doc.createElement(node.type)

  // @ts-ignore
  elem.jsxComponent = comp

  const props = node.props
  const propKeys = Object.keys(props)

  if (props["className"] !== undefined && Array.isArray(props["className"])) {
    props["className"] = props["className"].join(" ")
  }

  // assign attributes
  propKeys.filter(standardAttributeFilter).forEach((name) => {
    let attrVal = props[name]
    if (comp !== null && attrVal instanceof Function) {
      attrVal = attrVal.bind(comp)
      if (attrVal instanceof Function) {
        attrVal(null)
      }
    }
    // @ts-ignore
    elem[name] = attrVal

    // @ts-ignore
    // quick-fix to support lowercase HTML attributes
    elem[name.toLowerCase()] = attrVal
  })

  if (Array.isArray(node.props.children)) {
    node.props.children.forEach((child: NanoJSX.Node) => jsx.renderDOM(child, elem, comp))
  }

  let prevElement = null

  if (isBaseComponent && comp !== null) {
    prevElement = comp.element
    comp.element = elem
  }

  if (isBaseComponent && comp !== null && comp.onWillMount !== undefined) {
    comp.onWillMount(prevElement)
  }

  if (container !== null) {
    container.appendChild(elem)
  }

  if (isBaseComponent && comp !== null && comp.onDidMount !== undefined) {
    comp.onDidMount(prevElement)
  }

  return elem
}

export default jsx
