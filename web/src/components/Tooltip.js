import React, { useState, useCallback } from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'
import { Popper } from 'react-popper'

import { useClick, useDebounce, useDidUpdateEffect, useHover, useOutsideClick } from '../hooks'
import { Transition, config } from 'react-spring/renderprops'

const shadow = '0 2px 17px 0 rgba(63, 65, 68, 0.3)'

const getPx = (prop) => {
  if (typeof prop === 'string') {
    return prop
  }
  if (typeof prop === 'number') {
    return `${prop}px`
  }
  return 'auto'
}


const StyledChildrenWrapper = styled.div`
  display: inline-block;
  box-sizing: border-box;
`

export const positions = [
  ...['auto', 'top', 'bottom', 'left', 'right'].reduce((acc, p) => [...acc, p, `${p}-start`, `${p}-end`], [])
]

export const getOffset = (position = 'top', offset) => {
  if (position.startsWith('top')) {
    return { transform: `translate(0, ${getPx(-offset)})` }
  } else if (position.startsWith('bottom')) {
    return { transform: `translate(0, ${getPx(offset)})` }
  } else if (position.startsWith('left')) {
    return { transform: `translate(${getPx(-offset)}, 0)` }
  } else if (position.startsWith('right')) {
    return { transform: `translate(${getPx(offset)}, 0)` }
  }
  return {}
}

const StyledContentWrapper = styled.div`
  display: inline-block;
  text-align: left;
  border-radius: 4px;
  background-color: #fff;
  box-shadow: ${shadow};
  padding: ${({ multiline, noPadding }) => noPadding ? 0 : (multiline ? '16px' : '4px 8px')};
  white-space: ${({ multiline }) => multiline ? 'normal' : 'nowrap'};
  ${({ multiline, width: widthStyle, noPadding }) => widthStyle
    ? `width: ${getPx(widthStyle)}`
    : (multiline && `max-width: ${noPadding ? 'calc(380px - 32px)' : '380px'};`)}
  ${({ position, offset }) => getOffset(position, offset)}
  ${({ withOverflowHidden }) => withOverflowHidden && `overflow: hidden;`}
`

const tooltipTransitionDuration = 180

const getTransformOffset = placement => {
  if (!placement) {
    return { transform: 'translate(0, 0)' }
  }
  if (placement.startsWith('top')) {
    return { transform: 'translate(0, 24px)' }
  }
  if (placement.startsWith('bottom')) {
    return { transform: 'translate(0, -24px)' }
  }
  if (placement.startsWith('left')) {
    return { transform: 'translate(24px, 0)' }
  }
  if (placement.startsWith('right')) {
    return { transform: 'translate(-24px, 0)' }
  }
  return { transform: 'translate(0, 0)' }
}

export const TooltipContent = ({
  position = 'top',
  withOverflowHidden = false,
  animate = true,
  offset = 8,
  multiline = false,
  trigger = 'hover',
  content,
  zIndex = 3000,
  noPadding = false,
  width,
  height,
  show = true,
  parentQuerySelector,
  parentRef,
  childRef
}) => {
  const renderTooltip = (placement = 'top') => (
    <StyledContentWrapper
      position={placement}
      offset={offset}
      multiline={multiline}
      ref={childRef}
      noPadding={noPadding}
      width={width}
      height={height}
      withOverflowHidden={withOverflowHidden}
    >
      {content}
    </StyledContentWrapper>
  )
  return ReactDOM.createPortal(
    <Popper placement={position} referenceElement={parentRef.current}>
      {({ placement, ref, style }) => (
        <div ref={ref} style={{ ...style, zIndex, ...(trigger === 'hover' ? { pointerEvents: 'none' } : {}) }}>
          {animate ? (!placement ? <div style={{ opacity: 0, pointerEvents: 'none', cursor: 'pointer' }}>{renderTooltip(placement)}</div> : (
            <Transition
              items={show}
              from={{ opacity: 0, ...getTransformOffset(placement) }}
              enter={{ opacity: 1, ...getTransformOffset() }}
              leave={{ opacity: 0, ...getTransformOffset(placement) }}
              config={{ ...config.gentle, duration: tooltipTransitionDuration }}
            >
              {show => show && (props => <div style={{ ...props, ...(props.opacity < 0 ? { pointerEvents: 'none', cursor: 'pointer' } : {}) }}>{renderTooltip(placement)}</div>)}
            </Transition>
          )) : renderTooltip(placement)}
        </div>
      )}
    </Popper>,
    parentQuerySelector ? document.querySelector(parentQuerySelector) : document.body
  )
}

export const useTooltip = ({
  trigger = 'hover',
  onOpen = () => {},
  onClose = () => {},
  onToggle = () => {},
  bindEvents = true
}) => {
  const [opened, setOpened] = useState(false)
  const { parentRef, childRef } = useOutsideClick(() => setOpened(false))
  const openedDebounced = useDebounce(opened, tooltipTransitionDuration)

  const onMouseEnter = useCallback(() => {
    if (trigger === 'hover') {
      setOpened(true)
    }
  }, [])

  const onMouseLeave = useCallback(() => {
    if (trigger === 'hover') {
      setOpened(false)
    }
  }, [])

  const { onMouseOver, onMouseOut } = useHover(onMouseEnter, onMouseLeave, parentRef, childRef, bindEvents)

  const onClick = useCallback((e) => {
    if (trigger === 'click') {
      setOpened(opened => !opened)
    }
  }, [])

  if (bindEvents) {
    // eslint-disable-next-line
    useClick(onClick, parentRef)
  }

  useDidUpdateEffect(() => {
    onToggle(opened)
    if (opened) {
      onOpen()
    } else {
      onClose()
    }
  }, [opened])

  const close = () => setOpened(false)
  const open = () => setOpened(true)

  return { parentRef, childRef, opened, openedDebounced, close, open, onMouseOver, onMouseOut, onClick }
}

const Tooltip = ({
  withOverflowHidden = false,
  animate = true,
  parentQuerySelector,
  offset = 8,
  multiline = false,
  trigger = 'hover',
  position = 'top',
  onClick = () => {},
  onOpen = () => {},
  onClose = () => {},
  onToggle = () => {},
  content,
  zIndex = 3000,
  noPadding = false,
  width,
  height,
  children,
  ...props
}) => {
  const { opened, openedDebounced, parentRef, childRef } = useTooltip({
    trigger,
    onOpen,
    onClose,
    onToggle
  })
  return (
    <>
      {(opened || (animate && openedDebounced)) && (
        <TooltipContent
          position={position}
          offset={offset}
          multiline={multiline}
          noPadding={noPadding}
          withOverflowHidden={withOverflowHidden}
          animate={animate}
          width={width}
          height={height}
          parentRef={parentRef}
          childRef={childRef}
          zIndex={zIndex}
          trigger={trigger}
          content={content}
          parentQuerySelector={parentQuerySelector}
          show={opened}
        />
      )}
      <StyledChildrenWrapper
        ref={parentRef}
        {...props}
      >
        {children}
      </StyledChildrenWrapper>
    </>
  )
}

export default Tooltip
