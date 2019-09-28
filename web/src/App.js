import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

import InitialScreen from './screens/InitialScreen'
import MapScreen from './screens/MapScreen'

console.warn = () => {};

const Style = createGlobalStyle`
  body {
    font-family: Lato, sans-serif;
    margin: 0;
  }
`

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
`

const App = () => {
  return (<Router>
    <Style />
    <Route render={({ location }) => (
      <Wrapper>
        <Switch location={location}>
          <Route exact path="/" component={InitialScreen} />
          <Route path="/explore/:city" component={MapScreen} />
        </Switch>
      </Wrapper>
    )} />
  </Router>)
};

export default App;
