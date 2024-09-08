import React from 'react';
import Header from './Header';
import { BrowserRouter, Navigate, Outlet, Routes, Route } from 'react-router-dom';
import styled from 'styled-components';
import Home from './Home.js';
import Pickup from './Pickup';
import Reserved from './Reserved';
import SettingMatch from './SettingMatch';

const Container = styled.div`
  margin: 0 auto;
  width: 95%;
  // border: 1px solid white;
`;

function Router() {
  return (
    <div>
      <BrowserRouter>
        <Header/>
        <Container>
          <Routes>
              <Route exact path="/"  element={<Home />} />
              <Route path="/pick-up" element={<Pickup />} />
              <Route path='/reserved' element={<Reserved/>} />
              <Route path='/setting-match' element={<SettingMatch/>} />
          </Routes>
        </Container>
      </BrowserRouter>
    </div>
  );
}

export default Router;