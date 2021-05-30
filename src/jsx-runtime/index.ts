const jsxFragment = 'jsx.Fragment'
const jsxTextNode = 'jsx.Text'

type jsxDOMContainer = HTMLElement | DocumentFragment | null
type jsxDOMElement = HTMLElement | DocumentFragment | Text

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
jsx.customAttributes = ['children', 'key', 'props']

const isStandardAttribute = (key: string) => !jsx.customAttributes.includes(key)

class Component<P = {}> implements ijJSX.Component {
  element: ijJSX.ComponentDOMElement = null
  readonly props: P & ijJSX.ComponentProps<P>

  constructor (props: P & ijJSX.ComponentProps<P>) {
    this.props = props
  }

  render (): ijJSX.Node {
    return null;
  }
}

if (typeof window !== "undefined") {
  jsx._globalThis = window
}

jsx.setGlobalThis = (newThis: Window & typeof globalThis) => {
  jsx._globalThis = newThis
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

  const doc = (container === null) ? jsx._globalThis.document : container.ownerDocument;

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

  if ((props['className'] !== undefined) && Array.isArray(props['className'])) {
    props['className'] = props['className'].join(' ')
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
      elem[name] = attrVal
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

/*
 * Types and JSX configuration
 *
 * Docs:
 * https://www.typescriptlang.org/docs/handbook/jsx.html
 * https://www.reactenlightenment.com/react-jsx/5.7.html
 */

export declare namespace ijJSX {
  type Key = string | number;
  type KeyValuePair = { [key: string]: unknown }
  type Child = Element | string | number;
  type Fragment = {} | Array<Node>;
  type Node = Child | Fragment | Component | boolean | null | undefined;
  type Children = Node
  type Props = KeyValuePair & { children?: Children, text?: string };

  interface Element {
    type: string;
    props: Props;
    key: Key | null;
  }

  type ComponentDOMElement = HTMLElement | DocumentFragment | null
  type ComponentProps<P> = P & ijJSX.Props

  interface Component<P = {}> {
    /**
     * (Unofficial React API)
     *
     * The currently rendered DOM Element.
     *
     * Beware that this is not compatible with the React API.
     */
    element: ComponentDOMElement

    readonly props: ComponentProps<P>;

    /**
     * (Unofficial React API)
     *
     * Runs after calling `render`, but before adding the element to the DOM.
     *
     */
    onWillMount? (prevElement: ComponentDOMElement): void;

    /**
     * (Unofficial React API)
     *
     * Runs after calling `render` and after adding the element to the DOM.
     */
    onDidMount? (prevElement: ComponentDOMElement): void;

    render (): Node;
  }
}

declare global {
  namespace JSX {
    // JSX node definition
    interface Element extends ijJSX.Element {
    }

    // Component class definition
    interface ElementClass extends ijJSX.Component<any> {
      render (): Element;
    }

    // Property that will hold the HTML attributes of the Component
    interface ElementAttributesProperty {
      props: {};
    }

    // Property in 'props' that will hold the children of the Component
    interface ElementChildrenAttribute {
      children: ijJSX.Children;
    }

    // Common attributes of the standard HTML elements and JSX components
    interface IntrinsicAttributes {
      key?: ijJSX.Key
      class?: never
      className?: string | string[]

      [key: string]: any
    }

    // Common attributes of the JSX components only
    interface IntrinsicClassAttributes<ComponentClass> {

    }

    // HTML elements allowed in JSX, and their attributes definitions
    interface IntrinsicElements {
      [key: string]: IntrinsicAttributes
    }
  }
}

const render = jsx.renderDOM

export { jsx, jsx as jsxs, jsxFragment as Fragment, render, Component }
