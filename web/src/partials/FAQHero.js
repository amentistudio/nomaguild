import React from 'react';

function FAQHero() {
  return (
    <section
      className="mt-20"
      style={{
        height: 660,
        background: `top center url(${require('../images/press-conference-concept-II.png')}) no-repeat`,
      }}
    >
      <div className="max-w-5xl mx-auto px-4">
        <div className="pt-8"></div>
        <h1 className="h1 lg:text-5xl mb-8 text-center font-red-hat-display font-extrabold" data-aos="fade-down">
          FAQ
        </h1>
        <div className="pl-20 text-xl text-white text-center">
          If you are interested in something else, please join our&nbsp;
          <a className="underline text-yellow-300" href="https://discord.gg/qJDaaYBAkF">
            Discord
          </a>
          .
        </div>
      </div>
    </section>
  );
}

export default FAQHero;
