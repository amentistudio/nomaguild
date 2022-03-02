import React from 'react';
import { DownloadIcon } from '@heroicons/react/outline';

const whitePaperUrl = 'https://s3.eu-central-1.amazonaws.com/com.nomaguild.public/NoMA-Guild-whitepaper-v1.1.pdf';

function Roadmap() {
  return (
    <section>
      <div className="max-w-6xl lg:mx-auto px-4 sm:px-6 mt-20 md:mx-10">
        <div className="pt-16 md:pt-20"></div>
        <h1 className="h1 lg:text-5xl md:text-4xl text-3xl mb-8 text-center font-extrabold" data-aos="fade-down">
          Roadmap to decentralization
        </h1>
        <div className="mx-10 text-xl text-white text-center">
          We're big fans of business minimalism and the idea of a community-owned project.
          <br />
          Selling NFTs can only speed everything up.
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
          </p>
        </div>
        <div className="mt-20">
          <h3 className="h3 text-2xl text-center mt-8 mb-2 text-left font-extrabold">
            Secure funding
            <span className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-black bg-green-400">DONE</span>
          </h3>
          <p className="text-gray-400 text-center md:text-left mx-10">
            The core team of 8 people is now fully funded thanks to the investment in DeFi.
          </p>
        </div>
        <div className="mt-20">
          <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 font-extrabold">
            Funds expansion
            <span className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-black bg-yellow-300">NEXT</span>
          </h3>
          <p className="text-gray-400 text-center mx-10">
            With NFT mint we'll increase our capital. 20% of the capital will be reserved and sent to community wallet to fund community projects.
          </p>
        </div>
        <div className="mt-20">
          <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 text-left font-extrabold">
            Community
          </h3>
          <p className="text-gray-400 text-center md:text-left mx-10 md:mx-0">
            We're building a passionate community around making games and creating experiences in web3.
          </p>
        </div>
        <div className="mt-20">
          <h3 className="h3 text-2xl text-center mt-8 mb-2 text-left font-extrabold">
            Merch
          </h3>
          <p className="text-gray-400 text-center mx-10">
            Exclusive merch for members.
          </p>
        </div>
        <div className="mt-20">
          <h3 className="h3 text-2xl text-center mt-8 mb-2 text-left font-extrabold">
            NoMA DAO &amp; Treasury
          </h3>
          <p className="text-gray-400 text-center mx-10">
            We will offer you nanobots to evolve your mummy. Will you accept this great honor to become the NoMA DAO Founder?
          </p>
        </div>
        <div className="mt-20">
          <h3 className="h3 text-2xl text-center mt-8 mb-2 text-left font-extrabold">
            Community Projects
          </h3>
          <p className="text-gray-400 text-center mx-10">
            You can vote on what projects we will fund and involve in the process of seeding the funds.
          </p>
        </div>
        <div className="mt-20">
          <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 text-left font-extrabold">
            Decentralization
          </h3>
          <p className="text-gray-400 text-center mx-10">
            You can vote on what projects we will fund and involve in the process of seeding the funds.
          </p>
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
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 font-extrabold">
                Funds expansion
                <span className="ml-4 inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded-full shadow-sm text-black bg-yellow-300">NEXT</span>
              </h3>
              <p className="text-gray-400 text-center md:text-left mx-10 md:mx-0">
                We have spent the last year preparing this project and studying all the possibilities of a blockchain.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 text-left font-extrabold">
                Merch
              </h3>
              <p className="text-gray-400 text-center md:text-left mx-10 md:mx-0">
                Exclusive merch for members.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 text-left font-extrabold">
                Community Projects
              </h3>
              <p className="text-gray-400 text-center md:text-left mx-10 md:mx-0">
                You can vote on what projects we will fund and involve in the process of seeding the funds.
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
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 text-left font-extrabold">
                Community
              </h3>
              <p className="text-gray-400 text-center md:text-left mx-10 md:mx-0">
                We're building a passionate community around making games and creating experiences in web3.
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 text-left font-extrabold">
                NoMA DAO &amp; Treasury
              </h3>
              <p className="text-gray-400 text-center md:text-left mx-10 md:mx-0">
                We will offer you nanobots to evolve your mummy. Will you accept this great honor to become the NoMA DAO Founder?
              </p>
            </div>
            <div className="mt-20">
              <h3 className="h3 text-2xl text-center md:text-left mt-8 mb-2 text-left font-extrabold">
                Decentralization
              </h3>
              <p className="text-gray-400 text-center md:text-left mx-10 md:mx-0">
                Core Team hands reins to the community. We will activate tokenomics and distribute tokens to active members. At this point, the community can control itself via voting.
              </p>
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
