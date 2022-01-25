import React from 'react';

function Team() {
  return (
    <section className="max-w-6xl mx-auto px-10 pb-20">
      <div className="pt-20"></div>
      <h5 className="h5 mb-4 font-bold text-yellow-300">WHO IS BEHIND THIS PROJECT?</h5>
      <h1 className="h1 lg:text-5xl mb-8 font-red-hat-display font-extrabold" data-aos="fade-down">
        Team and expertise
      </h1>
      <div className="md:grid md:grid-cols-12 gap-6">
        <div className="col-span-3 text-left">
          <img className="mb-4" src={require('../images/team/amenti-a-web.png').default} alt="Amenti Studio Team" />
          <h3 className="h3 lg:text-xl mb-2 font-red-hat-display font-extrabold" data-aos="fade-down">
            Amenti Studio
          </h3>
          <p>
            We are currently working on our first game - The Book of Aaru. We are looking for ways to secure stable
            funding and work on the game full-time.
          </p>
        </div>
        <div className="col-span-3 text-left">
          <img className="mb-4" src={require('../images/team/mummy-ladi.png').default} alt="Ladi / Developer" />
          <h3 className="h3 lg:text-xl mb-2 font-red-hat-display font-extrabold" data-aos="fade-down">
            Ladi / Developer
          </h3>
          <p>
            With over 20 years of programming experience, I am fulfilling my dream and working on my own RPG game. I am
            fascinated by Metaverse worlds and blockchain technology.
          </p>
        </div>
        <div className="col-span-3 text-left">
          <img className="mb-4" src={require('../images/team/mummy-jan.png').default} alt="Jan - Design" />
          <h3 className="h3 lg:text-xl mb-2 font-red-hat-display font-extrabold" data-aos="fade-down">
            Jan / Design
          </h3>
          <p>
            After twelve years of working as a designer, I have gathered enough courage and experience to finally embark
            on my own projects and be an inspiration to my two sons.
          </p>
        </div>
        <div className="col-span-3 text-left">
          <img className="mb-4" src={require('../images/team/mummy-simon.png').default} alt="Šimon - Illustrator" />
          <h3 className="h3 lg:text-xl mb-2 font-red-hat-display" data-aos="fade-down">
            Simon / Illustrator
          </h3>
          <p>
            An athlete in body and a geek in soul. A young gun on our team with great illustrations and marketing ideas.
            My goal is to become a top concept artist for AAA game titles.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Team;
