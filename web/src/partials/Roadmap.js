import React from 'react';
import { DownloadIcon } from '@heroicons/react/outline';

const whitePaperUrl = 'https://nomaclub-public.s3.eu-central-1.amazonaws.com/NoMA-whitepaper-v1.1.pdf';

function Roadmap() {
  return (
    <section>
      <div className="max-w-6xl lg:mx-auto px-4 sm:px-6 mt-20 md:mx-10">
        <div className="pt-16 md:pt-20"></div>
        <h1 className="h1 lg:text-5xl md:text-4xl text-3xl mb-8 text-center font-extrabold" data-aos="fade-down">
          Roadmap to decentralization
        </h1>
        <div className="mx-10 text-xl text-white text-center">
          We're big fans of business minimalism and idea of community owned project.
          We are inspired by long-running projects such as Skyrim or Minecraft which are still living today thanks to great communities of players and modders.
          <br />
          <br />
          The volume of sales doesn't affect the roadmap. Selling NFTs can only speed everything up.
        </div>
      </div>

      <div className="max-w-6xl mx-auto mt-20" style={{ borderBottom: '2px solid #FCD34D', width: 400 }}></div>

      <div className="max-w-4xl mx-auto md:mx-10 md:hidden">
        <div className="mt-20">
          <h3 className="h3 text-2xl text-center mt-8 mb-2 font-extrabold">
            Core Team Est.
            <span className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-black bg-green-400">DONE</span>
          </h3>
          <p className="text-gray-400 text-center md:text-left mx-10 md:mx-0">
            We have spent the last year preparing this project and studying all the possibilities of a blockchain.
            We have found alternative ways of using a blockchain to fund small and medium-sized game developers.
          </p>
        </div>
        <div className="mt-20">
          <h3 className="h3 text-2xl text-center mt-8 mb-2 text-left font-extrabold">
            Secure funding
            <span className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-black bg-green-400">DONE</span>
          </h3>
          <p className="text-gray-400 text-center md:text-left mx-10">
            The core team of 8 people is now fully funded thanks to the investment in DeFi.
            All members can use NoMA guild as a blueprint to start their communities.
          </p>
        </div>
        <div className="mt-20">
          <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 font-extrabold">
            Funds expansion
            <span className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-black bg-yellow-300">NEXT</span>
          </h3>
          <p className="text-gray-400 text-center mx-10">
            With NFT mint we'll increase our capital. 20% of the capital will be reserved and sent to community wallet as a foundation for the DAO.
          </p>
        </div>
        <div className="mt-20">
          <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 text-left font-extrabold">
            Community Teams and Brand building
          </h3>
          <p className="text-gray-400 text-center md:text-left mx-10 md:mx-0">
            We're building a passionate community around gaming and making games. We have zero tolerance for toxic behaviour.
            We are going to expand the core team with the new members recruited from the community.
          </p>
        </div>
        <div className="mt-20">
          <h3 className="h3 text-2xl text-center mt-8 mb-2 text-left font-extrabold">
            Community Projects for Sustainability 
          </h3>
          <p className="text-gray-400 text-center mx-10">
            With an established community, we can continue to work on ROI Projects and start
            building new ones with you. The Core will shift focus to creating tokenomics and
            preparing for complete decentralization.
          </p>
        </div>
        <div className="mt-20">
          <h3 className="h3 text-2xl text-center mt-8 mb-2 text-left font-extrabold">
            NoMA DAO &amp; Treasury
          </h3>
          <p className="text-gray-400 text-center mx-10">
            We will offer you a chance to become the founder of NoMA DAO. Owning a Founder's DAO
            token means having governance over the DAO, its contents, and the Community Treasury.
          </p>
        </div>
        <div className="mt-20">
          <h3 className="h3 text-2xl text-center mt-8 mb-2 text-left font-extrabold">
            Tokenomics
          </h3>
          <p className="text-gray-400 text-center mx-10">
            The Core Team is working to create an economy that rewards active members.
            We will also make it possible to fund community projects from the community treasury.
            All projects must be agreed upon and voted on by NoMA Founders members.
          </p>
        </div>
        <div className="mt-20">
          <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 text-left font-extrabold">
            Decentralization
          </h3>
          <ul className="md:list-disc text-gray-400 text-center mx-10 md:ml-5 md:mr-0">
            <li>Core Team hands reins to the community.</li>
            <li>Tokens are activated and distributed to active community members.</li>
            <li>Community control via voting.</li>
          </ul>
        </div>
      </div>

      <div className="max-w-4xl lg:mx-auto md:mx-10 hidden md:block">
        <div className="md:grid md:grid-cols-12">
          <div
            className="col-start-1 col-end-7 md:pt-20 md:pr-20"
            style={{ borderRight: '2px solid #FCD34D' }}
            data-aos="fade-right"
          >
            <div className="mt-20">
              <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 font-extrabold">
                Core Team Est.
                <span className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-black bg-green-400">DONE</span>
              </h3>
              <p className="text-gray-400 text-center md:text-left mx-10 md:mx-0">
                We have spent the last year preparing this project and studying all the possibilities of a blockchain.
                We have found alternative ways of using a blockchain to fund small and medium-sized game developers.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 font-extrabold">
                Funds expansion
                <span className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-black bg-yellow-300">NEXT</span>
              </h3>
              <p className="text-gray-400 text-center md:text-left mx-10 md:mx-0">
                With NFT mint we'll increase our capital. 20% of the capital will be reserved and sent to community wallet as a foundation for the DAO.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 text-left font-extrabold">
                Community Projects for Sustainability 
              </h3>
              <p className="text-gray-400 text-center md:text-left mx-10 md:mx-0">
                With an established community, we can continue to work on ROI Projects and start building
                new ones with you. The Core will shift focus to creating tokenomics and preparing for
                complete decentralization.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 text-left font-extrabold">
                Tokenomics
              </h3>
              <p className="text-gray-400 text-center md:text-left mx-10 md:mx-0">
                The Core Team is working to create an economy that rewards active members.
                We will also make it possible to fund community projects from the community treasury.
                All projects must be agreed upon and voted on by NoMA Founders members.
              </p>
            </div>
          </div>

          <div className="col-start-8 col-span-5 mb-20 md:mt-20" data-aos="fade-left">
            <div className="mt-20 pt-20 mt-20">
              <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 text-left font-extrabold">
                Secure funding
                <span className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-black bg-green-400">DONE</span>
              </h3>
              <p className="text-gray-400 text-center md:text-left mx-10 md:mx-0">
                The core team of 8 people is now fully funded thanks to the investment in DeFi.
                All members can use NoMA guild as a blueprint to start their communities.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 text-left font-extrabold">
                Community Teams and Brand building
              </h3>
              <p className="text-gray-400 text-center md:text-left mx-10 md:mx-0">
                We're building a passionate community around gaming and making games. We have zero tolerance for toxic behaviour.
                We are going to expand the core team with the new members recruited from the community.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 text-left font-extrabold">
                NoMA DAO &amp; Treasury
              </h3>
              <p className="text-gray-400 text-center md:text-left mx-10 md:mx-0">
                We will offer you a chance to become the founder of NoMA DAO. Owning a Founder's DAO
                token means having governance over the DAO, its contents, and the Community Treasury.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 text-left font-extrabold">
                Decentralization
              </h3>
              <ul className="md:list-disc text-gray-400 text-center md:text-left mx-10 md:ml-5 md:mr-0">
                <li>Core Team hands reins to the community.</li>
                <li>Tokens are activated and distributed to active community members.</li>
                <li>Community control via voting.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto mb-20 text-center" style={{ width: 400 }}>
        <h2 className="h2 text-2xl text-center md:text-left mt-20 mb-8 md:my-8 text-left font-extrabold">
          Would you like to know more?
        </h2>
        <a
          href={whitePaperUrl}
          className="button inline-block text-yellow-300 bg-black-300 hover:bg-yellow-300 hover:text-black border-2 border-yellow-300 py-3 px-5 mx-auto text-bold"
          target="_blank" rel="noreferrer"
        >
          Read our Whitepaper
          <DownloadIcon className="h-5 w-5 ml-3 inline" />
        </a>
      </div>
    </section>
  );
}

export default Roadmap;
