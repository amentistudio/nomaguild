import React from 'react';

import Header from '../partials/Header';
import MintHome from '../partials/MintHome';
import Footer from '../partials/Footer';

function Mint() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow">
        <MintHome />
      </main>

      <Footer />
    </div>
  );
}

export default Mint;
