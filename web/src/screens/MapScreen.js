import React, { useState, useEffect } from 'react'

import MapDirectionsRenderer from '../components/MapDirectionsRenderer'
import Map from '../components/Map'
import MapMarker from '../components/MapMarker'
import Card, { CardInner } from '../components/Card'
import H2 from '../components/H2'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import ChevronLeft from "@kiwicom/orbit-components/lib/icons/ChevronLeft";
import Base from '../components/Base'
import Small from '../components/Small'

import Slider from "@kiwicom/orbit-components/lib/Slider";
import Button from "@kiwicom/orbit-components/lib/Button";
import Tag from "@kiwicom/orbit-components/lib/Tag";

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

const pointHeight = 150;
const pointWidth = 300;

const Image = styled.div`
  background: url(${({ url }) => url}) no-repeat center center;
  background-size: cover;
  height: 100%;
  width: 100%;
  overflow: hidden; 
`

const getPointTooltipContent = (point) => {
  return (<>
    <Image style={{ height: pointHeight, width: pointWidth }} url={`https://picsum.photos/${pointWidth * 2}/${pointHeight * 2}`} />
    <div style={{ padding: '4px 16px' }}>
      <Base style={{ fontWeight: 'bold' }}>Name</Base>
      <Small>Description</Small>
    </div>
  </>)
}

const TripDescription = styled.div`
  padding: 4px 24px;
`

const tripWidth = 300;
const tripHeight = 165;

const TagContainer = styled.p`
  & > div {
    width: 100%;
  }
`

const Sub = styled.span`
  font-size: 8px;
  position: relative;
  top: 2px;
`

const getTripContent = trip => {
  return (
    <Card style={{ width: tripWidth, padding: 0, marginBottom: 16 }} withOverflowHidden>
      <Image style={{ height: tripHeight, width: tripWidth }} url={`https://picsum.photos/${tripWidth * 2}/${tripHeight * 2}`} />
      <TripDescription>
        <Base style={{ fontWeight: 'bold' }}>Name</Base>
        <Small>Level: <strong>Easy</strong></Small>
        <Small>Length: <strong>76km</strong></Small>
        <TagContainer>
          <Tag style={{ width: '100%' }}>
            <span>You will save 35kg in CO<Sub>2</Sub> 🌿</span>
          </Tag>
        </TagContainer>
      </TripDescription>
    </Card>
  )
}

const getDifficultyLabel = number => {
  switch (number) {
    case 1: return 'Easy';
    case 2: return 'Casual';
    case 3: return 'Normal';
    case 4: return 'Moderate';
    case 5: return 'Severe';
    default: return 'Normal';
  }
}

const MapScreen = ({
  location = {},
  ...props
}) => {
  const [city, setCity] = useState(null)
  const [difficulty, setDifficulty] = useState(3)

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
      renderLeftTopControl={map => (<>
        <Card style={{ width: 300, padding: 0, marginBottom: 16 }}>
          <CardInner>
            <H2 style={{ marginTop: 8, marginBottom: 16 }}>
              <LinkBack to={'/'}><ChevronLeft /></LinkBack>
              {city}
            </H2>
            <Small style={{ marginBottom: 8 }}>Difficulty: <strong>{getDifficultyLabel(difficulty)}</strong></Small>
          </CardInner>
          <CardInner style={{ backgroundColor: '#f0f0f0' }}>
            <Slider
              defaultValue={difficulty}
              value={difficulty}
              onChange={setDifficulty}
              max={5}
              min={1}
              step={1}
            />
          </CardInner>
        </Card>
        {getTripContent()}
        <Button width={tripWidth} size={'large'}>
          Get a new trip 🚴
        </Button>
      </>)}
    >
      <MapDirectionsRenderer points={points} options={{ suppressMarkers: true }} />
      {map && points.map((point, idx) => (
        <MapMarker
          key={`marker-${idx}`}
          position={point}
          label={(idx + 1).toString()}
          tooltip
          tooltipProps={{
            content: getPointTooltipContent(point),
            offset: 0,
            parentElement: map.getDiv().firstChild,
            noPadding: true,
            width: pointWidth,
            withOverflowHidden: true,
          }}
        />
      ))}
    </Map>
  )
}

export default MapScreen;
