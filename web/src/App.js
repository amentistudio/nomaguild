import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

import AOS from 'aos';
import { focusHandling } from 'cruip-js-toolkit';
import ReactGA from 'react-ga4';

import Home from './pages/Home';
import Whitelist from './pages/Whitelist';
import MintPublic from './pages/MintPublic';
import MintWhitelist from './pages/MintWhitelist';
import MintThankYou from './pages/MintThankYou';

window.addEventListener('load', AOS.refresh);

function App() {
  const location = useLocation();

  useEffect(() => {
    ReactGA.send({ hitType: "pageview", page: location.pathname + location.search });
  }, [location.pathname, location.search]);

  useEffect(() => {
    AOS.init({
      disable: 'phone',
      duration: 750,
      easing: 'ease-out-quart',
    });
    AOS.refreshHard();
  });

  useEffect(() => {
    document.querySelector('html').style.scrollBehavior = 'auto';
    window.scroll({ top: 0 });
    document.querySelector('html').style.scrollBehavior = '';
    focusHandling('outline');
  }, [location.pathname]); // triggered on route change

  return (
    <>
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/whitelist-me" element={<Whitelist />} />
        <Route exact path="/public-mint" element={<MintPublic />} />
        <Route exact path="/whitelist-mint" element={<MintWhitelist />} />
        <Route exact path="/mint-thank-you" element={<MintThankYou />} />
      </Routes>
    </>
  );
}

export default App;
