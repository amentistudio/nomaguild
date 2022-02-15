import React from 'react';

import Header from '../partials/Header';
import HeroWhitelistHome from '../partials/HeroWhitelistHome';
import Footer from '../partials/Footer';

function Whitelist() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow">
        <HeroWhitelistHome />
      </main>

      <Footer />
    </div>
  );
}

export default Whitelist;
