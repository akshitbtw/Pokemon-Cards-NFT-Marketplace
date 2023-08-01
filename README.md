# POKEMON CARDS NFT MARKETPLACE

POKEMON CARDS NFT MARKETPLACE is a decentralized application (DApp) that enables users to participate in auctions for Pokémon cards represented as Non-Fungible Tokens (NFTs). The project is built on the Ethereum blockchain using smart contracts and leverages various technologies and tools to achieve its functionalities.

## Features

- Only the admin can create new NFT tokens representing Pokémon cards.
- Users can bid on Pokémon card NFTs in auctions.
- The admin can mint new NFT tokens for new Pokémon cards.
- The admin can start and end auctions for specific Pokémon card NFTs.
- At the end of an auction, the NFT is transferred to the highest bidder.
- Participants who did not win the auction can withdraw their bids.

## Technologies Used

The project utilizes the following technologies and tools:

- **HTML**: For the basic structure of the user interface.
- **CSS & Bootstrap CSS**: For styling and responsiveness of the DApp.
- **JavaScript**: To implement the frontend functionalities and interactions.
- **NFT.Storage API**: To upload metadata information and card images to a decentralized storage solution.
- **Solidity**: To write the smart contracts governing the NFT creation, auction, and transfer logic.
- **Web3.js**: To interact with the Ethereum blockchain and smart contracts from the frontend.
- **Remix IDE**: For testing and debugging the smart contracts.
- **Hardhat**: To deploy the smart contracts on the Ganache local blockchain environment.
- **Ganache**: To set up and manage the local blockchain environment for development and testing.
- **Vite and Node.js**: To build and run the frontend application.
- **Dotenv**: To store the private key and provider URL securely.

## Prerequisites

Before running the POKEMON CARDS NFT MARKETPLACE, you need to have the following installed:

- Node.js
- Ganache
- MetaMask Ethereum wallet extension in your browser.

## Getting Started

1. Clone the repository and navigate to the project directory.
```bash
git clone https://github.com/akshitbtw/pokemon-cards-nft-marketplace.git
cd pokemon-cards-nft-marketplace 
```
2. Install the required dependencies by running:
```bash
npm install 
```
3. Set up a `.env` file in the root directory and store your private key and provider URL like this:
```bash
PRIVATE_KEY=your_private_key_here
PROVIDER_URL=your_provider_url_here
```
Replace `your_private_key_here` with the private key of the admin's Ethereum wallet and `your_provider_url_here` with the URL of your chosen Ethereum provider (e.g., Infura).

4. Deploy the smart contracts using Hardhat and Ganache:
```bash
npx hardhat run scripts/deploy.js --network localhost # Deploys the smart contracts
```
5. Launch the frontend application:
```bash
npm run dev 
```
6. Open your browser and access the application at `http://localhost:<PORT_NUMBER>`.

## Usage and Screenshots

### Admin (NFT Creator):

1. Minting NFTs:
   - As an admin, you can mint new NFTs by navigating to the "Create NFT" section under the admin panel.
   - Fill in the required details in the form shown there, such as card attributes, image.
   - Click the "Create NFT" button to create a new Pokémon card NFT.
   
   ![Minting NFTs](https://github.com/akshitbtw/Pokemon-Cards-NFT-Marketplace/assets/83155183/34d0826d-4770-4d5a-b537-76b685e4a839)

2. Starting an Auction:
   - To start an auction for a specific Pokémon card NFT, go to the "Start/End Auction" section under the admin panel.
   - Find the card you want to auction and click the "Start Auction" button below it.
   ![Starting an Auction](https://github.com/akshitbtw/Pokemon-Cards-NFT-Marketplace/assets/83155183/77a4a1d2-3695-40bd-8e91-e96468a67a2b)

3. Ending an Auction:
   - Admin can manually end an ongoing auction after its timer expires.
   - Go to the "Start/End Auction" section under the admin panel.
   - Find the card and click the "End Auction" button below it.
   
   ![Ending an Auction](https://github.com/akshitbtw/Pokemon-Cards-NFT-Marketplace/assets/83155183/ddf6217a-5a04-4110-aa3f-47615f7e029a)

### Users:

1. Bidding on Auctions:
   - Users can bid on the auctions shown on the homepage.
   - Enter your bid amount in the input field next to the Pokémon card NFT you want to bid on.
   - Click the "Place Bid" button to submit your bid.
   
   ![Bidding on Auctions](https://github.com/akshitbtw/Pokemon-Cards-NFT-Marketplace/assets/83155183/d534e546-a4d8-43a9-89d8-7bc38da1f072)

   ![Bidding on Auctions_Card_Details](https://github.com/akshitbtw/Pokemon-Cards-NFT-Marketplace/assets/83155183/fe36cb17-4f33-4308-9642-197412492439)

3. Winning an Auction:
   - If you place the highest bid on an auction and the timer expires, the NFT will be automatically transferred to your Ethereum wallet.
   - You can see the NFT you won in the "My NFTs" section.
   
   ![Winning an Auction](https://github.com/akshitbtw/Pokemon-Cards-NFT-Marketplace/assets/83155183/e5374b5f-2c96-4911-83b9-04964ee97f86)
   
4. Withdrawing Bids:
   - If you don't win an auction, you can withdraw the bidded amount.
   - Go to the "Withdraw" section and find the card and click the "Withdraw" button below it to get back your bid amount.
   
   ![Withdrawing Bids](https://github.com/akshitbtw/Pokemon-Cards-NFT-Marketplace/assets/83155183/2371f95b-cdb0-4f00-b09a-6c45c99b00b9)

### All Listings Webpage:

1. To view all the Pokémon card NFTs available on the website, visit the "All Listings" webpage.
2. Each NFT card, along with its attributes, image, and the owner's wallet address, will be displayed on this page.

   ![All_Listings](https://github.com/akshitbtw/Pokemon-Cards-NFT-Marketplace/assets/83155183/092d8e46-ae6c-4767-ba4c-e90229d81913)
