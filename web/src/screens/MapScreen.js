import React, { useState } from 'react'

import MapDirectionsRenderer from '../components/MapDirectionsRenderer'
import Map from '../components/Map'
import MapMarker from '../components/MapMarker'

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const points = [
  { name: 'Vallcarca i els Penitents', lat: 41.412475, lng: 2.140027 },
  { name: 'Plaça de Sarrià', lat: 41.399785, lng: 2.121344 },
  { name: 'Monestir de Pedralbes', lat: 41.395850, lng: 2.112486 },
];

const center = { lat: 41.394943, lng: 2.153814 };
const zoom = 12;

const MapScreen = () => {
  const [map, setMap] = useState(null);
  return (
    <Map apiKey={API_KEY} center={center} zoom={zoom} onMapChange={setMap}>
      <MapDirectionsRenderer points={points} options={{ suppressMarkers: true }} />
      {map && points.map((point, idx) => (
        <MapMarker
          key={`marker-${idx}`}
          position={point}
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
