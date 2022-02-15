import { ArrowRightIcon } from '@heroicons/react/outline';

function HeroHome() {
  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 md:pt-40">
          {/* Hero content */}
          <div className="md:grid md:grid-cols-12 md:gap-0 lg:gap-0 items-center relative">
            {/* Content */}
            <div className="md:col-span-6 lg:col-span-6 mb-8 text-center md:text-left sm:pb-12">
              <h1 className="h1 lg:text-5xl md:text-4xl text-3xl mb-8 font-extrabold" data-aos="fade-down">
                Welcome to the NoMA club
              </h1>
              <p className="text-xl md:mx-0 mx-10 text-white" data-aos="fade-down" data-aos-delay="150">
                No Mummy Allowed is a club for all the people who love games beyond the grave.
                <br />
                <br />
                We are on the mission to create a community-owned studio that allows players to become investors and decision-makers in the games they want to play or experiences they want to have.
                <br />
                <br />
                To get early access:
              </p>
              <a
                target="_blank" rel="noreferrer" 
                href="https://discord.gg/MzBjpdgxfu"
                className="inline-block text-yellow-300 hover:bg-yellow-300 hover:text-black border-2 border-yellow-300 py-3 px-5 mt-8 text-bold hover:bg-yellow-300"
              >
                Join our Discord
                <ArrowRightIcon className="h-5 w-5 ml-3 inline" />
              </a>
            </div>

            <div
              className="pt-20 md:col-span-6 lg:col-span-6 place-self-end text-center md:text-right"
            >
              <img src={require('../images/sarcofag.png')} alt="Sarcofag" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-screen absolute z-10" style={{ borderBottom: '1px solid #677016' }}>
        <div
          className="w-screen absolute"
          style={{
            background: 'transparent linear-gradient(180deg, #0E0E0E 0%, #3DEF2C 100%) 0% 0% no-repeat padding-box',
            opacity: 0.1,
            width: '100%',
            height: '104px',
            bottom: '0px',
          }}
        ></div>
      </div>
    </section>
  );
}

export default HeroHome;
