import { useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react'

const LONG_PRESS_DELAY = 500
const LONG_PRESS_INTERVAL = 85

export const useLongPress = (callback, delay = LONG_PRESS_DELAY, interval = LONG_PRESS_INTERVAL) => {
  const [isPressed, setPressed] = useState(false)

  useEffect(() => {
    let timerId
    let intervalId

    if (isPressed) {
      timerId = setTimeout(() => {
        callback()
        intervalId = setInterval(() => {
          callback()
        }, interval)
      }, delay)
    } else {
      clearTimeout(timerId)
      clearInterval(intervalId)
    }

    return () => {
      clearTimeout(timerId)
      clearInterval(intervalId)
    }
  }, [isPressed])

  const start = useCallback(() => {
    setPressed(true)
  }, [])
  const stop = useCallback(() => {
    setPressed(false)
  }, [])

  return {
    onMouseDown: start,
    onMouseUp: stop,
    onMouseLeave: stop,
    onTouchStart: start,
    onTouchEnd: stop
  }
}

// Used to catch outside clicks when tooltips or dropdowns are open
export const useOutsideClick = (callback, { useParentNode = false } = {}) => {
  const parentRef = useRef(null)
  const childRef = useRef(null)
  const handleClick = useCallback(e => {
    if (
      !parentRef || !parentRef.current || parentRef.current.contains(e.target) ||
      !childRef || !childRef.current || childRef.current.contains(e.target) ||
      (useParentNode && childRef.current.parentNode && childRef.current.parentNode.contains(e.target))
    ) {
      // inside click of tooltip/dropdown or parent element
      return
    }
    // outside click
    callback(e)
  }, [parentRef, childRef, callback])
  useEffect(() => {
    document.addEventListener('touchstart', handleClick)
    document.addEventListener('mousedown', handleClick)
    return () => {
      document.removeEventListener('touchstart', handleClick)
      document.removeEventListener('mousedown', handleClick)
    }
  }, [parentRef, childRef, callback])

  return { parentRef, childRef }
}

export const useDebounce = (value, delay = 100) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(
    () => {
      const timeoutId = setTimeout(() => setDebouncedValue(value), delay)
      return () => clearTimeout(timeoutId)
    },
    [value, delay]
  )

  return debouncedValue
}

export const useThrottle = (value, delay = 100) => {
  const [throttledValue, setThrottledValue] = useState(value)
  const lastRun = useRef(Date.now())

  useEffect(
    () => {
      const handler = setTimeout(() => {
        if (Date.now() - lastRun.current >= delay) {
          setThrottledValue(value)
          lastRun.current = Date.now()
        }
      }, delay - (Date.now() - lastRun.current))

      return () => {
        clearTimeout(handler)
      }
    },
    [value, delay]
  )

  return throttledValue
}

export const usePrevious = (value) => {
  const ref = useRef()

  useEffect(() => {
    ref.current = value
  }, [value])

  return ref.current
}

// Same as useEffect, but don't gets fired on component mount
export const useDidUpdateEffect = (effect, inputs) => {
  const didMountRef = useRef(false)
  useEffect(() => {
    if (didMountRef.current) {
      effect()
    } else {
      didMountRef.current = true
    }
  }, inputs)
}

const isClient = () => typeof window !== 'undefined'

// Hook to get window size
export const useWindowSize = () => {
  const getSize = () => ({
    width: isClient() ? window.innerWidth : undefined,
    height: isClient() ? window.innerHeight : undefined
  })

  const [windowSize, setWindowSize] = useState(getSize)

  useEffect(() => {
    if (!isClient()) {
      return false
    }
    const handleResize = () => {
      setWindowSize(getSize())
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return windowSize
}

/*
 * Hook to get a variable value based on a media query(ies)
 *
 * Usage example:
 *
 * const columnCount = useMedia(
 *  // Media queries
 *  ['(min-width: 1500px)', '(min-width: 1000px)', '(min-width: 600px)'],
 *  // Column counts (relates to above media queries by array index)
 *  [5, 4, 3],
 *  // Default column count
 *  2
 *)
 */
export const useMedia = (queries, values, defaultValue) => {
  const mediaQueryLists = queries.map(q => isClient() ? window.matchMedia(q) : undefined)

  const getValue = () => {
    if (!isClient()) {
      return defaultValue
    }
    const index = mediaQueryLists.findIndex(mql => mql.matches)
    return typeof values[index] !== 'undefined' ? values[index] : defaultValue
  }

  const [value, setValue] = useState(getValue)

  useEffect(
    () => {
      if (!isClient()) {
        return
      }
      const handler = () => setValue(getValue)
      mediaQueryLists.forEach(mql => mql.addListener(handler))
      return () => mediaQueryLists.forEach(mql => mql.removeListener(handler))
    },
    []
  )

  return value
}

export const useLockBodyScroll = () => {
  useLayoutEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = originalStyle }
  }, [])
}

export const useHover = (onOver, onOut, initialRef, excludeRef, bindEvents = true) => {
  // eslint-disable-next-line
  const ref = initialRef || useRef(null)
  // eslint-disable-next-line
  const refExcluded = excludeRef || useRef(null)
  const hovered = useRef(false)

  const onMouseOver = useCallback((e) => {
    if (hovered.current) {
      return
    }
    hovered.current = true
    if (onOver) {
      onOver()
    }
  }, [hovered.current])

  const onMouseOut = useCallback((e) => {
    if (
      !hovered.current ||
      (ref.current && ref.current.contains(e.relatedTarget)) ||
      (refExcluded.current && refExcluded.current.contains(e.relatedTarget))
    ) {
      return
    }
    hovered.current = false
    if (onOut) {
      onOut()
    }
  }, [hovered.current, ref.current, refExcluded.current])

  if (bindEvents) {
    // eslint-disable-next-line
    useEffect(() => {
      const node = ref.current
      if (node) {
        node.addEventListener('mouseover', onMouseOver)
        node.addEventListener('mouseout', onMouseOut)

        return () => {
          node.removeEventListener('mouseover', onMouseOver)
          node.removeEventListener('mouseout', onMouseOut)
        }
      }
    }, [ref.current])
  }

  return { ref, refExcluded, onMouseOver, onMouseOut }
}

export const useClick = (onClick, initialRef) => {
  // eslint-disable-next-line
  const ref = initialRef || useRef(null)

  useEffect(() => {
    const node = ref.current
    if (node) {
      node.addEventListener('click', onClick)
      return () => {
        node.removeEventListener('click', onClick)
      }
    }
  }, [ref.current])
}
