import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const FAQ = ({ question, children }) =>
  <Disclosure as="div" key={question} className="pt-6">
    {({ open }) => (
      <>
        <dt className="text-lg">
          <Disclosure.Button className="text-left w-full flex justify-between items-start">
            <span className="font-medium">{question}</span>
            <span className="ml-6 h-7 flex items-center">
              <ChevronDownIcon
                className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform')}
                aria-hidden="true"
              />
            </span>
          </Disclosure.Button>
        </dt>
        <Disclosure.Panel as="dd" className="mt-2 pr-12">
          <p className="text-base text-gray-400">{children}</p>
        </Disclosure.Panel>
      </>
    )}
  </Disclosure>

function FAQs() {
  return (
    <section className="my-20 mx-10">
      <div className="max-w-4xl mx-auto pb-20">
        <h2 className="text-left font-extrabold text-3xl">Project</h2>
        <dl className="mt-6 max-w-4xl space-y-6 divide-y divide-gray-800">
          <FAQ question="Why is it called the No Mummy Allowed Gaming Club?">
            The end of the millennium saw the rise of the internet and the birth of many gaming legends.
            Back then, as teenagers, we were fascinated by this technological advance and could play games late into the night.
            However, our parents, especially our mothers, had a hard time with it. What will you become?
            They were scared because they didn't understand it.
            Gaming won't feed you, they said. Go to law school or medical school, secure your future!
            They were concerned about our well-being, but they were wrong.
            <br /><br />
            In just 20 years, the gaming market has grown to nearly $180 billion (2021).
            Now we stand on the cusp of a similar revolution. The Metaverse is coming.
            And just like our parents 20 years ago, we don't understand it now, but we study it diligently every day.
            And we still love gaming beyond the grave and will do our best to guide you through this new fascinating world and
            show you how to utilize blockchain technology to do what we love. No more career advice from mums :)
            <br />
            P.S. We love you!  
          </FAQ>
          <FAQ question="How is No Mummy Allowed Gaming Club different?">
            <ul className="list-disc ml-5">
              <li>We are not starting from 0 but we already have a capital we work with ($200k) that is helping us run Amenti studio (see our Whitepaper for more details)</li>
              <li>We're here to stay long term, to prove it we've exposed our names and professions</li>
              <li>We will not spend the mint money or royalties, but instead invest it and increase our capital that generates monthly income that is helping us run the projects (how? see Whitepaper)</li>
              <li>We are doers with passion for games and game making (proof? see “Amenti studio” and “The Book of Aaru” game we're building over a year)</li>
              <li>And many more... (see our Whitepaper)</li>
            </ul>
          </FAQ>
          <FAQ question="When are you launching?">
            <ul className="list-disc ml-5">
              <li>until 20.2.2022 We're allowing people to whitelist their Metamask wallet</li>
              <li>on 22.2.2022 We're opening whitelist mint</li>
              <li>on 24.2.2022 We're opening public mint</li>
              <li>after 1.3.2022 All remaining NFTs will go to our treasury for other purposes and minting will be closed (giveaways, contests, partnerships, rewards, ...)</li>
            </ul>
          </FAQ>
          
        </dl>
      </div>
      <div className="max-w-4xl mx-auto pb-20">
        <h2 className="text-left font-extrabold text-3xl">NFTs</h2>
        <dl className="mt-6 max-w-4xl space-y-6 divide-y divide-gray-800">
          <FAQ question="How many Mummies are there?">
            2^13 aka 8192. We're going to keep 192 for our own purposes such as marketing and giveaways, the rest will be available for mint during whitelist mint and after that public mint.
          </FAQ>
          <FAQ question="How many traits are there?">
            191 traits in 7 categories (accessories, background, clothes, eyes, head, mouth, skin).
            We've made sure the traits that are not compatible do not match up and also we've selected a few to match up only with other few.
            Each trait has its own rarity attribute that contributes to the final rarity score of each mummy.
            Final distribution of the mummies resulted in 7 different rarity levels.
          </FAQ>
          <FAQ question="What does ownership get me?">
            <ul className="list-disc ml-5">
              <li>Exclusive membership in NoMA community</li>
              <li>Access to all NoMA products for FREE forever</li>
              <li>You will be able to choose if you want to participate in the leadership of the NoMA DAO</li>
              <li>You can get the NoMA Founder Token, which will give you the share of the NoMA DAO Treasury</li>
              <li>Airdrops from us in the future as we grow our online presence and influence</li>
            </ul>
          </FAQ>
        </dl>
      </div>
      <div className="max-w-4xl mx-auto pb-20">
        <h2 className="text-left font-extrabold text-3xl">Minting</h2>
        <dl className="mt-6 max-w-4xl space-y-6 divide-y divide-gray-800">
          <FAQ question="How much for each mint?">
            <ul className="list-disc ml-5">
              <li>Whitelist mint will be set to <b>0.08192 ETH</b></li>
              <li>Public mint will be set to <b>0.1 ETH</b></li>
            </ul>
          </FAQ>
          <FAQ question="What's the mint limit?">
            <ul className="list-disc ml-5">
              <li>Mint limit is 3 per whitelist</li>
              <li>and 2 per public mint</li>
              <li>max. per wallet is 3 (whitelist + public)</li>
            </ul>
          </FAQ>
          <FAQ question="How do I register for the whitelist mint?">
            Go to our website <a href="https://nomummyallowed.com" target="_blank" rel="noreferrer">nomummyallowed.com</a> and click the button “Whitelist my wallet →”.
            This will trigger Metamask's popup asking you to sign (for free) our nonce and send us your verified wallet address that will become eligible for whitelist mint on 22.2.2022.
          </FAQ>
        </dl>
      </div>
      <div className="max-w-4xl mx-auto pb-20">
        <h2 className="text-left font-extrabold text-3xl">Metaverse</h2>
        <dl className="mt-6 max-w-4xl space-y-6 divide-y divide-gray-800">
          <FAQ question="Do you have any plans for the Metaverse(s)?">
            Yes. We'll be starting with <a href="https://www.sandbox.game/">Sandbox</a> as this is the place where we own a land
            at location <a className="text-yellow-500" href="https://www.sandbox.game/en/map/?x=155&y=-138&liteMap=false&currentX=2942&currentY=186&zoom=1" target="_blank" rel="noreferrer">[155,-138]</a><br />
            Referral to help us grow: <a className="text-yellow-500"  href="https://www.sandbox.game/login/?r=BoMO46I3KUR0Hv6.keY5tT" target="_blank" rel="noreferrer">Referal link</a>
          </FAQ>
          <FAQ question="Can I get my 3D avatar for Sandbox?">
            Yes, we're planning to create 3D avatars for our community. At the beginning we'll do voxel avatar that could be used in Sandbox,
            later we'll work on better versions as the Metaverse(s) evolve.
          </FAQ>
        </dl>
      </div>
      <div className="max-w-4xl mx-auto pb-20">
        <h2 className="text-left font-extrabold text-3xl">More questions?</h2>
        <dl className="mt-6 max-w-4xl space-y-6 divide-y divide-gray-800">
          <FAQ question="TLDR version?">
            Read our <a className="text-yellow-500" href="#" target="_blank" rel="noreferrer">Whitepaper</a>.
          </FAQ>
          <FAQ question="Long version?">
            Read our <a className="text-yellow-500" href="https://delightful-octopus-60f.notion.site/NoMA-Wiki-138fcb2696b342589d3ac8131ce7b2f2" target="_blank" rel="noreferrer">Wiki</a>.
          </FAQ>
        </dl>
      </div>
    </section>
  );
}

export default FAQs;
