declare namespace JSX {
  type HTMLAttributes = Record<string, JSXNode | undefined> & JSXChildren

  interface IntrinsicElements {
    [elemName: string]: any
  }

  type SyncElement = {
    type: string | Function
    props: {
      children?: Element | Element[]
      [key: string]: any
    }
  }

  type Element = SyncElement | Promise<SyncElement>

  type ElementType = string | ((props: any) => Element | Promise<Element>)
}
