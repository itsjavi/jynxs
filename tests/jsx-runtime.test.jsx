import {expect} from 'chai'
import {it} from 'mocha'
import {Component} from '../src/jsx-runtime'
import {createBlankPageCallback, h} from './helpers'

beforeEach(createBlankPageCallback)

describe('suite name', () => {
  it('div is NOT inserted in the dom', () => {
    h(<div>test</div>)
    expect(document.body.innerHTML).equals('')
  })
  it('div is inserted in the dom', () => {
    h(<div>test</div>, document.body)
    expect(document.body.innerHTML).equals('<div>test</div>')
  })
  it('component class is inserted in the dom', () => {
    const onClickFn = (e) => {
      console.log('button clicked', this, e)
    }

    class PointInfo extends Component {
      constructor(props) {
        super(props)
      }

      render() {
        const {x, y} = this.props
        return (<div>
          <span>{x} + {y}</span>
          <button onClick={onClickFn}>Sub button</button>
        </div>)
      }
    }

    const elem = h(<PointInfo x={10} y={20}/>, document.body)
    if (elem === null) {
      throw new Error('elem is null')
    }
    expect(elem).not.equals(null)
    expect(document.body.innerHTML).equals('<div><span>10 + 20</span><button>Sub button</button></div>')
//    expect(elem.childNodes[1].onclick).not(null) // .not(undefined)
  })
})
