import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom'
import {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  StreetViewPanorama
} from 'react-google-maps'
import styled from 'styled-components'

const MAP_BACKGROUND_COLOR = '#e5e3df';

const styles = [
  { elementType: 'labels.text.fill', stylers: [{ color: '#3f4144' }] },
  { featureType: 'landscape', stylers: [{ color: '#f7f7f7' }] },
  { featureType: 'road.highway', elementType: 'geometry.fill', stylers: [{ color: '#f8f29d' }] }
]

const MapComponent = withScriptjs(withGoogleMap(({
  defaultZoom = 8,
  defaultCenter = { lat: -52.518927, lng: 13.404935 },
  onClose = () => {},
  onMapChange = () => {},
  defaultOptions = {},
  children,
  ...props
}) => {
  const [map, setMap] = useState(null)

  useEffect(() => {
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
        disableDefaultUI: true,
        keyboardShortcuts: false,
        styles,
        ...defaultOptions
      }}
      controlSize={20}
      {...props}
    >
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
