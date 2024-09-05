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
}

// ----------------------------------------------------------------------------
// Global state
let currentComponent: CurrentComponent | null = null

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
  container: HTMLElement,
  replaceNode?: HTMLElement,
): Promise<void> {
  if (jsxElement instanceof Promise) {
    const awaitedElement = await jsxElement
    return renderJSX(awaitedElement, container, replaceNode)
  }

  const { type, props, children, ref, fallback } = jsxElement

  if (typeof type === 'function') {
    const componentInstance: CurrentComponent = {
      effects: [],
      effectIndex: 0,
      states: [],
      stateIndex: 0,
      element: jsxElement,
    }
    currentComponent = componentInstance

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
      await renderJSX(result, container, replaceNode)
    }

    // Run effects after rendering
    componentInstance.effects.forEach(({ effect }) => {
      const cleanup = effect()
      if (typeof cleanup === 'function') {
        cleanupQueue.push(cleanup)
      }
    })

    currentComponent = null
    return
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
    container.replaceChild(domElement, replaceNode)
  } else {
    container.appendChild(domElement)
  }
}

/**
 * useState hook to manage component state.
 */
export function useState<T>(initialValue: T): [T, StateSetter<T>] {
  if (!currentComponent) {
    throw new Error('useState must be called inside a component')
  }

  console.log('useState-currentComponent', currentComponent.element, currentComponent)

  const componentStateIndex = currentComponent.stateIndex++

  if (!currentComponent.states[componentStateIndex]) {
    currentComponent.states[componentStateIndex] = initialValue
  }

  const setState: StateSetter<T> = (newValue) => {
    if (!currentComponent) {
      throw new Error('useState must be called inside a component')
    }
    const value =
      typeof newValue === 'function'
        ? (newValue as (prevState: T) => T)(currentComponent.states[componentStateIndex])
        : newValue
    currentComponent.states[componentStateIndex] = value
    renderJSX(currentComponent.element, document.getElementById('app')!) // Re-render
  }

  return [currentComponent.states[componentStateIndex], setState]
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
