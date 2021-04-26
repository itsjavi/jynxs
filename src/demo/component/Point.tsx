import { Component } from '../../jsx/jsx-runtime'

class PointInfo extends Component {
  constructor (public props: { x: number, y: number }) {
    super(props);
  }

  onClickFn (e: MouseEvent) {
    console.log(this, e)
  }

  render () {
    const { x, y } = this.props
    return (<div>{x} + {y}
      <button onClick={this.onClickFn}>Sub button</button>
    </div>)
  }
}

export default class Point extends Component {
  private ratio: number

  constructor (public x: number, public y: number) {
    super({ x, y })
    this.ratio = y / x
    this.onClickFn.bind(this)
  }

  onClickFn (e: MouseEvent) {
    console.log(this, e)
  }

  render () {
    return <div id="kk" className={['xx', 'yx']}>
      <p>
        Lorem
        <b>
          ipsum
          <i>dolor</i>
        </b>
      </p>
      <div>sit</div>
      <hr/>
      <>
        amet
      </>
      <PointInfo x={this.x} y={this.y}/>
      <button onClick={this.onClickFn}>Click me</button>
    </div>
  }
}
