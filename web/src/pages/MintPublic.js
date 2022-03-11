import React from 'react';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from "@ethersproject/providers";

import Header from '../partials/Header';
import MintHomePublic from '../partials/MintHomePublic';
import Footer from '../partials/Footer';

const getLibrary = (provider) => 
  new Web3Provider(provider);

function MintPublic() {
  return (
    <Web3ReactProvider getLibrary={getLibrary}>
      <div className="flex flex-col min-h-screen overflow-hidden">
        <Header />

        <main className="flex-grow">
          <MintHomePublic />
        </main>

        <Footer />
      </div>
    </Web3ReactProvider>
  );
}

export default MintPublic;
