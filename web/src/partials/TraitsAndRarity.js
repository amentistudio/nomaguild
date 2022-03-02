import React from 'react';

function TraitsAndRarity() {
  return (
    <div className="mb-20">
      <section>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-16 md:pt-20"></div>
          <h1 className="h1 lg:text-5xl md:text-4xl text-3xl mb-8 text-center font-extrabold" data-aos="fade-down">
            Traits and nanobots
          </h1>
          <div className="md:mx-auto max-w-3xl xs:mx-10 text-xl text-center text-white">
            The traits are inspired by the games we love and the pop culture we grew up in.
            <br />
            Something interesting will happen when you decide to evolve your mummy.
          </div>
        </div>

        <div className="max-w-6xl mx-auto grid grid-cols-12 gap-4 my-10">
          <div className="col-span-4"> 
            <img
              data-aos="fade-up"
              src={require('../images/rarity/brain.png')}
              alt="Mummy Brain"
            />
          </div>
          <div className="col-span-4">
            <img
              data-aos="fade-up"
              src={require('../images/rarity/alien.png')}
              alt="Mummy Alien"
            />
          </div>
          <div className="col-span-4">
            <img
              data-aos="fade-up"
              src={require('../images/rarity/egypt.png')}
              alt="Mummy Egypt"
            />
          </div>
          <div className="col-span-4">
            <img
              data-aos="fade-up"
              src={require('../images/rarity/amenti.png')}
              alt="Mummy Amenti"
            />
          </div>
          <div className="col-span-4">
            <img
              data-aos="fade-up"
              src={require('../images/rarity/profesor.png')}
              alt="Mummy Profesor"
            />
          </div>
          <div className="col-span-4">
            <img
              data-aos="fade-up"
              src={require('../images/rarity/octopus.png')}
              alt="Mummy Octopus"
            />
          </div>
          <div className="col-span-4">
            <img
              data-aos="fade-up"
              src={require('../images/rarity/sarcofag.png')}
              alt="Mummy Sarcofag"
            />
          </div>
          <div className="col-span-4">
            <img
              data-aos="fade-up"
              src={require('../images/rarity/serum.png')}
              alt="Mummy Serum"
            />
          </div>
          <div className="col-span-4">
            <img
              data-aos="fade-up"
              src={require('../images/rarity/ethernal.png')}
              alt="Mummy Ethernal"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default TraitsAndRarity;
