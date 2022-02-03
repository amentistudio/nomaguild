import React from 'react';

function FAQHero() {
  return (
    <section
      className="mt-20"
      style={{
        height: 660,
        background: `top center url(${require('../images/noma-press-final.jpg')}) no-repeat`,
      }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="pt-8"></div>
        <h1 className="h1 lg:text-5xl md:text-4xl text-3xl mb-8 text-center font-red-hat-display font-extrabold" data-aos="fade-down">
          FAQ
        </h1>
        <div className="mx-10 text-xl text-white text-center">
          If FAQ is not helpful, please read our <a className="underline text-yellow-300" target="_blank" rel="noreferrer" href="https://nomaclub-public.s3.eu-central-1.amazonaws.com/NoMa-whitepaper-web.pdf">Whitepaper</a> plus visit our <a className="underline text-yellow-300" target="_blank" rel="noreferrer" href="https://delightful-octopus-60f.notion.site/NoMA-Wiki-138fcb2696b342589d3ac8131ce7b2f2">Wiki</a> or DM us on &nbsp;
          <a className="underline text-yellow-300" href="https://twitter.com/nomaclub">
            Twitter
          </a>
          .
        </div>
      </div>
    </section>
  );
}

export default FAQHero;
