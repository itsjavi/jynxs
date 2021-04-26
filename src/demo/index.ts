import Point from './component/Point'
import jsx from '../jsx/jsx-runtime'

const p = new Point(2, 1)
// document.body.append(p)
console.log(jsx.renderDOM(p, document.body))

export default { Point }
