import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { Link } from 'react-router-dom';

const Wrapper = styled.div`
  position: relative;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background-color: #fff;
`

// background: #8fef89;
// background: radial-gradient(circle at 30% 107%,#e1eca0 0%,#f2fb68 5%,#89f167 45%,#41ce3f 60%,#149c4a 90%);

const Img = styled.img`
  width: 200px;
`

const Logo = styled.img`
  width: 500px;
  margin-top: -120px;
  margin-bottom: 24px;
`

const Icon1 = styled.div`
  position: absolute;
  transform: rotate(25deg) skewY(10deg);
  top: 5%;
  left: 15%;
  font-size: 140px;
`
const Icon2 = styled.div`
  position: absolute;
  transform: rotate(-10deg) skewY(-5deg);
  right: 12.5%;
  top: 30%;
  font-size: 130px;
`
const Icon3 = styled.div`
  position: absolute;
  transform: rotate(-40deg) skewY(-10deg);
  left: 10%;
  bottom: 15%;
  font-size: 150px;
`

const LinksContainer = styled.div`
  display: flex;
  align-items: flex-end;
`

const LinkCity = styled(Link)`
  display: block;
  color: black;
  &:hover, &:active {
    transform: scale(1.5);
    width: 450px;
    color: #555;
  }
  &:active {
    transform: translateY(4px);
  }
  width: 300px;
  font-size: 48px;
  transition: width 0.2s ease-in-out, transform 0.2s ease-in-out;
  text-align: center;
  ${({ muted }) => muted && `color: #eee;`}
`

const Text = styled.div`
  font-size: 22px;
  color: ${({ white }) => white ? '#fff' : '#999'};
  text-align: center;
  margin-top: 32px;
  margin-bottom: 32px;
`

const interval = 1000;

const InitialScreen = () => {
  const [white, setWhite] = useState(false)
  useEffect(() => {
    const intervalId = setInterval(() => {
      setWhite(v => !v)
    }, interval)
    return () => clearInterval(intervalId)
  }, [])
  return (
    <Wrapper>
      <Logo src={'/assets/altripslogo.svg'} alt={''} />
      <Img src={'/assets/bike.gif'} alt={''} />
      <Text>Select a city to start your bike trip!</Text>
      <Icon1>🍃</Icon1>
      <Icon2>🍃</Icon2>
      <Icon3>🍃</Icon3>
      <LinksContainer>
        <LinkCity to={'/explore/berlin'}>Berlin</LinkCity>
        <LinkCity to={'/explore/barcelona'}>Barcelona</LinkCity>
      </LinksContainer>
    </Wrapper>
  );
}

export default InitialScreen;
