import React from 'react';
import { ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/outline';

function WhoIsThisProjectFor() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 py-20 sm:px-6">
        <h5 className="h5 mb-10 font-bold text-yellow-300 text-center md:text-left">WHO IS THIS PROJECT FOR?</h5>
        <div className="md:grid md:grid-cols-12 gap-4">
          <div className="col-span-4 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <h3 className="h4 font-bold text-green-500">
              Gamers
              <ShieldCheckIcon className="h-7 w-7 ml-3 inline" />
            </h3>
            <div className="text-xl mt-4">
              All owners of our token will get access to all products and games created by Amenti Studio. Forever.
            </div>
          </div>
          <div className="col-span-4 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <h3 className="h4 font-bold text-green-500">
              Developers
              <ShieldCheckIcon className="h-7 w-7 ml-3 inline" />
            </h3>
            <div className="text-xl mt-4">
              We want our project to become an inspiration and blueprint for all game developers that want to raise
              funds directly from the community.
            </div>
          </div>
          <div className="col-span-4 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <h3 className="h4 font-bold text-green-500">
              Metaverse enthusiasts
              <ShieldCheckIcon className="h-7 w-7 ml-3 inline" />
            </h3>
            <div className="text-xl mt-4">
              We own a plot of land in the Sandbox where we will host various gaming events and which will serve as a
              base for our community.
            </div>
          </div>
          <div className="col-span-4 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <h3 className="h4 font-bold text-green-500">
              Publishers
              <ShieldCheckIcon className="h-7 w-7 ml-3 inline" />
            </h3>
            <div className="text-xl mt-4">
              We believe that we will reach a lot of talented developers who will welcome professional help with the
              final stage of the game.
            </div>
          </div>
          <div className="col-span-4 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <h3 className="h4 font-bold text-green-500">
              Investors
              <ShieldCheckIcon className="h-7 w-7 ml-3 inline" />
            </h3>
            <div className="text-xl mt-4">
              Do you see a future in games and the Metaverse? Within our community, you will find cool projects with
              great potential.
            </div>
          </div>
          <div className="col-span-4 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <h3 className="h4 font-bold text-red-600">
              NFT flippers
              <ShieldExclamationIcon className="h-7 w-7 ml-3 inline" />
            </h3>
            <div className="text-xl mt-4">
              Want to flip a few NFTs for a quick buck thanks to unrealistic promises? You'll probably have to look
              elsewhere.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhoIsThisProjectFor;
