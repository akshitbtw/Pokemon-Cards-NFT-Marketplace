import { contractPromise } from './connectToContract.js';
import { web3js } from './connectToContract.js';
document.addEventListener('DOMContentLoaded', async () => {
    const nftContainer = document.getElementById("nft-container");
    const nftCardTemplate = document.getElementById("nft-card-template");
    let contract; let account;



    let ownerAddress;
    let currentAddress;

    ethereum.on("accountsChanged", function (accounts) {
        // Refresh when account changes
        window.location.reload();
    });

    try {
        contract = await contractPromise;
        account;
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
            account = accounts[0];
            console.log(account);
        });
        // await contract.methods.getLiveAuctions().call()
        //     .then(result => {
        //         // console.log('getLiveAuctions', result[0]);
        //         createAuctionCards(result);
        //     })
        //     .catch(error => {
        //         console.error('Error calling view function:', error);
        //     });


        contract.methods.getLiveAuctions().call()
            .then(liveAuctions => {
                // console.log('Live Auctions:', liveAuctions);
                return Promise.all(liveAuctions.map(auction => {
                    return Promise.all([
                        Promise.resolve(auction),
                        contract.methods.tokenURI(auction.tokenId).call()
                    ]);
                }));
            })
            .then(auctionedNFTs => {
                // console.log('Auctioned NFTs:', auctionedNFTs);
                auctionedNFTs.forEach(([auction, tokenURI]) => {
                    // Render the NFT card using auction and tokenURI data
                    // console.log(auction, fetchMetadata(tokenURI));
                    fetchMetadata(tokenURI).then(metadata => {
                        // console.log(auction, metadata);
                        const nftCard = createAuctionCard(auction, metadata);
                        addCardToContainer(nftCard);
                    })
                        .catch(error => {
                            console.error('Error fetching NFT metadata:', error);
                        });
                });
            })
            .catch(error => {
                console.error('Error calling view functions:', error);
            });

    } catch (error) {
        console.error('Error connecting to contract:', error);
    }

    ethereum.on("accountsChanged", async function (accounts) {
        // Update button text when account changes
        account = accounts[0];

    });

    function createAuctionCard(auction, metadata) {
        // Implement your logic to create an NFT card using the provided template
        // and populate it with auction and metadata details
        // Example:
        const template = document.getElementById('nft-card-template');
        const nftCard = template.content.cloneNode(true);

        nftCard.querySelector('.nft-image').src = metadata.image;
        nftCard.querySelector('.nft-token-id').textContent = auction.tokenId;
        nftCard.querySelector('.nft-name').textContent = metadata.name;
        nftCard.querySelector('.nft-owner').textContent = auction.owner;
        nftCard.querySelector('.nft-starting-price').textContent = `${web3js.utils.fromWei(auction.startingPrice, 'ether')} ETH`;
        nftCard.querySelector('.nft-end-time').textContent = formatEpochTime(auction.auctionEndTime);
        if(auction.highestBidder === '0x0000000000000000000000000000000000000000') 
        nftCard.querySelector('.nft-highest-bidder').textContent = "No Bids Yet";
        else nftCard.querySelector('.nft-highest-bidder').textContent = auction.highestBidder;
        nftCard.querySelector('.nft-highest-bid').textContent = auction.highestBid;

        const viewDetailsButton = nftCard.querySelector('.view-details-btn');
        // const myModal = document.getElementById('nft-details-modal');
        viewDetailsButton.addEventListener('click', () => {
            // Handle the logic to display the NFT details in a modal or other UI element
            console.log("view nft details");
            // const myModal = new bootstrap.Modal(document.getElementById('nftDetailsModal'), backdrop);
            // myModal.show();
        });

        const placeBidButton = nftCard.querySelector('.place-bid-btn');
        const bidInput = nftCard.querySelector('.bid-input');
        placeBidButton.addEventListener('click', () => {
            // const bidAmount = bidInput.value;
            console.log("place bid called");
        });

        return nftCard;
    }

    function addCardToContainer(nftCard) {
        const nftContainer = document.getElementById('nft-container');
        nftContainer.appendChild(nftCard);
    }

    function convertIPFSURL(ipfsURL) {
        const ipfsGateway = "https://ipfs.io/ipfs/";
        const ipfsPrefix = "ipfs://";

        if (ipfsURL.startsWith(ipfsPrefix)) {
            const cid = ipfsURL.substring(ipfsPrefix.length);
            return ipfsGateway + cid;
        }

        return ipfsURL; // return unchanged if not starting with "ipfs://"
    }

    async function fetchMetadata(tokenURI) {
        const convertedURI = convertIPFSURL(tokenURI);
        try {
            const response = await fetch(convertedURI);
            const metadata = await response.json();

            if (metadata.image) {
                metadata.image = convertIPFSURL(metadata.image);
            }

            return metadata;
        } catch (error) {
            console.error("Failed to fetch metadata:", error);
            return null;
        }
    }

    function formatEpochTime(epochTimestamp) {
        const date = new Date(epochTimestamp * 1000); // Convert epoch to milliseconds
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const seconds = date.getSeconds().toString().padStart(2, '0');
        return `${hours}:${minutes}:${seconds}`;
    }
});
