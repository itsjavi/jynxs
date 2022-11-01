/*
 * Types and JSX configuration
 *
 * Docs:
 * https://www.typescriptlang.org/docs/handbook/jsx.html
 * https://www.reactenlightenment.com/react-jsx/5.7.html
 */

export declare namespace NanoJSX {
  type Key = string | number
  type KeyValuePair = { [key: string]: unknown }
  type Child = Element | string | number
  type Fragment = {} | Array<Node>
  type Node = Child | Fragment | Component | boolean | null | undefined
  type Children = Node
  type Props = KeyValuePair & { children?: Children; text?: string }
  type DOMContainer = HTMLElement | DocumentFragment | null
  type DOMElement = HTMLElement | DocumentFragment | Text

  interface Element {
    type: string
    props: Props
    key: Key | null
  }

  type ComponentDOMElement = HTMLElement | DocumentFragment | null
  type ComponentProps<P> = P & NanoJSX.Props

  interface Component<P = {}> {
    /**
     * (Unofficial React API)
     *
     * The currently rendered DOM Element.
     *
     * Beware that this is not compatible with the React API.
     */
    element: ComponentDOMElement

    readonly props: ComponentProps<P>

    /**
     * (Unofficial React API)
     *
     * Runs after calling `render`, but before adding the element to the DOM.
     *
     */
    onWillMount?(prevElement: ComponentDOMElement): void

    /**
     * (Unofficial React API)
     *
     * Runs after calling `render` and after adding the element to the DOM.
     */
    onDidMount?(prevElement: ComponentDOMElement): void

    render(): Node
  }
}

declare global {
  namespace JSX {
    // JSX node definition
    interface Element extends NanoJSX.Element {}

    // Component class definition
    interface ElementClass extends NanoJSX.Component<any> {
      render(): Element
    }

    // Property that will hold the HTML attributes of the Component
    interface ElementAttributesProperty {
      props: {}
    }

    // Property in 'props' that will hold the children of the Component
    interface ElementChildrenAttribute {
      children: NanoJSX.Children
    }

    // Common attributes of the standard HTML elements and JSX components
    interface IntrinsicAttributes {
      key?: NanoJSX.Key
      class?: never
      className?: string | string[]

      [key: string]: any
    }

    // Common attributes of the JSX components only
    interface IntrinsicClassAttributes<ComponentClass> {}

    // HTML elements allowed in JSX, and their attributes definitions
    interface IntrinsicElements {
      [key: string]: IntrinsicAttributes
    }
  }
}
