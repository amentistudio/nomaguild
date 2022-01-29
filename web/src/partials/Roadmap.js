import React from 'react';
import { DownloadIcon } from '@heroicons/react/outline';

function Roadmap() {
  return (
    <section>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mt-20">
        <div className="pt-16 md:pt-20"></div>
        <h1 className="h1 lg:text-5xl mb-8 text-center font-red-hat-display font-extrabold" data-aos="fade-down">
          Roadmap to decentralization
        </h1>
        <div className="mx-20 text-xl text-white text-center">
          We're big fans of business minimalism and idea of community owned project.
          We are inspired by long-running projects such as Skyrim or Minecraft which are still living today thanks to great communities of players and modders.
          <br />
          <br />
          The volume of sales doesn't affect the roadmap. Selling NFTs can only speed everything up.
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
              <h3 className="h3 lg:text-2xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                Core Team Established
                <span className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-black bg-green-400">DONE</span>
              </h3>
              <p className="text-gray-400">
                We have spent the last year preparing this project and studying all the possibilities of a blockchain.
                We have found alternative ways of using a blockchain to fund small and medium-sized game developers.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 lg:text-2xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                Funds expansion
                <span className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-black bg-yellow-300">NEXT</span>
              </h3>
              <p className="text-gray-400">
                With NFT mint we’ll increase our capital. 20% of the capital will be reserved and sent to community wallet as a foundation for the DAO.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 lg:text-2xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                NoMA DAO &amp; Treasury
              </h3>
              <p className="text-gray-400">
                By placing your mummy in the sarcophagus (burning the token) you can claim the NoMA Founders Token,
                which guarantees you a share in the NoMA Treasury and also voting right in the community.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 lg:text-2xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                Tokenomics
              </h3>
              <p className="text-gray-400">
                The Core Team is working to create an economy that rewards active members.
                We will also make it possible to fund community projects from the community treasury.
                All projects must be agreed upon and voted on by NoMA Founders members.
              </p>
            </div>
          </div>

          <div className="col-start-8 col-span-5 mb-20 mt-20" data-aos="fade-left">
            <div className="mb-20 pt-20 mt-20">
              <h3 className="h3 lg:text-2xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                Secure funding
                <span className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-black bg-green-400">DONE</span>
              </h3>
              <p className="text-gray-400">
                The core team of 8 people is now fully funded thanks to the investment in DeFi.
                All members can use NoMA Club as a blueprint to start their communities.
              </p>
            </div>
            <div className="mb-20">
              <h3 className="h3 lg:text-2xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                Community Teams
              </h3>
              <p className="text-gray-400">
                We're building a passionate community around gaming and making games. We have zero tolerance for toxic behaviour.
                We are going to expand the core team with the new members recruited from the community.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 lg:text-2xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                Community Projects
              </h3>
              <p className="text-gray-400">
                With established community we can start building ROI Projects &amp; start making games together.
                The Core Team will shift its focus to creating tokenomics and preparing for complete decentralization.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 lg:text-2xl mt-8 mb-2 text-left font-red-hat-display font-extrabold">
                Decentralization
              </h3>
              <ul className="list-disc ml-5 text-gray-400">
                <li>Core Team hands reins to the community.</li>
                <li>Tokens are activated and distributed to active community members.</li>
                <li>Community control via voting.</li>
              </ul>
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
