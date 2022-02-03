import React from 'react';

function TraitsAndRarity() {
  return (
    <div className="mb-20">
      <section style={{ borderBottom: '1px solid #444' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="pt-16 md:pt-20"></div>
          <h1 className="h1 lg:text-5xl md:text-4xl text-3xl mb-8 text-center font-red-hat-display font-extrabold" data-aos="fade-down">
            Traits and rarity
          </h1>
          <div className="mx-auto max-w-3xl text-xl text-center text-white">
            From the millions of possible combinations of 191 traits, we have selected 8192 unique mummies.
            The traits are inspired by the games we still love today and the pop culture we grew up in.
          </div>
        </div>

        <div className="pt-20 relative" style={{ height: 500 }}>
          <img
            className="absolute bottom-0"
            style={{ left: '10vw', maxWidth: '20vw' }}
            data-aos="fade-up"
            src={require('../images/rarity/mummy-common.png')}
            alt="Common rarity mummy"
          />
          <img
            className="absolute bottom-0"
            style={{ left: '20vw', maxWidth: '25vw' }}
            data-aos="fade-up"
            src={require('../images/rarity/mummy-extraordinary.png')}
            alt="Extraordinary rarity mummy"
          />
          <img
            className="absolute bottom-0"
            style={{ left: '67vw', maxWidth: '20vw' }}
            data-aos="fade-up"
            src={require('../images/rarity/mummy-rare.png')}
            alt="Rare rarity mummy"
          />
          <img
            className="absolute bottom-0"
            style={{ left: '55vw', maxWidth: '25vw' }}
            data-aos="fade-up"
            src={require('../images/rarity/mummy-exceptional.png')}
            alt="Exceptional rarity mummy"
          />
          <img
            className="absolute bottom-0"
            style={{ left: '35vw', maxWidth: '30vw' }}
            data-aos="fade-up"
            src={require('../images/rarity/mummy-legendary.png')}
            alt="Legendary rarity mummy"
          />
        </div>
      </section>
    </div>
  );
}

export default TraitsAndRarity;
