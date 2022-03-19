import React from 'react';

import Header from '../partials/Header';
import ThankYouNote from '../partials/ThankYouNote';
import Footer from '../partials/Footer';

function MintThankYou() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow">
        <ThankYouNote />
      </main>

      <Footer />
    </div>
  );
}

export default MintThankYou;
