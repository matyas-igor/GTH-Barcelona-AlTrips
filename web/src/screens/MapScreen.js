import React from 'react'

import MapDirectionsRenderer from '../components/MapDirectionsRenderer'
import Map from '../components/Map'
import MapMarker from '../components/MapMarker'

const API_KEY = 'AIzaSyC2N9tDmBIlN1025PL6vW5XqCgwMyO8B7M'

const points = [
  { name: 'Vallcarca i els Penitents', lat: 41.412475, lng: 2.140027 },
  { name: 'Plaça de Sarrià', lat: 41.399785, lng: 2.121344 },
  { name: 'Monestir de Pedralbes', lat: 41.395850, lng: 2.112486 },
];

const center = { lat: 41.394943, lng: 2.153814 };
const zoom = 12;

const MapScreen = () => {
  return (
    <Map apiKey={API_KEY} center={center} zoom={zoom}>
      <MapDirectionsRenderer points={points} options={{ suppressMarkers: true }} />
      {points.map((point, idx) => (
        <MapMarker
          key={`marker-${idx}`}
          position={point}
          tooltip
          tooltipProps={{ content: <span>15 mins stop</span>, offset: 0 }}
        />
      ))}
    </Map>
  )
}

export default MapScreen;
