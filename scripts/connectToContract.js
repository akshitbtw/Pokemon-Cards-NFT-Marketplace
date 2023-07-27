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
  // console.log('Contract address:', contract.options.address);

  // Return the contract instance
  return contract;
}
export const contractPromise = connectToContract();
export { web3js };