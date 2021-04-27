// Docs: https://www.typescriptlang.org/docs/handbook/jsx.html
// Refs: https://www.reactenlightenment.com/react-jsx/5.7.html

export default ijJSX;

declare namespace ijJSX {
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

    //export type LibraryManagedAttributes<C, P> = P & ijJSX.ClassManagedAttributes<C, P>;

    // HTML elements allowed in JSX, and their attributes definitions
    interface IntrinsicElements {
      [key: string]: IntrinsicAttributes
    }
  }
}
