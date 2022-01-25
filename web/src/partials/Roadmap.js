import React from 'react';
import { DownloadIcon } from '@heroicons/react/outline';

function Roadmap() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-20">
        <div className="pt-16 md:pt-20"></div>
        <h1 className="h1 lg:text-5xl mb-8 text-center font-red-hat-display font-extrabold" data-aos="fade-down">
          Roadmaping is guessing
        </h1>
        <div className="mx-20 text-xl text-white text-center">
          We're big fans of business minimalism and therefore believe that planning is just guesswork. We won't give you
          any empty promises and in Churchill fashion we have nothing to offer you but blood, toil, tears and sweat.
          <br />
          <br />
          We like actions instead of promises, so take a look at what we have already done and what we are working on.
          The sale of the NFTs might only accelerate everything.
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-20" style={{ borderBottom: '2px solid #FCD34D', width: 400 }}></div>

      <div className="max-w-4xl mx-auto">
        <div className="md:grid md:grid-cols-12">
          <div
            className="col-start-1 col-end-7 pt-20 pr-20"
            style={{ borderRight: '2px solid #FCD34D' }}
            data-aos="fade-right"
          >
            <div className="mt-20">
              <h3 className="h3 lg:text-3xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                NFT Project launch
              </h3>
              <p>
                We have spent the last 9 months preparing this project and studying the NFT world and its possibilities.
                We want to find alternative ways of using blockchain to fund small and medium sized game developers. No
                Mummy Allowed Club will serve as a blueprint and inspiration for other developers.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 lg:text-3xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                Transparent use of finances
              </h3>
              <p>
                Members of our Club can see how we use DEFI for running the game studio with providing collected money
                for liquid mining pools to cover month-to-month expenses.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 lg:text-3xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                Sandbox Gamejams
              </h3>
              <p>
                We have already invested in the purchase of land in Sandbox where we will be hosting online gamejams.
                The land can be also rented by members at discounted rates in the future for the presentation of their
                game.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 lg:text-3xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                Merch &amp; NFT Guides
              </h3>
              <p>
                We believe that custom merch is another great way to support projects that players like. That's why
                during 2022 members can expect detailed guides on how to outsource merch production and distribution so
                they can focus 100% on game development.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 lg:text-3xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                Health and motivation
              </h3>
              <p>
                Game development is usually a long and demanding process. That's why we talk to physiotherapists and
                nutritionists about how to develop a plan for people who spend a lot of time on the computer to stay
                fit, focused and motivated.
              </p>
            </div>
            <div className="my-20">
              <h3 className="h3 lg:text-3xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">And more…</h3>
              <p>
                This is just a basic list of things we are already working on. The time and duration of implementation
                will depend on the priorities and resources we have available. If you are interested in any area in more
                detail. Please take a look at our whitepaper.
              </p>
            </div>
          </div>

          <div className="col-start-8 col-span-5 mb-20 mt-20" data-aos="fade-left">
            <div className="mb-20 pt-20 mt-20">
              <h3 className="h3 lg:text-3xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                BTS &amp; open-source tools
              </h3>
              <p>
                Once the project has started, we will prepare detailed documentation and tools for creating and minting
                NFT projects. This will allow other game developers to create their own NFT project for their community
                and get resources using modern technologies with minimal effort.
              </p>
            </div>
            <div className="mb-20">
              <h3 className="h3 lg:text-3xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                DAO exploration
              </h3>
              <p>
                Autonomous player-owned organisations are of great interest to us. That's why we're setting aside 20% of
                the funds raised for game jams, where talented game developers can get initial funding for their own
                game.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 lg:text-3xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                3D Sandbox avatars
              </h3>
              <p>
                Sandbox never ceases to fascinate us, so we are actively exploring ways to create each mummy for the 3D
                world. Each owner will receive their 3D version of the mummy completely free of charge.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 lg:text-3xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                All games included
              </h3>
              <p>
                Our first game, The Book of Aaru, has been in development for a year. Members will be able to actively
                participate in its development and testing, and will have free access to all games and additional
                content released by Amenti Studio.
              </p>
            </div>
            <div className="my-20">
              <h3 className="h3 lg:text-3xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                Tutorials and inspiration
              </h3>
              <p>
                Members will have access to a forum where they can share their experiences with other developers or gain
                access to premium developer tools and licenses.
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mb-20 text-center" style={{ width: 400 }}>
          <button
            className="text-yellow-300 bg-yellow-300 border-2 border-yellow-300 py-3 px-5 mx-auto text-bold"
            style={{ background: '#0e0e0e' }}
          >
            Show whitepaper
            <DownloadIcon className="h-5 w-5 ml-3 inline" />
          </button>
        </div>
      </div>
    </section>
  );
}

export default Roadmap;
