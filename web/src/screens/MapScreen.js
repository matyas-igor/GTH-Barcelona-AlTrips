import React, { useState, useEffect, useRef } from 'react'

import axios from 'axios'

import MapDirectionsRenderer from '../components/MapDirectionsRenderer'
import Map from '../components/Map'
import MapMarker from '../components/MapMarker'
import Card, { CardInner } from '../components/Card'
import H2 from '../components/H2'
import H3 from '../components/H3'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import ChevronLeft from "@kiwicom/orbit-components/lib/icons/ChevronLeft";
import Base from '../components/Base'
import Small from '../components/Small'

import Slider from "@kiwicom/orbit-components/lib/Slider";
import Button from "@kiwicom/orbit-components/lib/Button";
import Stack from "@kiwicom/orbit-components/lib/Stack";
import Tag from "@kiwicom/orbit-components/lib/Tag";
import InputField from "@kiwicom/orbit-components/lib/InputField";
import Alert from "@kiwicom/orbit-components/lib/Alert";
import Modal, { ModalSection, ModalFooter } from "@kiwicom/orbit-components/lib/Modal";
import { useDidUpdateEffect } from '../hooks'

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;
const API_URL = process.env.REACT_APP_API_URL;

const points = [
  { name: 'Vallcarca i els Penitents', lat: 41.412475, lng: 2.140027 },
  { name: 'Plaça de Sarrià', lat: 41.399785, lng: 2.121344 },
  { name: 'Monestir de Pedralbes', lat: 41.395850, lng: 2.112486 },
];

const center = { lat: 41.394943, lng: 2.153814 };
const zoom = 10;

