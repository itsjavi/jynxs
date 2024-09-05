type Props = { [key: string]: any }
type JSXRef =
  | {
      current: HTMLElement | null
    }
  | ((element: HTMLElement) => void)

// type JSXNode = string | number | null | undefined | JSXElement | JSXNode[];

type JSXElement = {
  type: string | Function
  props: Props
  children?: any | any[]
  key?: string | number | null
  ref?: JSXRef
  fallback?: JSXElement
}

type Effect = () => undefined | (() => void)
type StateSetter<T> = (value: T | ((prevState: T) => T)) => void
type CurrentComponent = {
  effects: Array<{ effect: Effect; deps: any[] }>
  effectIndex: number
  states: any[]
  stateIndex: number
  element: JSXElement
  setters: Array<StateSetter<any>>
  domElement: HTMLElement | null
}

// ----------------------------------------------------------------------------
// Global state
let currentComponent: CurrentComponent | null = null // component being rendered
let componentStates: Map<CurrentComponent, any[]> = new Map() // state of the components
let componentSetters: Map<CurrentComponent, StateSetter<any>[]> = new Map() // setters of the components
let componentElements: Map<CurrentComponent, HTMLElement> = new Map() // elements of the components

const effectQueue: Array<() => void> = []
const cleanupQueue: Array<() => void> = []
// ----------------------------------------------------------------------------

/**
 * Creates a JSX element from a type, props, and children.
 */
export function createElement(
  type: string | Function,
  props: Props,
  key: string | number | null = null,
  // ...children: any[]
): JSXElement {
  const { ref = null, fallback = null, children = null, ...restProps } = props || {}
  return { type, fallback, children, key, ref, props: { ...restProps } }
}

/**
 * Renders JSX elements to the DOM.
 */
export async function renderJSX(
  jsxElement: JSXElement | Promise<JSXElement>,
  container: HTMLElement | ParentNode,
  replaceNode?: HTMLElement,
  componentMeta?: CurrentComponent,
): Promise<HTMLElement> {
  if (jsxElement instanceof Promise) {
    const awaitedElement = await jsxElement
    return renderJSX(awaitedElement, container, replaceNode)
  }

  const { type, props, children, ref, fallback } = jsxElement

  if (typeof type === 'function') {
    const componentInstance: CurrentComponent = componentMeta ?? {
      effects: [],
      effectIndex: 0,
      states: [],
      stateIndex: 0,
      element: jsxElement,
      setters: [],
      domElement: null,
    }
    currentComponent = componentInstance

    if (componentStates.has(componentInstance)) {
      console.log('clearing stateIndex', componentInstance)
      componentInstance.stateIndex = 0
    }

    const result = type(props)

    if (result instanceof Promise) {
      let fallbackNode: HTMLElement | undefined
      if (fallback) {
        fallbackNode = document.createElement('div')
        renderJSX(fallback, fallbackNode) // Render fallback synchronously
        if (replaceNode) {
          container.replaceChild(fallbackNode, replaceNode)
        } else {
          container.appendChild(fallbackNode)
        }
      }

      result.then((resolvedJSXElement) => {
        renderJSX(resolvedJSXElement, container, fallbackNode || replaceNode)
      })
    } else {
      const renderedElement = await renderJSX(result, container, replaceNode)
      componentInstance.domElement = renderedElement
      componentElements.set(componentInstance, renderedElement)
    }

    // Run effects after rendering
    componentInstance.effects.forEach(({ effect }) => {
      const cleanup = effect()
      if (typeof cleanup === 'function') {
        cleanupQueue.push(cleanup)
      }
    })

    currentComponent = null
    return componentInstance.domElement!
  }

  const domElement: HTMLElement = document.createElement(type)

  // Apply props (like attributes)
  Object.entries(props).forEach(([key, value]) => {
    if (key.startsWith('on') && typeof value === 'function') {
      domElement.addEventListener(key.toLowerCase().substring(2), value)
    } else if (key !== 'fallback' && key !== 'ref') {
      domElement.setAttribute(key, value)
    }
  })

  // Set ref to the DOM element if ref is provided
  if (typeof ref === 'function') {
    ref(domElement)
  } else if (ref && typeof ref === 'object') {
    ;(ref as { current: HTMLElement }).current = domElement
  }

  const isFalsyChildren = children === null || children === undefined || children === false
  const safeChildren = Array.isArray(children) ? children : isFalsyChildren ? [] : [children]

  // Render children
  for (const child of safeChildren) {
    if (typeof child === 'object' && child !== null) {
      await renderJSX(child, domElement)
    } else {
      domElement.appendChild(document.createTextNode(String(child)))
    }
  }

  if (replaceNode) {
    // console.log('replaceChild', { node: domElement, child: replaceNode, container: container })
    container.replaceChild(domElement, replaceNode)
  } else {
    container.appendChild(domElement)
  }

  return domElement
}

