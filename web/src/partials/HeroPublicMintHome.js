import { ArrowRightIcon } from '@heroicons/react/outline';

function HeroPublicMintHome () {
  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 md:pt-40">
            <div className="text-center sm:pb-12">
              <h1 className="h1 lg:text-5xl md:text-4xl text-3xl mb-8 text-center font-extrabold" data-aos="fade-down">
                No Mummy Allowed Guild
              </h1>
              <p className="text-xl md:mx-0 mx-10 text-2xl text-white text-center" data-aos="fade-down" data-aos-delay="150">
                NoMA Guild is a community-driven incubator for all indie creators. 
                <br />
                We use the power of Web3 to help new projects get started 🌱
              </p>
              <a
                href="/#/public-mint"
                className="inline-block text-center text-yellow-300 hover:bg-yellow-300 hover:text-black border-2 border-yellow-300 py-3 px-5 mt-8 text-bold hover:bg-yellow-300"
              >
                Slow mint
                <ArrowRightIcon className="h-5 w-5 ml-3 inline" />
              </a>
            </div>

            <div
              className="pt-10 place-self-end text-center md:text-right"
            >
              <img
                className="mx-auto hidden md:block"
                data-aos="fade-up"
                src={require('../images/mumie-web-lg.png')}
                alt="Mummy panel large"
              />
              <img
                className="mx-auto hidden sm:block md:hidden"
                data-aos="fade-up"
                src={require('../images/mumie-web-md.png')}
                alt="Mummy panel middle"
              />
              <img
                className="mx-auto block sm:hidden"
                data-aos="fade-up"
                src={require('../images/mumie-web-xs.png')}
                alt="Mummy panel small"
              />
            </div>
        </div>
      </div>
      <div className="w-screen absolute" style={{ borderBottom: '1px solid #677016', zIndex: -1 }}>
        <div
          className="w-screen absolute"
          style={{
            background: 'transparent linear-gradient(180deg, #0E0E0E 0%, #3DEF2C 100%) 0% 0% no-repeat padding-box',
            opacity: 0.1,
            zIndex: -1,
            width: '100%',
            height: '104px',
            bottom: '0px',
          }}
        ></div>
      </div>
    </section>
  );
}

export default HeroPublicMintHome;
