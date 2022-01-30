import React from 'react';
import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/outline';

const faqs = {
  Project: [
    {
      question: 'Why is it called the No Mummy Allowed Gaming Club?',
      answer:
        'The end of the millennium saw the rise of the internet and the birth of many gaming legends. Back then, as teenagers, we were fascinated by this technological advance and could play games late into the night. However, our parents, especially our mothers, had a hard time with it. What will you become? They were scared because they didn’t understand it. Gaming won’t feed you, they said. Go to law school or medical school, secure your future! They were concerned about our well-being, but they were wrong. In just 20 years, the gaming market has grown to nearly $180 billion (2021). Now we stand on the cusp of a similar revolution. The metaverse is coming. And just like our parents 20 years ago, we don’t understand it now, but we study it diligently every day. And we still love gaming beyond the grave and will do our best to guide you through this new fascinating world and show you how to utilize blockchain technology to do what we love. No more career advice from mums :) P.S. We love you!'
    },
    {
      question: 'How is No Mummy Allowed Gaming Club different?',
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
      question: 'When are you launching?',
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
  ],
  NFTs: [
    {
      question: 'How many Mummies are there?',
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
      question: 'How many traits are there?',
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
      question: 'What does ownership get me?',
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
  ],
  Minting: [
    {
      question: 'How much for each mint?',
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
      question: "What's the mint limit?",
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
      question: 'What does ownership get me?',
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
  ],
  Metaverse: [
    {
      question: 'Do you have any plans for the Metaverse?',
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
    {
      question: 'Can I get my 3D avatar for Sandbox?',
      answer:
        "I don't know, but the flag is a big plus. Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas cupiditate laboriosam fugiat.",
    },
  ],
};

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

function FAQ() {
  return (
    <section className="my-20 sm:mx-10">
      {Object.keys(faqs).map((key) => (
        <div className="max-w-4xl mx-auto pb-20" key={key}>
          <h2 className="text-left font-extrabold text-3xl">{key}</h2>
          <dl className="mt-6 max-w-4xl space-y-6 divide-y divide-gray-800">
            {faqs[key].map((faq) => (
              <Disclosure as="div" key={faq.question} className="pt-6">
                {({ open }) => (
                  <>
                    <dt className="text-lg">
                      <Disclosure.Button className="text-left w-full flex justify-between items-start">
                        <span className="font-medium">{faq.question}</span>
                        <span className="ml-6 h-7 flex items-center">
                          <ChevronDownIcon
                            className={classNames(open ? '-rotate-180' : 'rotate-0', 'h-6 w-6 transform')}
                            aria-hidden="true"
                          />
                        </span>
                      </Disclosure.Button>
                    </dt>
                    <Disclosure.Panel as="dd" className="mt-2 pr-12">
                      <p className="text-base text-gray-400">{faq.answer}</p>
                    </Disclosure.Panel>
                  </>
                )}
              </Disclosure>
            ))}
          </dl>
        </div>
      ))}
    </section>
  );
}

export default FAQ;