const routes = [
  {
    name: 'Mountain ride in Viladecans',
    length: 20,
    difficulty: 'Easy',
    savings: 3.5,
    image: 'https://lh5.googleusercontent.com/p/AF1QipOHQUuGDY2l8Un2laqeGTUGHUbmDTmLQXFM_fi2=s773-k-no',
    points: [
      {
        name: 'Plaça De Les Palmeres',
        description: 'Park',
        image: 'https://geo0.ggpht.com/maps/photothumb/fd/v1?bpb=CiwKKnNlYXJjaC5nd3MtcHJvZC9tYXBzL2xvY2FsLWRldGFpbHMtZ2V0Y2FyZBIgChIJv-hitu-cpBIRg40N3qkWUx4qCg0AAAAAFQAAAAAaBgjwARCYAw&gl=ES',
        position: [41.315568, 2.016317],
      },
      {
        name: 'Tanatorio Viladecans',
        description: 'Funeral home',
        image: 'https://lh5.googleusercontent.com/p/AF1QipND_bEY-jTEfT8viU-sNGNJQNk5NLcOi3_oQ_hf=w426-h240-k-no',
        position: [41.323440, 2.028729],
      },
      {
        name: 'Can Massallera',
        description: 'Civic center',
        image: 'https://lh5.googleusercontent.com/p/AF1QipPiyYuQiFMIB2KyWDqclMRd9q4fwZbNUdJV2HNN=w408-h612-k-no',
        position: [41.341725, 2.042668],
      },
      {
        name: 'Escola Pública Vicente Ferrer',
        description: 'School',
        image: 'https://lh5.googleusercontent.com/p/AF1QipOuC8tVdf4XLH4tchz3pBzosBrgnycb03d-t2uK=w408-h272-k-no',
        position: [41.345564, 2.027114],
      },
      {
        name: 'Esglesia',
        description: 'Catholic church',
        image: 'https://lh5.googleusercontent.com/p/AF1QipNYVupipx9Z-UigxpIzpnS0ouqQY5Thw8BGhSxq=w408-h306-k-no',
        position: [41.336065, 1.995673],
      },
    ]
  },
  {
    name: 'Trip around Sabadell',
    length: 30,
    difficulty: 'Moderate',
    savings: 5.2,
    image: 'https://lh5.googleusercontent.com/p/AF1QipNiNPuTUf2Un_PTN94Yc3EZj0Ct6cLUB4u4t_ms=w408-h306-k-no',
    points: [
      {
        name: 'Passeig de la Plaça Major',
        description: 'Historical landmark',
        image: 'https://lh5.googleusercontent.com/p/AF1QipPxbrtdszDc1PCYQa6Wz6mBlkZPbrW_FhJb1A_G=w408-h408-k-no',
        position: [41.547741, 2.108916],
      },
      {

        name: 'Estadi Josep Molins',
        description: 'Stadium',
        image: 'https://lh5.googleusercontent.com/p/AF1QipNMFcsyD5M-ymkhM4NYRaQuMe5rBsfmBkYNIQ1g=w426-h240-k-no',
        position: [41.538813, 2.124857],
      },
      {

        name: 'Font de Can Llobateres',
        description: 'Historical landmark',
        image: 'https://lh5.googleusercontent.com/p/AF1QipPw0ciZwD9c_6l3snVEMocJ02SGhzx2tYI3MaiE=w408-h306-k-no',
        position: [41.529262, 2.137333],
      },
      {
        name: 'Ajuntament de Santa Perpètua de Mogoda',
        description: 'City or town hall',
        image: 'https://lh5.googleusercontent.com/p/AF1QipPmIgcVkVOKNZg5MKzV76ya71IyI73MjpTYW9F9=w426-h240-k-no',
        position: [41.534584, 2.183382],
      },
      {

        name: 'L\'Hostal del Fum',
        description: 'Park',
        image: 'https://lh5.googleusercontent.com/p/AF1QipMxo7Fxf1jmG67TuXtnws7qvBRWlhnjANhEmpjR=w426-h240-k-no',
        position: [41.564537, 2.175962],
      },
      {
        name: 'Cementiri de Palau-solità',
        description: 'Cemetery',
        image: 'https://lh5.googleusercontent.com/p/AF1QipNEc5Msx1CN-obb_h6qm-VEzqTsmEFES65-P1QK=w408-h272-k-no',
        position: [41.587326, 2.159963],
      },
    ]
  },
  {
    name: 'Mataró beach ride',
    length: 35,
    difficulty: 'Severe',
    savings: 6.3,
    image: 'https://lh5.googleusercontent.com/p/AF1QipPuYWw1VfACwXLf21Z06cSDnerRLuHx_JuiFP98=w408-h306-k-no',
    points: [
      {
        name: 'Tecnocampus',
        description: 'College',
        image: 'https://lh5.googleusercontent.com/p/AF1QipM6iA-K32HjVCcKXJpWcz9oAyI_VZCUBHUAYwdX=w408-h306-k-no',
        position: [41.527783, 2.433913],
      },
      {
        name: 'Ajuntament de Mataró',
        description: 'City or town hall',
        image: 'https://lh5.googleusercontent.com/p/AF1QipNEnPaX1ZShKVIdFw0QTNhvYQ54vRO0OVUknrGv=w408-h544-k-no',
        position: [41.539758, 2.444871],
      },
      {

        name: 'Circuit municipal de BMX',
        description: 'BMX track',
        image: 'https://lh5.googleusercontent.com/p/AF1QipNO7TosVArAshM3xX1Coc8ZaO5F1I5j_XFnl9ns=w408-h272-k-no',
        position: [41.543529, 2.460334],
      },
      {
        name: 'Beach bar camping barcelona',
        description: 'Cafe',
        image: 'https://lh5.googleusercontent.com/p/AF1QipP2cUDux7tZHKgyTuhbYtDVLTCtbOERXSkDC2UX=w408-h253-k-no',
        position: [41.551158, 2.483929],
      },
      {
        name: 'Parc Joaquim Passi',
        description: 'Park',
        image: 'https://lh5.googleusercontent.com/p/AF1QipNQHhIjHPykBqKz66nzlny8Mpvmn7FE3_SnQTjw=w426-h240-k-no',
        position: [41.559527, 2.495641],
      },
      {
        name: 'Club de Golf Llavaneras-Barcelona',
        description: 'Golf course',
        image: 'https://lh5.googleusercontent.com/p/AF1QipNJw3lmeCrdHoSLzFhVXCYANHxVn3wIh9oQl0YZ=w598-h240-k-no',
        position: [41.564370, 2.485054],
      },
      {
        name: 'Sant Miquel de Mata',
        description: 'Chapel',
        image: 'https://lh5.googleusercontent.com/p/AF1QipNAAR7c6u-1tzTD0Gos_r9v3rroucj3Gu2UHHZ-=w408-h306-k-no',
        position: [41.568877, 2.463521],
      },
      {
        name: 'Can Joaquim Serra',
        description: 'Historical landmark',
        image: 'https://lh5.googleusercontent.com/p/AF1QipPxrF6PnBqkqT-2oMAQrGB5jl4aYyteGtgxI-47=w408-h306-k-no',
        position: [41.563979, 2.447529],
      },
      {
        name: 'Turó de Cerdanyola',
        description: 'Park',
        image: 'https://lh5.googleusercontent.com/p/AF1QipO2PlPDF80zKBtKKzF1xINqHXeTd8mEfR1zTLS9=w426-h240-k-no',
        position: [41.548239, 2.423953],
      },
    ]
  },
]


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

