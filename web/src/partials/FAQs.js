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
          <FAQ question="Why is it called the No Mummy Allowed Guild?">
            Twenty years ago, we told mums we wanted to make a living in the game industry.
            <br />
            They told us we were crazy and sent us to law school. And now, the gaming scene is one of the fastest-growing industries.
            <br />
            Don't take career advice from your mums! Join the No Mummy Allowed Guild and fulfill your dreams.
            <br />
            8192 mummies are waiting to support you.
            <br />
            P.S. During the creation of the project, we did not hurt the feelings of a single mummy. We love you!
          </FAQ>
          <FAQ question="How is No Mummy Allowed Guild different?">
            <ul className="list-disc ml-5">
              <li>We are not starting from 0. We already have an initial capital of $200,000.</li>
              <li>We are a fully doxxed team.</li>
              <li>We will not spend the mint money or royalties. We will invest it and increase our capital to fund community projects.</li>
              <li>We are doers with a passion for games and Web3.</li>
              <li>Read our Whitepaper to get all the information.</li>
            </ul>
          </FAQ>
          <FAQ question="When are you launching?">
            <ul className="list-disc ml-5">
              <li>Whitelist mint will be on 03/21/2022, followed by the public mint.</li>
            </ul>
          </FAQ>
          <FAQ question="Where do I contact you?">
            <ul className="list-disc ml-5">
              <li>We're all on our <a target="_blank" rel="noreferrer" className="underline" href="https://discord.gg/MzBjpdgxfu">Discord</a> or you can write us email at: <a className="underline" href="mailto:ladi@amentistudio.com">ladi@amentistudio.com</a></li>
            </ul>
          </FAQ>
        </dl>
      </div>
      <div className="max-w-4xl mx-auto pb-20">
        <h2 className="text-left font-extrabold text-3xl">NFTs</h2>
        <dl className="mt-6 max-w-4xl space-y-6 divide-y divide-gray-800">
          <FAQ question="How many Mummies are there?">
            2^13 aka 8192. We're going to keep 192 for our purposes, such as marketing and giveaways.
            The rest will be available for mint. Whitelist mint is Ξ0.04196, Public mint will follow for Ξ0.08192.
          </FAQ>
          <FAQ question="How many traits are there?">
            We have 191 traits in 7 categories (accessories, background, clothes, head, mouth, skin)  and every single mummy has a unique name.
            Visit page <a target="_blank" rel="noreferrer" className="underline" href="https://delightful-octopus-60f.notion.site/NFTs-2880016a487141709cd8bf839d9ce80c">NFTs</a> for more details.
          </FAQ>
          <FAQ question="What does ownership get me?">
            <ul className="list-disc ml-5">
              <li>Exclusive membership in the NoMA community.</li>
              <li>VIP access to all NoMA products.</li>
              <li>Merch</li>
              <li>You can propose a new project you want to fund.</li>
              <li>Access to our Land in Sandbox to create your Web3 experiences.</li>
              <li>You will be able to choose if you want to participate in the leadership of the NoMA DAO.</li>
            </ul>
          </FAQ>
        </dl>
      </div>
      <div className="max-w-4xl mx-auto pb-20">
        <h2 className="text-left font-extrabold text-3xl">Minting</h2>
        <dl className="mt-6 max-w-4xl space-y-6 divide-y divide-gray-800">
          <FAQ question="How much for each mint?">
            <ul className="list-disc ml-5">
              <li>Whitelist mint will be set to <b>Ξ0.04196</b></li>
              <li>Public mint will be set to <b>Ξ0.08192</b></li>
            </ul>
          </FAQ>
          <FAQ question="What's the mint limit?">
            <ul className="list-disc ml-5">
              <li>Mint limit is 3 per wallet</li>
            </ul>
          </FAQ>
          <FAQ question="How do I register for the whitelist mint?">
            Go to our website <a className="underline" href="https://nomaguild.com" target="_blank" rel="noreferrer">nomaguild.com</a> and click the “Join our Discord →” button. 
            We'll be sharing the whitelist link on our Discord.
          </FAQ>
        </dl>
      </div>
    </section>
  );
}

export default FAQs;
