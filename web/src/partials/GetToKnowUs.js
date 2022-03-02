import React from 'react';

function GetToKnowUs() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-12 md:pt-20"></div>
        <div className="md:grid md:grid-cols-12 md:gap-2 lg:gap-4">
          <div className="col-span-7 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <h5 className="h5 mb-4 font-bold text-yellow-300">WHY?</h5>
            <h1 className="h1 lg:text-5xl md:mx-0 sm:mx-10 md:text-4xl text-3xl mb-8 font-extrabold" data-aos="fade-down">
              Why NoMA Guild?
            </h1>
            <div className="text-xl text-white md:mx-0 md:mr-20 mx-10">
              <p>
                Our goal is to create a fund that will emit steady passive income to seed new 👌 legit indie projects.
              </p>
              <br />
              <p>
                We want to make this accessible to most people so we're setting the price to Ξ0.0419 for the initial whitelist.
              </p>
              <br />
              <p>
                Membership gives you the right to 📩 propose or submit new projects, 🔑 access to the community, 🏌 VIP treatment with all products from the incubator,
                future 💲token for utility and involvement in the process of 🚦 governing the funds. We'll also provide a possibility to move your membership to DAO.
              </p>
            </div>
          </div>
          <div className="col-span-5 mb-8 md:mb-0 text-right">
            <img src={require('../images/noma-dark-poster.png')} className="sm:mx-auto" alt="Propaganda poster" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default GetToKnowUs;
