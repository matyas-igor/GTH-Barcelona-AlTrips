import React, { useState, useEffect } from 'react'

import MapDirectionsRenderer from '../components/MapDirectionsRenderer'
import Map from '../components/Map'
import MapMarker from '../components/MapMarker'
import Card from '../components/Card'
import H2 from '../components/H2'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import ChevronLeft from "@kiwicom/orbit-components/lib/icons/ChevronLeft";


const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const points = [
  { name: 'Vallcarca i els Penitents', lat: 41.412475, lng: 2.140027 },
  { name: 'Plaça de Sarrià', lat: 41.399785, lng: 2.121344 },
  { name: 'Monestir de Pedralbes', lat: 41.395850, lng: 2.112486 },
];

const center = { lat: 41.394943, lng: 2.153814 };
const zoom = 12;

const LinkBack = styled(Link)`
  margin-right: 8px;
  color: #666;
  &:hover, &:active {
    color: #999;
  }
  &:active {
    transform: translateY(4px);
  }
  transition: width 0.2s ease-in-out, transform 0.2s ease-in-out;
`

const capitalize = (s) => {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

const MapScreen = ({
  location = {},
  ...props
}) => {
  const [city, setCity] = useState(null)

  useEffect(() => {
    const [, name] = (location.pathname || '').match(/\/([^/]+)$/) || []
    setCity(capitalize(name))
  }, [location.pathname])

  const [map, setMap] = useState(null);
  return (
    <Map
      apiKey={API_KEY}
      center={center}
      zoom={zoom}
      onMapChange={setMap}
      renderRightBottomControl={map => (
        <Card>Test</Card>
      )}
      renderLeftTopControl={map => (
        <Card style={{ width: 300 }}>
          <H2 style={{ marginTop: 8, marginBottom: 16 }}>
            <LinkBack to={'/'}><ChevronLeft /></LinkBack>
            {city}
          </H2>
        </Card>
      )}
    >
      <MapDirectionsRenderer points={points} options={{ suppressMarkers: true }} />
      {map && points.map((point, idx) => (
        <MapMarker
          key={`marker-${idx}`}
          position={point}
          label={(idx + 1).toString()}
          tooltip
          tooltipProps={{
            content: <span>15 mins stop</span>,
            offset: 0,
            parentElement: map.getDiv().firstChild,
          }}
        />
      ))}
    </Map>
  )
}

export default MapScreen;
