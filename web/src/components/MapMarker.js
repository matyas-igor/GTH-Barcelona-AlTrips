import React, { useRef } from 'react'
import { Marker } from 'react-google-maps'

import { TooltipContent, useTooltip } from './Tooltip'
import { useDidUpdateEffect } from '../hooks'

const getIcon = () => {
  return {
    url: '/assets/point.svg',
    size: new window.google.maps.Size(42, 42),
    origin: new window.google.maps.Point(0, 0),
    anchor: new window.google.maps.Point(21, 21),
    scaledSize: new window.google.maps.Size(42, 42),
    labelOrigin: new window.google.maps.Point(21, 21)
  }
}

const cachedIcons = {}

const getMapIcon = (type = 'marker') => {
  if (typeof window === 'undefined') {
    return null
  }
  if (cachedIcons[type]) {
    return cachedIcons[type]
  }
  cachedIcons[type] = getIcon(type)
  return cachedIcons[type]
}

const MapIconMarker = React.forwardRef(({
  type = 'marker',
  position = { lat: 0, lng: 0 },
  label,
  icon,
  zIndex,
  ...props
}, ref) => {
  let labelProps
  if (label) {
    labelProps = {
      text: label,
      color: '#fff',
      fontFamily: 'Lato, sans-serif',
      fontWeight: '400',
      fontSize: '16px',
      lineHeight: '16px',
      textAlign: 'center'
    }
  }
  return (
    <Marker
      ref={ref}
      position={position}
      icon={getMapIcon(type)}
      label={labelProps}
      zIndex={zIndex}
      {...props}
    />
  )
})

const MapMarker = ({
  tooltip = false,
  tooltipProps = {},
  map,
  ...props
}) => {
  if (!tooltip) {
    return <MapIconMarker {...props} />
  }

  const {
    trigger = 'hover',
    onToggle = () => {},
    onOpen = () => {},
    onClose = () => {},
    animate = true,
    offset = 0,
    ...restTooltipProps
  } = tooltipProps

  // eslint-disable-next-line
  const { opened, openedDebounced, close, parentRef, childRef, onMouseOver, onMouseOut, onClick } = useTooltip({
    trigger: trigger,
    onOpen,
    onClose,
    onToggle,
    bindEvents: false
  })

  const getParentNode = target => target.nodeName === 'IMG' ? target.parentNode : target

  // eslint-disable-next-line
  const listeners = useRef({}).current

  // eslint-disable-next-line
  useDidUpdateEffect(() => {
    if (opened) {
      listeners.bounds = map.addListener('bounds_changed', close)
      listeners.center = map.addListener('center_changed', close)
      listeners.zoom = map.addListener('zoom_changed', close)
      listeners.drag = map.addListener('dragstart', close)
    } else {
      window.google.maps.event.removeListener(listeners.bounds)
      window.google.maps.event.removeListener(listeners.center)
      window.google.maps.event.removeListener(listeners.zoom)
      window.google.maps.event.removeListener(listeners.drag)
    }
  }, [opened])

  return (<>
    {(opened || (animate && openedDebounced)) && (
      <TooltipContent
        parentRef={parentRef}
        childRef={childRef}
        trigger={trigger}
        show={opened}
        animate={animate}
        offset={offset}
        {...restTooltipProps}
      />
    )}
    <MapIconMarker
      onMouseOver={e => {
        parentRef.current = getParentNode(e.xa.target)
        setTimeout(() => onMouseOver(e.xa))
      }}
      onMouseOut={e => onMouseOut(e.xa)}
      onClick={e => {
        parentRef.current = getParentNode(e.xa.target)
        setTimeout(() => onClick(e.xa))
      }}
      {...props}
    />
  </>)
}

export default MapMarker
