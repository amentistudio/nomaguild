import React from 'react';

function WhoIsThisProjectFor() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 py-20 sm:px-6">
        <h5 className="h5 mb-10 font-bold text-yellow-300 text-center md:text-left">WHO IS THIS COMMUNITY FOR?</h5>
        <div className="md:grid md:grid-cols-12 gap-4">
          <div className="col-span-3 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <img src={require('../images/personas/developers.svg').default} className="sm:mx-auto" alt="Propaganda poster" />
            <h3 className="h2 text-2xl font-bold mt-5">
              Developers
            </h3>
            <div className="text-xl mt-4 text-gray-400 md:mx-0 mx-10">
              Geeks, nerds, streamers, content creators, gamers, and people who love to support interesting games and experiences.
            </div>
          </div>
          <div className="col-span-3 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <img src={require('../images/personas/creatives.svg').default} className="sm:mx-auto" alt="Propaganda poster" />
            <h3 className="h2 text-2xl font-bold mt-5">
              Creatives
            </h3>
            <div className="text-xl mt-4 text-gray-400 md:mx-0 mx-10">
              Game designers, solo developers, musicians, artists, or creative people looking for a sustainable way to do what they love.
            </div>
          </div>
          <div className="col-span-3 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <img src={require('../images/personas/web3_enthusiasts.svg').default} className="sm:mx-auto" alt="Propaganda poster" />
            <h3 className="h2 text-2xl font-bold mt-5">
              Web3 enthusiast
            </h3>
            <div className="text-xl mt-4 text-gray-400 md:mx-0 mx-10">
              Individuals interested in DeFi, DAO, NFT, Sandbox, Metaverse, Tokenomics, and other creative uses of the blockchain.
            </div>
          </div>
          <div className="col-span-3 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <img src={require('../images/personas/entrepreneurs.svg').default} className="sm:mx-auto" alt="Propaganda poster" />
            <h3 className="h2 text-2xl font-bold mt-5">
              Enterpreneurs
            </h3>
            <div className="text-xl mt-4 text-gray-400 md:mx-0 mx-10">
              An entrepreneur looking for a blueprint to start their community focused on a niche market.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhoIsThisProjectFor;
