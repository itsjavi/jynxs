import {expect} from 'chai'
import {it} from 'mocha'
import {Component} from '../src/jsx-runtime'
import {createBlankPageCallback, h} from './helpers'

beforeEach(createBlankPageCallback)

describe('JSX Runtime', () => {
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
        return (
          <div>
            <span>
              {x} + {y}
            </span>
            <button onClick={onClickFn}>Sub button</button>
          </div>
        )
      }
    }

    const elem = h(<PointInfo x={10} y={20}/>, document.body)
    if (elem === null) {
      throw new Error('elem is null')
    }
    expect(elem).not.equals(null)
    expect(document.body.innerHTML).equals(
      '<div><span>10 + 20</span><button>Sub button</button></div>'
    )
  })

  it('Preserves className for HTMLElements', () => {
    const classNames = () => [
      document.body.getElementsByClassName('outerDiv'),
      document.body.getElementsByClassName('innerDiv'),
      document.body.getElementsByClassName('text-node')
    ]

    const assertClassNameExistences = (expectedAmount) =>
      classNames().forEach((classNameList) =>
        expect(classNameList.length).equals(expectedAmount)
      )

    const ExampleComponent = (_props = null) => (
      <div className="outerDiv">
        <div className="innerDiv">
          <span className="text-node">className is useful</span>
        </div>
      </div>
    )

    // Before rendering, none of the classes should exist in the DOM
    assertClassNameExistences(0)

    h(<ExampleComponent/>, document.body)

    // After rendering, all classes should exist on exactly one element each
    assertClassNameExistences(1)
  })
})
