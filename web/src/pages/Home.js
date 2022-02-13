import React from 'react';

import Header from '../partials/Header';
import HeroDiscordHome from '../partials/HeroDiscordHome';
import GetToKnowUs from '../partials/GetToKnowUs';
import Newsletter from '../partials/Newsletter';
import WhoIsThisProjectFor from '../partials/WhoIsThisProjectFor';
import TraitsAndRarity from '../partials/TraitsAndRarity';
import Roadmap from '../partials/Roadmap';
import Team from '../partials/Team';
import FAQHero from '../partials/FAQHero';
import FAQs from '../partials/FAQs';
import Footer from '../partials/Footer';

function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow">
        <HeroDiscordHome />
        <GetToKnowUs />
        <Newsletter />
        <WhoIsThisProjectFor />
        <TraitsAndRarity />
        <Roadmap />
        <Team />
        <FAQHero />
        <FAQs />
      </main>

      <Footer />
    </div>
  );
}

export default Home;
