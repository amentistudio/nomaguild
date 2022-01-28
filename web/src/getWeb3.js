import { ethers } from "ethers";

const getWeb3 = () =>
  new Promise((resolve, reject) => {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    window.addEventListener('load', async () => {
      // Modern dapp browsers...
      if (window.ethereum) {
        const web3 = new ethers.providers.Web3Provider(window.ethereum)
        try {
          // Request account access if needed
          await web3.eth.getAccounts();
          // Accounts now exposed
          resolve(web3);
        } catch (error) {
          reject(error);
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        // Use Mist/MetaMask's provider.
        const web3 = window.web3;
        console.log('Injected web3 detected.');
        resolve(web3);
      }
      // Fallback to localhost; use dev console port by default...
      else {
        const web3 = new ethers.providers.UrlJsonRpcProvider('http://127.0.0.1:8545')
        console.log('No web3 instance injected, using Local web3.');
        resolve(web3);
      }
    });
  });

export default getWeb3;
