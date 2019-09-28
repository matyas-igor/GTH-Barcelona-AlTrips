import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import H1 from '../components/H1'
import H3 from '../components/H3'

import Button from "@kiwicom/orbit-components/lib/Button";
import Stack from "@kiwicom/orbit-components/lib/Stack";
import { shadow } from '../components/Tooltip'

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  justify-content: center;
  width: 43%;
  height: 100%;
  position: relative;
  background-color: #fff;
`

const Content = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 0 48px;
  height: 100vh;
  box-shadow: ${shadow};
  z-index: 10;
`

const Logo = styled.img`
  width: 235px;
  margin-top: -100px;
  margin-bottom: 48px;
`

const Image = styled.div`
  background: url(${({ url }) => url}) no-repeat center center;
  background-size: cover;
  height: 100%;
  width: 100%;
  overflow: hidden; 
`

const Photo = styled.div`
  position: absolute;
  width: 57vw;
  right: 0;
  top: 0;
  bottom: 0; 
`

const InitialScreen = ({ history }) => {
  return (<>
    <Photo>
      <Image url={'/assets/photo.png'} />
    </Photo>
    <Wrapper>
      <Content>
        <Logo src={'/assets/altripslogo.svg'} alt={''} />

        <H1 style={{ marginBottom: 56 }}>Bicycle trip planner for  🌐&nbsp;<span style={{ color: '#0074D9' }}>sustainable</span> and 🌱&nbsp;<span style={{ color: '#2ECC40' }}>eco-friendly</span> future</H1>
        <H3>What is your city?</H3>

        <div>
          <Stack inline>
            <Button size={'large'} onClick={() => history.push('/explore/berlin')}>🏢 Berlin</Button>
            <Button size={'large'} onClick={() => history.push('/explore/barcelona')}>⛪️ Barcelona</Button>
          </Stack>
        </div>
      </Content>
    </Wrapper>
  </>);
}

export default InitialScreen;
