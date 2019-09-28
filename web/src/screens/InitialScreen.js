import React, { useEffect, useState } from 'react';
import styled from 'styled-components'
import { Link } from 'react-router-dom';
import H1 from '../components/H1'
import H3 from '../components/H3'

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

const Content = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 1200px;
`

const Row = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
`

const ColLeft = styled.div`
  width: 40%;
  
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`
const ColRight = styled.div`
  width: 60%;
  
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
`

// background: #8fef89;
// background: radial-gradient(circle at 30% 107%,#e1eca0 0%,#f2fb68 5%,#89f167 45%,#41ce3f 60%,#149c4a 90%);

const Img = styled.img`
  width: 350px;
`

const Logo = styled.img`
  width: 400px;
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


const LinkCity = styled(Link)`
  display: block;
  color: #000;
  &:hover, &:active {
    color: ${({ muted }) => muted ? `#eee` : '#666'};
  }
  &:active {
    transform: translateY(4px);
  }
  transition: width 0.2s ease-in-out, transform 0.2s ease-in-out;
  ${({ muted }) => muted && `color: #eee;`}
`

const Ul = styled.ul`
  font-size: 32px;
  margin: 0;
  line-height: 1.5;
  a {
    font-weight: bold;
  }
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
      <Content>
        <Logo src={'/assets/altripslogo.svg'} alt={''} />
        <Row>
          <ColLeft><Img src={'/assets/bike.gif'} alt={''} /></ColLeft>
          <ColRight>
            <H1>Bicycle trip planner for  🌐 <span style={{ color: '#0074D9' }}>sustainable</span><br />and 🌱 <span style={{ color: '#2ECC40' }}>eco-friendly</span> future</H1>
            <H3>Start by selecting a city:</H3>
            <Ul>
              <li>
                <LinkCity to={'/explore/berlin'}>Berlin</LinkCity>
              </li>
              <li>
                <LinkCity to={'/explore/barcelona'}>Barcelona</LinkCity>
              </li>
              <li>
                <span style={{ color: '#999' }}>
                  More coming soon...
                </span>
              </li>
            </Ul>
          </ColRight>
        </Row>
      </Content>
      {/*<Icon1>🍃</Icon1>*/}
      {/*<Icon2>🍃</Icon2>*/}
      {/*<Icon3>🍃</Icon3>*/}
    </Wrapper>
  );
}

export default InitialScreen;
