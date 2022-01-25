import React from 'react';

import Header from '../partials/Header';
import HeroHome from '../partials/HeroHome';
import GetToKnowUs from '../partials/GetToKnowUs';
import WhoIsThisProjectFor from '../partials/WhoIsThisProjectFor';
import TraitsAndRarity from '../partials/TraitsAndRarity';
import Roadmap from '../partials/Roadmap';
import Team from '../partials/Team';
import FAQHero from '../partials/FAQHero';
import FAQ from '../partials/FAQ';
import Footer from '../partials/Footer';

function Home() {
  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />

      <main className="flex-grow">
        <HeroHome />
        <GetToKnowUs />
        <WhoIsThisProjectFor />
        <TraitsAndRarity />
        <Roadmap />
        <Team />
        <FAQHero />
        <FAQ />
      </main>

      <Footer />
    </div>
  );
}

export default Home;
