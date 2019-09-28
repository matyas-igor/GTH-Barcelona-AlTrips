import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  StreetViewPanorama
} from 'react-google-maps'
import styled from 'styled-components'
import { useDidUpdateEffect } from '../hooks'

const MAP_BACKGROUND_COLOR = '#e5e3df';

const styles = [
  { elementType: 'labels.text.fill', stylers: [{ color: '#3f4144' }] },
  { featureType: 'landscape', stylers: [{ color: '#f7f7f7' }] },
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#f8f29d' }] }
]

const MapControl = ({
  map,
  position,
  children,
  ...props
}) => {
  const [div, setDiv] = useState(null)

  useEffect(() => {
    const divCurrent = document.createElement('div')
    const indexCurrent = map.controls[position].length
    map.controls[position].push(divCurrent)

    setDiv(divCurrent)

    return () => {
      if (map.controls[position]) {
        map.controls[position].removeAt(indexCurrent)
      }
      if (divCurrent) {
        divCurrent.remove()
      }
    }
  }, [])

  return div ? ReactDOM.createPortal(children, div) : null
}

const ControlsWrapper = styled.div`
  padding: 12px;
`

const MapComponent = withScriptjs(withGoogleMap(({
  defaultZoom = 8,
  defaultCenter = { lat: -52.518927, lng: 13.404935 },
  onClose = () => {},
  onMapChange = () => {},
  defaultOptions = {},
  renderTopControl,
  renderBottomControl,
  renderLeftTopControl,
  renderRightBottomControl,
  children,
  ...props
}) => {
  const [map, setMap] = useState(null)

  useDidUpdateEffect(() => {
    onMapChange(map)
  }, [map]);

  return (
    <GoogleMap
      ref={map => {
        if (!map) {
          return
        }
        setMap(map.context.__SECRET_MAP_DO_NOT_USE_OR_YOU_WILL_BE_FIRED)
      }}
      defaultZoom={9}
      defaultCenter={{ lat: -34.397, lng: 150.644 }}
      defaultOptions={{
        disableDefaultUI: false,
        keyboardShortcuts: false,
        mapTypeControl: false,
        fullscreenControl: false,
        streetViewControl: false,
        scaleControl: true,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_TOP,
        },
        mapTypeId: window.google.maps.MapTypeId.ROADMAP,
        styles,
        ...defaultOptions
      }}
      controlSize={20}
      {...props}
    >
      {map && renderTopControl && (
        <MapControl map={map} position={window.google.maps.ControlPosition.TOP_CENTER}>
          <ControlsWrapper>{renderTopControl(map)}</ControlsWrapper>
        </MapControl>
      )}
      {map && renderBottomControl && (
        <MapControl map={map} position={window.google.maps.ControlPosition.BOTTOM_CENTER}>
          <ControlsWrapper>{renderBottomControl(map)}</ControlsWrapper>
        </MapControl>
      )}
      {map && renderLeftTopControl && (
        <MapControl map={map} position={window.google.maps.ControlPosition.LEFT_TOP}>
          <ControlsWrapper>{renderLeftTopControl(map)}</ControlsWrapper>
        </MapControl>
      )}
      {map && renderRightBottomControl && (
        <MapControl map={map} position={window.google.maps.ControlPosition.RIGHT_BOTTOM}>
          <ControlsWrapper>{renderRightBottomControl(map)}</ControlsWrapper>
        </MapControl>
      )}
      {map && React.Children.toArray(children).map(element => React.cloneElement(element, { map }))}
      <StreetViewPanorama defaultVisible={false} />
    </GoogleMap>
  )
}))

const Map = ({
  apiKey = '',
  show = true,
  inactive = false,
  defaultOptions = {},
  withZoomControl = true,
  withFullScreenControl = true,
  withClose = false,
  ...props
}) => {
  return show ? (
    <MapComponent
      googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${apiKey}`}
      loadingElement={<div style={{ height: '100%', backgroundColor: MAP_BACKGROUND_COLOR }} />}
      containerElement={<div style={{ height: '100%' }} />}
      mapElement={<div style={{ height: '100%' }} />}
      defaultOptions={{
        ...(inactive ? {
          draggable: false,
          keyboardShortcuts: false,
          disableDoubleClickZoom: true,
          noClear: true
        } : {}),
        ...defaultOptions
      }}
      {...props}
    />
  ) : (<div style={{ height: '100%', backgroundColor: MAP_BACKGROUND_COLOR }} />)
}

export default Map;
