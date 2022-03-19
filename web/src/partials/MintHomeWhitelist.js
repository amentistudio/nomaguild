import { useEffect, useState, useRef, useCallback } from "react";
import { useWeb3React } from "@web3-react/core";
import { useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { InjectedConnector } from "@web3-react/injected-connector";
import { ArrowRightIcon } from '@heroicons/react/outline';
import Amplify, { Auth } from 'aws-amplify';
import MetaMaskOnboarding from '@metamask/onboarding';
import NoMAContract from '../contracts/NoMaGuild.json';

const {
  REACT_APP_CONTRACT_ADDRESS,
  REACT_APP_VERIFICATION_HTTP_API_URL
} = process.env;
const injected = new InjectedConnector();


function MintHomeWhitelist() {
  const { active, activate, error, library } = useWeb3React();
  const [quantity, setQuantity] = useState(1);
  const [customError, setCustomError] = useState(null);
  const [user, setUser] = useState(null);
  const onboarding = useRef(null);

  const navigate = useNavigate();

  const onConnectClick = useCallback(() => {
    const _async = async function() {
      try {
        await activate(injected)
      } catch (ex) {
        console.log(ex)
      }
    }
    _async();
  }, [activate]);

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

  async function mint() {
    try {
      const signer = library.getSigner();
      const contract = new ethers.Contract(
        REACT_APP_CONTRACT_ADDRESS,
        NoMAContract.abi,
        signer
      );
      let response = await fetch(REACT_APP_VERIFICATION_HTTP_API_URL + "/verify", {
        method: 'GET',
        headers: {
          'Authorization': user.signInUserSession.accessToken.jwtToken,
          'Content-Type': 'application/json;charset=utf-8'
        }
      });
      const data = await response.json();
      const price = await contract.WHITELIST_PRICE();
      const tx = await contract.whitelistMint(
        data.proof,
        quantity,
        { value: price.mul(quantity), gasLimit: ethers.utils.hexlify(250000) }
      );
      debugger
      await tx.wait(1);
      navigate("/mint-thank-you");
    } catch (err) {
      setCustomError(err.message.toString());
    }
  }

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
        <div className="py-40">
          <div className="text-center relative">
              <h1 className="h1 lg:text-5xl md:text-4xl text-3xl mb-8 font-extrabold" data-aos="fade-down">
                Whitelist Mint
              </h1>
              {error && (<>{error}</>)}
              {customError && (
                <div className="text-red-500 px-10">
                  <div className="text-2xl">Blockchain errr:</div>
                  <>{customError}</>
                </div>
              )}
              {!active && (
                <>
                  <button
                    onClick={onConnectClick}
                    className="text-yellow-300 hover:bg-yellow-300 hover:text-black border-2 border-yellow-300 py-3 px-5 text-bold hover:bg-yellow-300"
                  >
                    Connect wallet
                    <ArrowRightIcon className="h-5 w-5 ml-3 inline" />
                  </button>
                  <strong className="text-sm text-gray-600 block mt-3">Don't forget to unlock your wallet before click the link above!</strong>
                </>
              )}
              {!user && active && (
                <>
                  <button
                    onClick={onSignIn}
                    className="text-yellow-300 hover:bg-yellow-300 hover:text-black border-2 border-yellow-300 py-3 px-5 text-bold hover:bg-yellow-300"
                  >
                    Validate whitelist
                    <ArrowRightIcon className="h-5 w-5 ml-3 inline" />
                  </button>
                  <strong className="text-sm text-gray-600 block mt-3">Don't forget to unlock your wallet before click the link above!</strong>
                </>
              )}
              {user && active && (
                <>
                  <div className="pb-5">You will mint with: {user.username}</div>
                  <h2 className="text-2xl">Quantity</h2>
                  <div className="py-5 flex flex-row justify-center">
                    <button
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                      className="text-2xl text-yellow-300 hover:bg-yellow-300 hover:text-black border-2 border-yellow-300 py-3 px-5 text-bold hover:bg-yellow-300"
                    >
                      -
                    </button>
                    <h1 className="w-24 text-center text-4xl">
                      {quantity}
                    </h1>
                    <button
                      onClick={() => quantity < 3 && setQuantity(quantity + 1)}
                      className="text-2xl text-yellow-300 hover:bg-yellow-300 hover:text-black border-2 border-yellow-300 py-3 px-5 text-bold hover:bg-yellow-300"
                    >
                      +
                    </button>
                  </div>
                  <div className="pt-20">
                    <button
                      onClick={mint}
                      className="text-yellow-300 hover:bg-yellow-300 hover:text-black border-2 border-yellow-300 py-3 px-5 text-bold hover:bg-yellow-300"
                    >
                      Mint
                      <ArrowRightIcon className="h-5 w-5 ml-3 inline" />
                    </button>
                  </div>
                </>
              )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default MintHomeWhitelist;
