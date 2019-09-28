import React, { useRef } from 'react'
import ReactDomServer from 'react-dom/server.browser'
import { Marker } from 'react-google-maps'

import { SENSATION_WHITE } from '../colors'
import { FONT_FAMILY_BASE } from '../constants'
import { useMediaBreakpoints } from '../helpers'
import { Base as BaseFontSize } from '../Typography/size'
import { hasTouchScreen } from '../accessibility'
import { TooltipContent, useTooltip } from '../Tooltip/Tooltip'
import { useDidUpdateEffect } from '../hooks'

const svgProps = {
  version: '1.1',
  xmlns: 'http://www.w3.org/2000/svg',
  xmlnsXlink: 'http://www.w3.org/1999/xlink'
}

const renderIcon = element => `data:image/svg+xml;base64,${window.btoa(ReactDomServer.renderToStaticMarkup(element))}`

const getCustomIcon = (element, outerSize = new window.google.maps.Size(40, 40), innerSize = new window.google.maps.Size(16, 16)) => {
  return {
    url: renderIcon(React.cloneElement(element, { width: innerSize.width, height: innerSize.height, ...svgProps })),
    size: outerSize,
    origin: new window.google.maps.Point((innerSize.width - outerSize.width) / 2, (innerSize.height - outerSize.height) / 2),
    anchor: new window.google.maps.Point(outerSize.width / 2, outerSize.height / 2),
    labelOrigin: new window.google.maps.Point(outerSize.width / 2, outerSize.height / 2)
  }
}

const getIcon = (type = 'marker') => {
  switch (type) {
    case 'marker':
      return {
        url: renderIcon(<MapMarkerIcon width={38} height={50} {...svgProps} />),
        size: new window.google.maps.Size(38, 50),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(19, 46),
        scaledSize: new window.google.maps.Size(38, 50),
        labelOrigin: new window.google.maps.Point(19, 19)
      }
    case 'dot':
      return {
        url: renderIcon(<DotMarkerIcon width={16} height={16} {...svgProps} />),
        size: new window.google.maps.Size(16, 16),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(4, 4),
        scaledSize: new window.google.maps.Size(8, 8)
      }
    case 'circle-green':
      return {
        url: renderIcon(<PointOfInterestIcon width={32} height={32} {...svgProps} />),
        size: new window.google.maps.Size(32, 32),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(12, 12),
        scaledSize: new window.google.maps.Size(24, 24)
      }
    case 'circle-black':
      return {
        url: renderIcon(<TransportationCircleIcon width={40} height={40} {...svgProps} />),
        size: new window.google.maps.Size(40, 40),
        origin: new window.google.maps.Point(0, 0),
        anchor: new window.google.maps.Point(20, 20),
        scaledSize: new window.google.maps.Size(40, 40)
      }
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

  const { opened, openedDebounced, close, parentRef, childRef, onMouseOver, onMouseOut, onClick } = useTooltip({
    trigger: hasTouchScreen() ? 'click' : trigger,
    onOpen,
    onClose,
    onToggle,
    bindEvents: false
  })

  const getParentNode = target => target.nodeName === 'IMG' ? target.parentNode : target

  const listeners = useRef({}).current

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
        trigger={hasTouchScreen() ? 'click' : trigger}
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

MapMarker.propTypes = {
  type: PropTypes.oneOf(['marker', 'dot', 'circle-green', 'circle-black']),
  position: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number
  }).isRequired,
  label: PropTypes.string,
  icon: PropTypes.element,
  tooltip: PropTypes.bool,
  tooltipProps: PropTypes.object
}

export default MapMarker
