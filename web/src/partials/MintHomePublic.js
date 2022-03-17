import { useCallback, useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from 'ethers';
import { InjectedConnector } from "@web3-react/injected-connector";
import { ArrowRightIcon } from '@heroicons/react/outline';
import NoMAContract from '../contracts/NoMaGuild.json';

const { REACT_APP_CONTRACT_ADDRESS } = process.env;
const injected = new InjectedConnector();

async function connect(activate) {
  try {
    await activate(injected)
  } catch (ex) {
    console.log(ex)
  }
}

function MintHomePublic() {
  const { active, activate, account, error, library } = useWeb3React();
  const [quantity, setQuantity] = useState(1);
  const [customError, setCustomError] = useState(null);

  useEffect(() => {
    async function wconnect() {
      await connect();
    }
    wconnect();
  }, [])

  const onConnectClick = useCallback(() => {
    connect(activate);
  }, [activate]);

  async function mint() {
    try {
      const signer = library.getSigner();
      const contract = new ethers.Contract(
        REACT_APP_CONTRACT_ADDRESS,
        NoMAContract.abi,
        signer
      );
      console.log(contract);
      const price = await contract.PUBLIC_PRICE();
      const tx = await contract.publicMint(quantity, { value: price.mul(quantity), gasLimit: ethers.utils.hexlify(250000) });
      console.log("Transaction: ", tx);
      console.log("Waiting for confirmations...");
      await tx.wait(1);
      console.log("Done.");
    } catch (err) {
      setCustomError(err.message.toString());
    }
  }

  return (
    <section className="relative">
      <div className="max-w-3xl mx-auto mt-10">
        <div className="py-40">
          <div className="text-center relative">
              <h1 className="h1 lg:text-5xl md:text-4xl text-3xl mb-8 font-extrabold" data-aos="fade-down">
                Public Mint
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
              {account && (
                <>
                  <div className="pb-5">You will mint with: {account}</div>
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

export default MintHomePublic;
