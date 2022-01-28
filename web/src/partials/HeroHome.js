import { useEffect, useState, useRef } from 'react';
import Amplify, { Auth } from 'aws-amplify';
import MetaMaskOnboarding from '@metamask/onboarding';
import { ArrowRightIcon, CalendarIcon } from '@heroicons/react/outline';

function HeroHome() {
  const [user, setUser] = useState(null);
  const onboarding = useRef(null);

  useEffect(() => {
    Amplify.configure({
      Auth: {
        region: process.env.REACT_APP_REGION,
        userPoolId: process.env.REACT_APP_USER_POOL_ID,
        userPoolWebClientId: process.env.REACT_APP_USER_POOL_WEB_CLIENT,
        authenticationFlowType: 'CUSTOM_AUTH',
      },
    });

    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  const onSignIn = async () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length > 0) {
        const address = accounts[0];
        const cognitoUser = await handleAmplifySignIn(address);
        const messageToSign = cognitoUser.challengeParam.message;
        const signature = await window.ethereum.request({
          method: 'personal_sign',
          params: [address, messageToSign],
        });
        await Auth.sendCustomChallengeAnswer(cognitoUser, signature);
        await checkUser();
      }
    } else {
      onboarding.current.startOnboarding();
    }
  };

  const getRandomString = (bytes) => {
    const randomValues = new Uint8Array(bytes);
    window.crypto.getRandomValues(randomValues);
    return Array.from(randomValues).map(intToHex).join('');
  };

  const intToHex = (nr) => {
    return nr.toString(16).padStart(2, '0');
  };

  // const onSignOut = async () => {
  //   try {
  //     await Auth.signOut();
  //     await checkUser();
  //   } catch (err) {
  //     console.error('onSignOut error: ', err);
  //   }
  // };

  const handleAmplifySignIn = async (address) => {
    try {
      const cognitoUser = await Auth.signIn(address);
      return cognitoUser;
    } catch (err) {
      /*Cognito doesn't give us a lot of flexibility on error responses
      so we'll have to string match our 'User Not Found' error here
      and create a cognito user with the address as their username if they don't exist*/
      if (err && err.message && err.message.includes('[404]')) {
        const params = {
          username: address,
          password: getRandomString(30),
        };
        await Auth.signUp(params);
        return handleAmplifySignIn(address);
      } else {
        throw err;
      }
    }
  };

  const checkUser = async () => {
    try {
      const _user = await Auth.currentAuthenticatedUser();
      setUser(_user);
      console.log('got user', _user);
    } catch (err) {
      setUser(null);
      console.error('checkUser error', err);
    }
  };

  return (
    <section className="relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 md:pt-40">
          {/* Hero content */}
          <div className="md:grid md:grid-cols-12 md:gap-0 lg:gap-0 items-center relative">
            {/* Content */}
            <div className="md:col-span-5 lg:col-span-5 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
              <h1 className="h1 lg:text-5xl mb-8 font-red-hat-display font-extrabold" data-aos="fade-down">
                No Mummy Allowed Club
              </h1>
              <p className="text-xl text-white" data-aos="fade-down" data-aos-delay="150">
                Welcome to the gaming club for all the people who love games beyond the grave.
                <br />
                <br />
                All (10k) mummies will rise on{' '}
                <span className="whitespace-nowrap">
                  <CalendarIcon className="h-6 w-6 ml-2 mr-2 inline" />
                  22.02.2022
                </span>
              </p>
              {!user && (
                <button
                  onClick={onSignIn}
                  className="text-yellow-300 bg-yellow-300 border-2 border-yellow-300 py-3 px-5 mt-8 text-bold"
                  style={{ background: '#0e0e0e' }}
                >
                  Whitelist my wallet
                  <ArrowRightIcon className="h-5 w-5 ml-3 inline" />
                </button>
              )}
              {user && (
                <button
                  onClick={onSignIn}
                  className="text-yellow-300 bg-yellow-300 border-2 border-yellow-300 py-3 px-5 mt-8 text-bold"
                  style={{ background: '#0e0e0e' }}
                >
                  Already, part of the whitelist! Congratz!
                </button>
              )}
              <p className="mt-2 text-sm">Get on the whitelist to claim your spot!</p>
            </div>

            {/* Mobile mockup */}
            <div
              className="md:col-span-7 lg:col-span-7 place-self-end text-center md:text-right"
              data-aos="fade-up"
              data-aos-delay="450"
            >
              <img src={require('../images/sarcofag.png')} alt="Sarcofag" />
            </div>
          </div>
        </div>
      </div>
      <div className="w-screen absolute" style={{ borderBottom: '1px solid #677016' }}>
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
