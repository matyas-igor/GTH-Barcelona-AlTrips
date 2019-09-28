import React, { useState, useEffect } from 'react'
import { DirectionsRenderer } from 'react-google-maps'

const MapDirectionsRenderer = ({
  points,
  ...props
}) => {
  const [directions, setDirections] = useState(null);

  useEffect(() => {
    const waypoints = points.map(p => ({
      location: p,
      stopover: true
    }));
    const origin = waypoints.shift().location;
    const destination = waypoints.pop().location;

    const directionsService = new window.google.maps.DirectionsService({ suppressMarkers: true });
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
  return directions && (<DirectionsRenderer directions={directions} options={{ suppressMarkers: true }} {...props} />);
}

export default MapDirectionsRenderer;
