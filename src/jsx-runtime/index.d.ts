declare const jsxFragment = 'jsx.Fragment'
declare type jsxDOMContainer = HTMLElement | DocumentFragment | null;
declare type jsxDOMElement = HTMLElement | DocumentFragment | Text;

declare function jsx (type: string | any, config: JSX.ElementChildrenAttribute): JSX.Element;

declare namespace jsx {
  const Fragment: string
  const TextNode: string
  const customAttributes: string[]
  const _globalThis: Window & typeof globalThis
  const setGlobalThis: (newThis: Window & typeof globalThis) => void
  const renderDOM: (renderable: ijJSX.Node, container?: jsxDOMContainer, component?: ijJSX.Component<{}> | null) => jsxDOMElement
}

declare class Component<P = {}> implements ijJSX.Component {
  element: ijJSX.ComponentDOMElement
  readonly props: P & ijJSX.ComponentProps<P>

  constructor (props: P & ijJSX.ComponentProps<P>);

  render (): ijJSX.Node;
}

export declare namespace ijJSX {
  type Key = string | number;
  type KeyValuePair = {
    [key: string]: unknown;
  };
  type Child = Element | string | number;
  type Fragment = {} | Array<Node>;
  type Node = Child | Fragment | Component | boolean | null | undefined;
  type Children = Node;
  type Props = KeyValuePair & {
    children?: Children;
    text?: string;
  };

  interface Element {
    type: string;
    props: Props;
    key: Key | null;
  }

  type ComponentDOMElement = HTMLElement | DocumentFragment | null;
  type ComponentProps<P> = P & ijJSX.Props;

  interface Component<P = {}> {
    /**
     * (Unofficial React API)
     *
     * The currently rendered DOM Element.
     *
     * Beware that this is not compatible with the React API.
     */
    element: ComponentDOMElement;
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
    interface Element extends ijJSX.Element {
    }

    interface ElementClass extends ijJSX.Component<any> {
      render (): Element;
    }

    interface ElementAttributesProperty {
      props: {};
    }

    interface ElementChildrenAttribute {
      children: ijJSX.Children;
    }

    interface IntrinsicAttributes {
      key?: ijJSX.Key;
      class?: never;
      className?: string | string[];

      [key: string]: any;
    }

    interface IntrinsicClassAttributes<ComponentClass> {
    }

    interface IntrinsicElements {
      [key: string]: IntrinsicAttributes;
    }
  }
}
declare const render: (renderable: ijJSX.Node, container?: jsxDOMContainer, component?: ijJSX.Component | null) => jsxDOMElement
export { jsx, jsx as jsxs, jsxFragment as Fragment, render, Component }
