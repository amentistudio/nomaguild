import React from 'react';

function TraitsAndRarity() {
  return (
    <div className="mb-20">
      <section style={{ borderBottom: '1px solid #444' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-16 md:pt-20"></div>
          <h1 className="h1 lg:text-5xl md:text-4xl text-3xl mb-8 text-center font-extrabold" data-aos="fade-down">
            Traits and rarity
          </h1>
          <div className="mx-auto max-w-3xl text-xl text-center text-white">
            From the millions of possible combinations of 191 traits, we have selected 8192 unique mummies.
            The traits are inspired by the games we still love today and the pop culture we grew up in.
          </div>
        </div>

        <div className="pt-20 mx-10">
          <img
            className="mx-auto hidden md:block"
            data-aos="fade-up"
            src={require('../images/mumie-web-lg.png')}
            alt="Mummy panel large"
          />
          <img
            className="mx-auto hidden sm:block md:hidden"
            data-aos="fade-up"
            src={require('../images/mumie-web-md.png')}
            alt="Mummy panel middle"
          />
          <img
            className="mx-auto block sm:hidden"
            data-aos="fade-up"
            src={require('../images/mumie-web-xs.png')}
            alt="Mummy panel small"
          />
        </div>
      </section>
    </div>
  );
}

export default TraitsAndRarity;
