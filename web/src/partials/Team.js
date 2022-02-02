import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTwitter, faLinkedin, faArtstation, faTumblrSquare } from "@fortawesome/free-brands-svg-icons";

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
          <div className="w-20 h-20 -mt-14 mb-5 rounded-full overflow-hidden">
            <img src={require('../images/team/real/ladi.png')} alt="Ladi" className="w-full h-full object-cover" />
          </div>
          <h3 className="h3 sm:text-xl sm:text-center md:text-left mb-2 font-red-hat-display font-extrabold" data-aos="fade-down">
            Ladi / Developer
          </h3>
          <p className="text-gray-400 sm:text-center sm:mx-20 md:text-left md:mx-0">
            With over 20 years of programming experience, I am fascinated by Metaverse worlds and blockchain technology.
          </p>
        </div>
        <div className="col-span-3 text-left">
          <img className="mb-4 sm:mx-auto md:mx-0" src={require('../images/team/mummy-jan.png')} alt="Jan - Design" />
          <div className="w-20 h-20 -mt-14 mb-5 rounded-full overflow-hidden">
            <img src={require('../images/team/real/jan.png')} alt="Jan" className="w-full h-full object-cover" />
          </div>
          <h3 className="h3 sm:text-xl sm:text-center md:text-left mb-2 font-red-hat-display font-extrabold" data-aos="fade-down">
            Jan / Design
          </h3>
          <p className="text-gray-400 sm:text-center sm:mx-20 md:text-left md:mx-0">
            After twelve years of working as a freelance designer, I have gathered enough experience to embark on my own projects.
          </p>
        </div>
        <div className="col-span-3 text-left">
          <img className="mb-4 sm:mx-auto md:mx-0" src={require('../images/team/mummy-simon.png')} alt="Šimon - Illustrator" />
          <div className="w-20 h-20 -mt-14 mb-5 rounded-full overflow-hidden">
            <img src={require('../images/team/real/simon.png')} alt="Simon" className="w-full h-full object-cover" />
          </div>
          <h3 className="h3 sm:text-xl sm:text-center md:text-left mb-2 font-red-hat-display font-extrabold" data-aos="fade-down">
            Simon / Illustrator
          </h3>
          <p className="text-gray-400 sm:text-center sm:mx-20 md:text-left md:mx-0">
            An athlete in body and a geek in soul. A young gun on our team with great illustrations. My goal is to become a top notch concept artist.
          </p>
        </div>
        <div className="col-span-3 text-left">
          <img className="mb-4 sm:mx-auto md:mx-0" src={require('../images/team/mummy-guide.png')} alt="Mummy Boy - Guide" />
          <div className="w-20 h-20 -mt-14 mb-5 rounded-full overflow-hidden bg-white">
            <img src={require('../images/team/real/mummy.png')} alt="Jan" className="w-full h-full object-cover" />
          </div>
          <h3 className="h3 sm:text-xl sm:text-center md:text-left mb-2 font-red-hat-display font-extrabold" data-aos="fade-down">
            Mummy Boy / Guide
          </h3>
          <p className="text-gray-400 sm:text-center sm:mx-20 md:text-left md:mx-0">
            Every great project needs a mascot. Mummy boy will be your guide in the fascinating and constantly evolving world of the Metaverse.
          </p>
        </div>
      </div>

      <div className="md:grid md:grid-cols-12 gap-6">
        <div className="col-span-3 text-left sm:mb-10 md:mb-0">
          <p className="text-gray-600 mt-5 text-2xl">
            <a href="https://www.linkedin.com/in/martincik/" target="_blank" rel="noreferrer" className="pr-2">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
            <a href="https://twitter.com/martincik" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
          </p>
        </div>
        <div className="col-span-3 text-left sm:mb-10 md:mb-0">
          <p className="text-gray-600 mt-5 text-2xl">
            <a href="https://www.linkedin.com/in/jan-brat%C4%8Denkov-4a11011b5/" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </p>
        </div>
        <div className="col-span-3 text-left sm:mb-10 md:mb-0">
          <p className="text-gray-600 mt-5 text-2xl">
            <a href="https://www.artstation.com/imonbouzek" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faArtstation} />
            </a>
          </p>
        </div>
      </div>

      <div className="md:grid md:grid-cols-12 gap-6 mt-20">
        <div className="col-span-2 text-center sm:mb-10 md:mb-0">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto">
            <img src={require('../images/team/real/marek.png')} alt="Marek" className="w-full h-full object-cover" />
          </div>
          <h3 className="h3 sm:text-xl text-center mt-2 font-red-hat-display font-bold" data-aos="fade-down">
            Marek
          </h3>
          <p>Developer</p>
        </div>
        <div className="col-span-2 text-center sm:mb-10 md:mb-0">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto">
            <img src={require('../images/team/real/kristyna.png')} alt="Kristyna" className="w-full h-full object-cover" />
          </div>
          <h3 className="h3 sm:text-xl text-center mt-2 font-red-hat-display font-bold" data-aos="fade-down">
            Kristyna
          </h3>
          <p>Concept Art</p>
        </div>
        <div className="col-span-2 text-center sm:mb-10 md:mb-0">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto">
            <img src={require('../images/team/real/tomas.png')} alt="Tomas" className="w-full h-full object-cover" />
          </div>
          <h3 className="h3 sm:text-xl text-center mt-2 font-red-hat-display font-bold" data-aos="fade-down">
            Tomas
          </h3>
          <p>Music</p>
        </div>
        <div className="col-span-2 text-center sm:mb-10 md:mb-0">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto">
            <img src={require('../images/team/real/honza.png')} alt="Honza" className="w-full h-full object-cover" />
          </div>
          <h3 className="h3 sm:text-xl text-center mt-2 font-red-hat-display font-bold" data-aos="fade-down">
            Honza
          </h3>
          <p>SFX</p>
        </div>
        <div className="col-span-2 text-center sm:mb-10 md:mb-0">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto">
            <img src={require('../images/team/real/lukas.png')} alt="Lukas" className="w-full h-full object-cover" />
          </div>
          <h3 className="h3 sm:text-xl text-center mt-2 font-red-hat-display font-bold" data-aos="fade-down">
            Lukas
          </h3>
          <p>3D &amp; VFX</p>
        </div>
        <div className="col-span-2 text-center sm:mb-10 md:mb-0">
          <div className="w-20 h-20 rounded-full overflow-hidden mx-auto">
            <img src={require('../images/team/real/davidtomas.png')} alt="David Tomas" className="w-full h-full object-cover" />
          </div>
          <h3 className="h3 sm:text-xl text-center mt-2 font-red-hat-display font-bold" data-aos="fade-down">
            David Tomas
          </h3>
          <p>Game Design</p>
        </div>
      </div>

      <div className="md:grid md:grid-cols-12 gap-6">
        <div className="col-span-2 text-center sm:mb-10 md:mb-0">
          <p className="text-gray-600 mt-5 text-2xl">
            <a href="https://www.linkedin.com/in/marek-karaba-2bb06b1b7" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </p>
        </div>
        <div className="col-span-2 text-center sm:mb-10 md:mb-0">
          <p className="text-gray-600 mt-5 text-2xl">
            <a href="https://www.artstation.com/kristnakazdov" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faArtstation} />
            </a>
          </p>
        </div>
        <div className="col-span-2 text-center sm:mb-10 md:mb-0">
          <p className="text-gray-600 mt-5 text-2xl">
            <a href="https://www.linkedin.com/in/tomasoliva1" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faLinkedin} />
            </a>
          </p>
        </div>
        <div className="col-span-2 text-center sm:mb-10 md:mb-0">
          <p className="text-gray-600 mt-5 text-2xl">
            <a href="https://discofield.com" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faTumblrSquare} />
            </a>
          </p>
        </div>
        <div className="col-span-2 text-center sm:mb-10 md:mb-0">
          <p className="text-gray-600 mt-5 text-2xl">
            <a href="https://www.artstation.com/dosal" target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={faArtstation} />
            </a>
          </p>
        </div>
        <div className="col-span-2 text-center sm:mb-10 md:mb-0">
          <p className="text-gray-600 mt-5 text-2xl">
          </p>
        </div>
      </div>

    </section>
  );
}

export default Team;
