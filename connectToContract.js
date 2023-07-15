import { contractAddress, contractABI } from './contractInfo.js';
import Web3 from 'web3/dist/web3.min.js';

let contract;
let web3js;

async function connectToContract() {
  // Create a new instance of the Web3 library
  web3js = new Web3(window.ethereum);

  // Connect to the contract using the contract ABI and address
  contract = new web3js.eth.Contract(contractABI, contractAddress);

  console.log('Contract instance created successfully');
  console.log('Contract address:', contract.options.address);

  // Return the contract instance
  return contract;
}
export const contractPromise = connectToContract();
export { web3js };


















// document.addEventListener("DOMContentLoaded", () => {
//   let web3js; let account;
//   window.addEventListener('load', function () {
//     // Checking if Web3 has been injected by the browser (Mist/MetaMask)
//     if (typeof web3 !== 'undefined') {
//       // Use Mist/MetaMask's provider
//       web3js = new Web3(window.ethereum);
//     } else {
//       alert("Please Install MetaMask");
//     }

//     // Now you can start your app & access web3js freely:
//     connectToContract();
//   });

//   function connectToContract() {
//     contract = new web3js.eth.Contract(contractABI, contractAddress);
//     if (contract) {
//       // Contract instantiation successful
//       console.log('Contract instance created successfully');
//       console.log('Contract address:', contract.options.address);
//       // console.log(account);
//       // contract.methods.getOwnedTokensMetadata('address').call()
//       //   .then(result => {
//       //     console.log('View function result:', result);
//       //   })
//       //   .catch(error => {
//       //     console.error('Error calling view function:', error);
//       //   });
//     } else {
//       // Contract instantiation failed
//       console.error('Failed to create contract instance');
//     }
//   }

//   async function createToken(ipfsUrl) {
//     if (typeof web3js === 'undefined') {
//       console.error('web3js is not defined');
//       return;
//     }

//     try {
//       const result = await contract.methods.createToken(ipfsUrl).send({ from: 'address' });
//       console.log('Token created successfully:', result.transactionHash);
//     } catch (error) {
//       console.error('Error creating token:', error);
//     }
//   };
// });
// export {contract};