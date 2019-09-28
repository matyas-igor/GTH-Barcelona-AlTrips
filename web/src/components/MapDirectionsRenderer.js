import React, { useState, useEffect } from 'react'
import { DirectionsRenderer } from 'react-google-maps'

const polylineOptions = {
  strokeColor: '#000',
  strokeOpacity: 1,
  strokeWeight: 2.5,
}

const MapDirectionsRenderer = ({
  points,
  ...props
}) => {
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    const waypoints = points.map(p => ({
      location: Array.isArray(p.position) ? { lat: p.position[0], lng: p.position[1] } : p.position,
      stopover: true
    }));
    const origin = waypoints.shift().location;
    const destination = waypoints.pop().location;

    const directionsService = new window.google.maps.DirectionsService({ suppressMarkers: true, polylineOptions });
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: window.google.maps.TravelMode.BICYCLING,
        waypoints: waypoints
      },
      (result, status) => {
        console.log(result)
        if (status === window.google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(result);
        }
      }
    );
  }, [points]);

  // https://developers.google.com/maps/documentation/javascript/reference/directions#DirectionsRendererOptions.infoWindow
  return directions && (<DirectionsRenderer directions={directions} {...props} />);
}

export default MapDirectionsRenderer;
