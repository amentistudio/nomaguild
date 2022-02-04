import React from 'react';

function GetToKnowUs() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20"></div>
        <div className="md:grid md:grid-cols-12 md:gap-2 lg:gap-4">
          <div className="col-span-7 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <h5 className="h5 mb-4 font-bold text-yellow-300">VISION</h5>
            <h1 className="h1 lg:text-5xl md:mx-0 sm:mx-10 md:text-4xl text-3xl mb-8 font-extrabold" data-aos="fade-down">
              Game industry challenges we're addressing
            </h1>
            <div className="text-xl text-white md:mx-0 sm:mx-20">
              In the current game industry players are no longer the priority.
              Shareholders' wallets have replaced them. And we hate it.
              <br />
              <br />
              You can use the NoMA project and our know-how as the blueprint for starting your studio.
            </div>
          </div>
          <div className="col-span-5 mb-8 md:mb-0 text-right">
            <img src={require('../images/noma-propaganda-poster.jpg')} className="sm:mx-auto" alt="Propaganda poster" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default GetToKnowUs;
