import { useEffect, useState, useRef, Fragment } from 'react';
import Amplify, { Auth } from 'aws-amplify';
import MetaMaskOnboarding from '@metamask/onboarding';
import { ArrowRightIcon, CalendarIcon, ExclamationCircleIcon } from '@heroicons/react/outline';
import { Dialog, Transition } from '@headlessui/react';
import MummyContract from '../contracts/NoMaClub.json';
import getWeb3 from '../getWeb3';

function MintHome() {
  const [contract, setContract] = useState(null);
  const [myWeb3, setMyWeb3] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const onboarding = useRef(null);
  const getProofEndpointUrl = 'https://iqzau63dx3.execute-api.eu-central-1.amazonaws.com/verify';

  useEffect(() => {
    async function initialize() {
      Amplify.configure({
        Auth: {
          region: 'eu-central-1',
          userPoolId: 'eu-central-1_Jrcnu0Nyl',
          userPoolWebClientId: 'hu64j7h72t09eacjjiglbmh5r',
          authenticationFlowType: 'CUSTOM_AUTH',
        },
      });

      if (!onboarding.current) {
        onboarding.current = new MetaMaskOnboarding();
      }
      const web3 = await getWeb3();
      setMyWeb3(web3);
      console.log('Web3: ', web3);
    }
    initialize();
  }, [contract, myWeb3]);

  const onSignIn = async () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled() && myWeb3) {
      try {
        let acc;
        let instance;
        setLoading(true);
        const networkId = await myWeb3.eth.net.getId();
        if (networkId === 137 || networkId === 80001) {
          // Polygon main or testnet
          const address = '6eb8eC4c24F459A30839A5DFeD88bad925eCDA57';
          instance = new myWeb3.eth.Contract(MummyContract.abi, address);
          acc = await myWeb3.eth.getAccounts();
          setContract(instance);
        } else {
          console.log('Please switch to Polygon network.');
          setError('Please switch to Polygon network.');
          setLoading(false);
        }

        if (acc.length > 0 && instance) {
          const address = acc[0];
          const cognitoUser = await handleAmplifySignIn(address);
          const messageToSign = cognitoUser.challengeParam.message;
          const signature = await window.ethereum.request({
            method: 'personal_sign',
            params: [address, messageToSign],
          });
          await Auth.sendCustomChallengeAnswer(cognitoUser, signature);
          await checkUser(instance, acc[0], myWeb3);
        } else {
          console.log('No address selected.');
          setError('Please select whitelisted address.');
          setLoading(false);
        }
      } catch (err) {
        console.log('Error occured: ', error);
        setError(`Error occured: ${err.message}`);
        setLoading(false);
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
        setError(`Something went wrong: ${err}`);
        setLoading(false);
        throw err;
      }
    }
  };

  const checkUser = async (contract, account, web3) => {
    try {
      const _user = await Auth.currentAuthenticatedUser();

      let verificationResponse = await fetch(getProofEndpointUrl, {
        method: 'GET',
        withCredentials: true,
        headers: new Headers({
          Authorization: _user.signInUserSession.accessToken.jwtToken,
          'Content-Type': 'application/json',
        }),
      });

      let verificationJSON = await verificationResponse.json();
      let proof = verificationJSON['proof'];

      console.log('your proof is:', proof);

      await contract.methods.whitelistMint(proof).send({
        from: account,
        gasLimit: 20000000,
        value: web3.utils.toWei('.05', 'ether'),
      });
      setLoading(false);
    } catch (err) {
      console.error('checkUser error', err);
      setError(`Something went wrong: ${JSON.stringify(err)}`);
      setLoading(false);
    }
  };

  return (
    <section className="relative">
      <Transition.Root show={Boolean(error)} as={Fragment}>
        <Dialog
          as="div"
          open={Boolean(error)}
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={() => setError(null)}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:w-full sm:p-6">
                <div>
                  <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                    <ExclamationCircleIcon className="h-6 w-6 text-red-600" aria-hidden="true" />
                  </div>
                  <div className="mt-3 text-center sm:mt-5">
                    <Dialog.Title as="h3" className="text-lg leading-6 font-medium text-gray-900">
                      Error
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{error}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-5 sm:mt-6">
                  <button
                    type="button"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={() => setError(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="pt-32 md:pt-40">
          {/* Hero content */}
          <div className="md:grid md:grid-cols-12 md:gap-0 lg:gap-0 items-center relative">
            {/* Content */}
            <div className="md:col-span-5 lg:col-span-5 mb-8 md:mb-0 text-center md:text-left sm:pb-12">
              <h1 className="h1 lg:text-5xl mb-8 font-red-hat-display font-extrabold" data-aos="fade-down">
                Mint
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
              <button
                onClick={onSignIn}
                className="text-yellow-300 bg-yellow-300 border-2 border-yellow-300 py-3 px-5 mt-8 text-bold"
                style={{ background: '#0e0e0e' }}
                disabled={loading}
              >
                Mint
                {loading ? (
                  <svg
                    className="animate-spin inline h-5 w-5 ml-3 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                ) : (
                  <ArrowRightIcon className="h-5 w-5 ml-3 inline" />
                )}
              </button>
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

export default MintHome;
