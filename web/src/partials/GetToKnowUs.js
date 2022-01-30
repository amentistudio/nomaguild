import React from 'react';

function GetToKnowUs() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20"></div>
        <div className="md:grid md:grid-cols-12 md:gap-2 lg:gap-4">
          <div className="col-span-7 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <h5 className="h5 mb-4 font-bold text-yellow-300">VISION</h5>
            <h1 className="h1 lg:text-5xl md:mx-0 sm:mx-10 md:text-4xl sm:text-3xl mb-8 font-red-hat-display font-extrabold" data-aos="fade-down">
              Game industry challenges we're addressing
            </h1>
            <div className="text-xl text-white md:mx-0 sm:mx-20">
              In the current game industry players are no longer the priority.
              Shareholders' wallets have replaced them. And we hate it.
              <br />
              <br />
              We are on the mission to create a community-owned studio that allows players
              to become investors and decision-makers in the game they want to play.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default GetToKnowUs;