export const Image = styled.div`
  background: url(${({ url }) => url}) no-repeat center center;
  background-size: cover;
  height: 100%;
  width: 100%;
  overflow: hidden; 
`

const getPointTooltipContent = (point) => {
  return (<>
    <Image style={{ height: pointHeight, width: pointWidth }} url={point.image} />
    <div style={{ padding: '4px 16px' }}>
      <Base style={{ fontWeight: 'bold' }}>{point.name}</Base>
      <Small>{point.description}</Small>
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

const pause = timeout => new Promise(resolve => setTimeout(resolve, timeout));

const TripContent = ({ route }) => {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const inputRef = useRef(null)

  useDidUpdateEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [inputRef.current])

  const load = async () => {
    setLoading(true)
    await pause(Math.random() * 3000 + 1000);
    setLoading(false)
    setSuccess(true)
  }

  return (<>
    <Card style={{ width: tripWidth, padding: 0, marginBottom: 16 }} withOverflowHidden>
      <Image style={{ height: tripHeight, width: tripWidth }} url={route.image} />
      <TripDescription>
        <Base style={{ fontWeight: 'bold' }}>{route.name}</Base>
        <Small>Difficulty: <strong>{route.difficulty}</strong></Small>
        <Small>Length: <strong>{route.length} km</strong></Small>
        <TagContainer>
          <Tag style={{ width: '100%' }}>
            <span>You will save {route.savings} kg in CO<Sub>2</Sub> 🌿</span>
          </Tag>
        </TagContainer>
      </TripDescription>
      <ButtonWrapper>
        <Button type={'secondary'} width={tripWidth} size={'large'} onClick={() => setOpen(true)}>
          Save a trip 🔗
        </Button>
      </ButtonWrapper>
    </Card>
    {open && (
      <Modal onClose={() => setOpen(false)}>
        <H2 style={{ marginTop: 54, textAlign: 'center' }}>Enter your email to get a trip. Have a nice ride! 💪</H2>
        <ModalFooter>
          {success ? (
            <Alert type="success" title={null} icon>
              Link with the trip has been successfully sent to your email 😎
            </Alert>
          ) : (
            <Stack direction={'row'}>
              <InputField type='email' ref={inputRef} desktop={{ inline: true }} placeholder={'your-name@mail.com'} />
              <Button onClick={load} loading={loading} disabled={loading}>Send a link</Button>
            </Stack>
          )}
        </ModalFooter>
      </Modal>
    )}
  </>)
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

const ButtonWrapper = styled.div`
  button {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`

const centers = {
  Berlin: { lat: 52.519417, lng: 13.405141 },
  Barcelona: { lat: 41.397983, lng: 2.173422 },
}

const MapScreen = ({
  location = {},
  ...props
}) => {
  const [loading, setLoading] = useState(false);
  const [routeIndex, setRouteIndex] = useState(0);

  const [route, setRoute] = useState(routes[0]);

  const [, name] = (location.pathname || '').match(/\/([^/]+)$/) || []
  const [city, setCity] = useState(capitalize(name));

  const [difficulty, setDifficulty] = useState(3);

  useDidUpdateEffect(() => {
    const [, name] = (location.pathname || '').match(/\/([^/]+)$/) || []
    setCity(capitalize(name))
  }, [location.pathname])

  const reload = async () => {
    if (city && difficulty) {
      setLoading(true);
      let route = null;

      try {
       route = await axios.get(`${API_URL}/getRoute?city=${city}&difficulty=${difficulty}`);
        console.log('ROUTE', route);
      } catch (e) {
        console.error(e.stack);
        await pause(Math.random() * 500 + 500);
        let routeIndexNew = routeIndex + 1 > routes.length - 1 ? 0 : routeIndex + 1;
        setRouteIndex(routeIndexNew);
        route = routes[routeIndexNew];
      }

      if (route) {
        setRoute(route);
      }

      setLoading(false);
    }
  }

  useDidUpdateEffect(reload, [city, difficulty])

  const [map, setMap] = useState(null);

  return (
    <Map
      apiKey={API_KEY}
      center={centers[city]}
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
          <ButtonWrapper>
            <Button width={tripWidth} size={'large'} loading={loading} disabled={loading} onClick={reload}>
              Get a new trip 🚴
            </Button>
          </ButtonWrapper>
        </Card>
        <TripContent route={route} />
      </>)}
    >
      <MapDirectionsRenderer points={route.points} options={{ suppressMarkers: true }} />
      {map && route.points.map((point, idx) => (
        <MapMarker
          key={`marker-${idx}`}
          position={Array.isArray(point.position) ? { lat: point.position[0], lng: point.position[1] } : point.position}
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
