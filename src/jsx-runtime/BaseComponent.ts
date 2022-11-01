import { NanoJSX } from "./interface"

export default class BaseComponent<P = {}> implements NanoJSX.Component {
  element: NanoJSX.ComponentDOMElement = null
  readonly props: P & NanoJSX.ComponentProps<P>

  constructor(props: P & NanoJSX.ComponentProps<P>) {
    this.props = props
  }

  render(): NanoJSX.Node {
    return null
  }
}
