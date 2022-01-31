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
        <h1 className="h1 lg:text-5xl md:text-4xl sm:text-3xl mb-8 text-center font-red-hat-display font-extrabold" data-aos="fade-down">
          FAQ
        </h1>
        <div className="pl-20 text-xl text-white text-center">
          If you have any questions, please follow and DM us on &nbsp;
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
