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

   ![Minting NFTs](https://github.com/akshitbtw/nft_marketplace/assets/83155183/9145ce7a-f908-4452-a429-95a12b709629)

2. Starting an Auction:
   - To start an auction for a specific Pokémon card NFT, go to the "Start/End Auction" section under the admin panel.
   - Find the card you want to auction and click the "Start Auction" button below it.

   ![Starting an Auction](https://github.com/akshitbtw/nft_marketplace/assets/83155183/aea14052-d809-4cf3-9665-a6f4f7f37c7d)

3. Ending an Auction:
   - Admin can manually end an ongoing auction after its timer expires.
   - Go to the "Start/End Auction" section under the admin panel.
   - Find the card and click the "End Auction" button below it.

   ![Ending an Auction](https://github.com/akshitbtw/nft_marketplace/assets/83155183/8a4bdb33-178a-4254-8547-09ce2d95b682)

### Users:

1. Bidding on Auctions:
   - Users can bid on the auctions shown on the homepage.
   - Enter your bid amount in the input field next to the Pokémon card NFT you want to bid on.
   - Click the "Place Bid" button to submit your bid.

   ![Bidding on Auctions](screenshots/place_bid.png)

2. Winning an Auction:
   - If you place the highest bid on an auction and the timer expires, the NFT will be automatically transferred to your Ethereum wallet.
   - You can see the NFT you won in the "My NFTs" section.

   ![Winning an Auction](screenshots/winning_auction.png)

3. Withdrawing Bids:
   - If you don't win an auction, you can withdraw the bidded amount.
   - Go to the "Withdraw" section and find the card and click the "Withdraw" button below it to get back your bid amount.

   ![Withdrawing Bids](screenshots/withdraw_bid.png)

### All Listings Webpage:

1. To view all the Pokémon card NFTs available on the website, visit the "All Listings" webpage.
2. Each NFT card, along with its attributes, image, and the owner's wallet address, will be displayed on this page.