async function updateComponent(component: CurrentComponent) {
  const { element, domElement } = component
  if (!domElement) {
    console.log('no domElement')
    return
  }

  const parentNode = domElement.parentNode
  if (!parentNode) {
    console.log('no parentNode', domElement)
    return
  }
  console.log('!HAS parentNode', parentNode)

  currentComponent = component
  component.stateIndex = 0
  component.effectIndex = 0

  const result = typeof element.type === 'function' ? element.type(element.props) : element.type
  component.domElement = await renderJSX(result, parentNode, domElement)

  currentComponent = null

  // Run effects after updating
  console.log('component.effects', component.effects.length)
  component.effects.forEach(({ effect }) => {
    const cleanupEffect = effect()
    if (typeof cleanupEffect === 'function') {
      cleanupQueue.push(cleanupEffect)
    }
  })

  cleanup()
}

/**
 * useState hook to manage component state.
 */
/**
 * useState hook to manage component state.
 */
export function useState<T>(initialValue: T): [T, StateSetter<T>] {
  // Ensure useState is called within a component
  if (!currentComponent) {
    throw new Error('useState must be called inside a component')
  }

  // Get the current state index for this component
  const componentStateIndex = currentComponent.stateIndex++
  console.log('componentStateIndex', componentStateIndex)

  // Initialize state arrays for the component if they don't exist
  if (!componentStates.has(currentComponent)) {
    componentStates.set(currentComponent, [])
    componentSetters.set(currentComponent, [])
  }

  // Get the state and setter arrays for the current component
  const states = componentStates.get(currentComponent)!
  const setters = componentSetters.get(currentComponent)!

  // If this is a new state, initialize it with the provided value
  if (componentStateIndex === states.length) {
    states.push(initialValue)
  }

  // Store a reference to the current component
  const comp = currentComponent

  // Create a setter function for this state if it doesn't exist
  if (componentStateIndex === setters.length || !setters[componentStateIndex]) {
    const setState: StateSetter<T> = (newValue) => {
      const currentStates = componentStates.get(comp)!
      // Handle both direct values and updater functions
      const value =
        typeof newValue === 'function'
          ? (newValue as (prevState: T) => T)(currentStates[componentStateIndex])
          : newValue

      // Update the state value
      currentStates[componentStateIndex] = value
      // Trigger a re-render of the component
      updateComponent(comp)

      console.log('value', value, { componentStateIndex })
      console.log('states.length', states.length)
      console.log('setters.length', setters.length)
    }
    // Add the new setter to the setters array
    setters.push(setState)
  }

  // Return the current state value and its setter function
  return [states[componentStateIndex], setters[componentStateIndex]]
}

/**
 * useEffect hook to handle side effects and cleanups.
 */
export function useEffect(effect: Effect, deps: any[] | undefined = undefined) {
  if (!currentComponent) {
    throw new Error('useEffect must be called inside a component')
  }

  const componentEffectIndex = currentComponent.effectIndex++

  if (!currentComponent.effects[componentEffectIndex]) {
    currentComponent.effects[componentEffectIndex] = { effect, deps: deps || [] }
    effectQueue.push(() => {
      const cleanup = effect()
      if (typeof cleanup === 'function') {
        cleanupQueue.push(cleanup)
      }
    })
  } else {
    const prevDeps = currentComponent.effects[componentEffectIndex].deps
    const hasChanged = !deps || prevDeps.some((dep: any, i: any) => dep !== deps[i])
    if (hasChanged) {
      const cleanup = effect()
      if (typeof cleanup === 'function') {
        cleanupQueue.push(cleanup)
      }
      currentComponent.effects[componentEffectIndex] = { effect, deps: deps || [] }
    }
  }
}

/**
 * Cleanup function for useEffect hooks.
 */
export function cleanup() {
  while (cleanupQueue.length) {
    const cleanupEffect = cleanupQueue.shift()
    cleanupEffect && cleanupEffect()
  }
}

export const jsx = createElement
export const jsxs = createElement
export const jsxDEV = createElement
export const Fragment = 'Fragment'
