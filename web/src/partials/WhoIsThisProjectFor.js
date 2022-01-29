import React from 'react';
import { ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/outline';

function WhoIsThisProjectFor() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 py-20 sm:px-6">
        <h5 className="h5 mb-10 font-bold text-yellow-300 text-center md:text-left">WHO IS THIS COMMUNITY FOR?</h5>
        <div className="md:grid md:grid-cols-12 gap-4">
          <div className="col-span-4 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <h3 className="h2 text-2xl font-bold">
              Gamers
            </h3>
            <div className="text-xl mt-4 text-gray-400">
              All NoMA members will get access to all products and games created by NoMA community for FREE. Forever.
            </div>
          </div>
          <div className="col-span-4 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <h3 className="h2 text-2xl font-bold">
              Developers
            </h3>
            <div className="text-xl mt-4 text-gray-400">
              We want our project to become an inspiration and blueprint for all game developers that want to raise funds directly from the community.
            </div>
          </div>
          <div className="col-span-4 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <h3 className="h2 text-2xl font-bold">
              Artists
            </h3>
            <div className="text-xl mt-4 text-gray-400">
              Are you trying to start a career in gaming or web 3 industry? Join us and find a sustainable way to do what you love.
            </div>
          </div>
          <div className="col-span-4 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <h3 className="h2 text-2xl font-bold">
              Modders
            </h3>
            <div className="text-xl mt-4 text-gray-400">
              The biggest source of inspiration for us is the modding scene. Many talented people work on big projects for a long time out of sheer passion.
            </div>
          </div>
          <div className="col-span-4 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <h3 className="h2 text-2xl font-bold">
              Publishers
            </h3>
            <div className="text-xl mt-4 text-gray-400">
              We believe that we will reach a lot of talented developers who will welcome professional help with the final stage of the game.
            </div>
          </div>
          <div className="col-span-4 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
            <h3 className="h2 text-2xl font-bold">
              Metaverse enthusiasts
            </h3>
            <div className="text-xl mt-4 text-gray-400">
              We own a plot of land in the Sandbox where we will host various gaming events and which will serve as a base for Metaverse experiences.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhoIsThisProjectFor;
