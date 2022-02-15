import { useEffect, useState, useRef } from 'react';
import Amplify, { Auth } from 'aws-amplify';
import MetaMaskOnboarding from '@metamask/onboarding';
import { ArrowRightIcon, CheckCircleIcon, PlayIcon } from '@heroicons/react/outline';

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
      <div className="max-w-3xl mx-auto mt-10">
        <div className="pt-40">
          <div className="text-center relative">
              <h1 className="h1 lg:text-5xl md:text-4xl text-3xl mb-8 font-extrabold" data-aos="fade-down">
                Whitelist your wallet
              </h1>
              <p className="text-2xl md:mx-0 mx-12 text-white" data-aos="fade-down" data-aos-delay="150">
                Whitelisting will require you to have <a 
                  target="_blank" rel="noreferrer" 
                  href="https://www.youtube.com/watch?v=Af_lQ1zUnoM"
                  className="text-yellow-300"
                ><PlayIcon className="h-8 w-8 mr-1 inline" />Metamask</a> installed connnected to "Ethereum Mainnet".
                <br />
              </p>
              <p className="text-2xl md:mx-0 mt-14 mb-6 text-white" data-aos="fade-down" data-aos-delay="150">
                <strong className="text-yellow-300">Benefits of whitelisting:</strong>
                <ul>
                  <li><CheckCircleIcon className="text-green-300 h-6 w-6 mr-2 inline" />Half the price of public mint 0.04196 ETH.</li>
                  <li><CheckCircleIcon className="text-green-300 h-6 w-6 mr-2 inline" />Avoid gas wars.</li>
                  <li><CheckCircleIcon className="text-green-300 h-6 w-6 mr-2 inline" />Be on the OG list for future airdrops.</li>
                </ul>
                <br />
                <br />
              </p>
              <p className="text-2xl mb-5">
                Click the link bellow and follow the steps in Metamask: <br />
              </p>
              {!user && (
                <>
                  <button
                    onClick={onSignIn}
                    className="text-yellow-300 hover:bg-yellow-300 hover:text-black border-2 border-yellow-300 py-3 px-5 text-bold hover:bg-yellow-300"
                  >
                    Whitelist my wallet
                    <ArrowRightIcon className="h-5 w-5 ml-3 inline" />
                  </button>
                  <strong className="text-sm text-gray-600 block mt-3">Don't forget to unlock your Metamask before click the link above!</strong>
                </>
              )}
              {user && (
                <div
                  className="text-yellow-300 bg-black-300 border-2 border-yellow-300 py-3 px-5 text-bold"
                >
                  Successfully added to our whitelist!
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default HeroHome;
