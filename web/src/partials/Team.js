import React from 'react';

function Team() {
  return (
    <section className="max-w-6xl mx-auto px-10 pb-20">
      <div className="pt-20"></div>
      <h5 className="h5 mb-4 font-bold text-yellow-300 md:text-left sm:text-center">WHO IS BEHIND THIS PROJECT?</h5>
      <h1 className="h1 lg:text-5xl md:text-4xl sm:text-center md:text-left sm:text-3xl mb-8 font-red-hat-display font-extrabold" data-aos="fade-down">
        Team
      </h1>
      <div className="md:grid md:grid-cols-12 gap-6">
        <div className="col-span-3 text-left sm:mb-10 md:mb-0">
          <img className="mb-4 sm:mx-auto md:mx-0" src={require('../images/team/mummy-ladi.png')} alt="Ladi / Developer" />
          <h3 className="h3 sm:text-xl sm:text-center md:text-left mb-2 font-red-hat-display font-extrabold" data-aos="fade-down">
            Ladi / Developer
          </h3>
          <p className="text-gray-400 sm:text-center sm:mx-20 md:text-left md:mx-0">
            With over 20 years of programming experience, I am fascinated by Metaverse worlds and blockchain technology.
          </p>
        </div>
        <div className="col-span-3 text-left">
          <img className="mb-4 sm:mx-auto md:mx-0" src={require('../images/team/mummy-jan.png')} alt="Jan - Design" />
          <h3 className="h3 sm:text-xl sm:text-center md:text-left mb-2 font-red-hat-display font-extrabold" data-aos="fade-down">
            Jan / Design
          </h3>
          <p className="text-gray-400 sm:text-center sm:mx-20 md:text-left md:mx-0">
            After twelve years of working as a freelance designer, I have gathered enough experience to embark on my own projects.
          </p>
        </div>
        <div className="col-span-3 text-left">
          <img className="mb-4 sm:mx-auto md:mx-0" src={require('../images/team/mummy-simon.png')} alt="Šimon - Illustrator" />
          <h3 className="h3 sm:text-xl sm:text-center md:text-left mb-2 font-red-hat-display font-extrabold" data-aos="fade-down">
            Simon / Illustrator
          </h3>
          <p className="text-gray-400 sm:text-center sm:mx-20 md:text-left md:mx-0">
            An athlete in body and a geek in soul. A young gun on our team with great illustrations. My goal is to become a top notch concept artist.
          </p>
        </div>
        <div className="col-span-3 text-left">
          <img className="mb-4 sm:mx-auto md:mx-0" src={require('../images/team/mummy-guide.png')} alt="Mummy Boy - Guide" />
          <h3 className="h3 sm:text-xl sm:text-center md:text-left mb-2 font-red-hat-display font-extrabold" data-aos="fade-down">
            Mummy Boy / Guide
          </h3>
          <p className="text-gray-400 sm:text-center sm:mx-20 md:text-left md:mx-0">
            Every great project needs a mascot. Mummy boy will be your guide in the fascinating and constantly evolving world of the Metaverse.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Team;
