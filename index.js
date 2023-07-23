import { contractPromise } from './connectToContract.js';
import { web3js } from './connectToContract.js';
document.addEventListener('DOMContentLoaded', async () => {
    let contract; let account;
    try {
        contract = await contractPromise;
        account;
        await ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
            account = accounts[0];
            console.log(account);
        });

        contract.methods.getLiveAuctions().call()
            .then(liveAuctions => {
                if (liveAuctions.length === 0) noAuctionsAvailable();
                return Promise.all(liveAuctions.map(auction => {
                    return Promise.all([
                        Promise.resolve(auction),
                        contract.methods.tokenURI(auction.tokenId).call()
                    ]);
                }));
            })
            .then(auctionedNFTs => {
                auctionedNFTs.forEach(([auction, tokenURI]) => {
                    // Render the NFT card using auction and tokenURI data
                    // console.log(auction, fetchMetadata(tokenURI));
                    fetchMetadata(tokenURI).then(async metadata => {
                        const nftCard = await createAuctionCard(auction, metadata);
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

    ethereum.on("accountsChanged", function () {
        window.location.reload();
    });

    async function createAuctionCard(auction, metadata) {

        const template = document.getElementById('nft-card-template');
        const nftCard = template.content.cloneNode(true);
        nftCard.querySelector('.nft-image').src = metadata.image;
        nftCard.querySelector('.nft-token-id').textContent = auction.tokenId;
        nftCard.querySelector('.nft-name').textContent = metadata.name;
        nftCard.querySelector('.nft-owner').textContent = auction.owner;
        nftCard.querySelector('.nft-starting-price').textContent = `${web3js.utils.fromWei(auction.startingPrice, 'ether')} ETH`;

        const nftEndTimeElement = nftCard.querySelector('.nft-end-time');
        const endTime = new Date(auction.auctionEndTime * 1000);
        const auctionStatusLabel = nftCard.querySelector('.auction-status-label');
        const placeBidBtn = nftCard.querySelector('.place-bid-btn');
        const placeBidBtnDiv = nftCard.querySelector('.button-column');
        const nftHighestBid = nftCard.querySelector('.nft-highest-bid');
        function updateRemainingTime() {
            const currentTime = new Date().getTime();
            const remainingTimeInSeconds = Math.max(0, endTime - currentTime) / 1000;

            const hours = Math.floor(remainingTimeInSeconds / 3600);
            const minutes = Math.floor((remainingTimeInSeconds % 3600) / 60);
            const seconds = Math.floor(remainingTimeInSeconds % 60);

            nftEndTimeElement.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            if (remainingTimeInSeconds <= 0) {
                clearInterval(interval);
                bidInput.remove();
                placeBidBtnDiv.remove();
                nftHighestBid.textContent = `${web3js.utils.fromWei(auction.highestBid, 'ether')} ETH`;
                nftEndTimeElement.textContent = "Auction Ended";
                auctionStatusLabel.textContent = "This auction has ended, and the NFT will soon be transferred to the highest bidder. Participants can withdraw their bids once it is reflected in the withdrawal section.";
                placeBidBtn.remove();
            }
        }

        const interval = setInterval(updateRemainingTime, 1000);

        if (auction.highestBidder === '0x0000000000000000000000000000000000000000')
            nftCard.querySelector('.nft-highest-bidder').textContent = "No Bids Yet";
        else nftCard.querySelector('.nft-highest-bidder').textContent = auction.highestBidder;

        const userBidAmount = await contract.methods.getBidAmount(auction.tokenId).call({ from: account });
        nftCard.querySelector('.user-bid-amount').textContent = `${web3js.utils.fromWei(userBidAmount, 'ether')} ETH`;

        const userBidInWei = web3js.utils.toBN(userBidAmount);
        const highestBidInWeiBN = web3js.utils.toBN(auction.highestBid);
        const amountToOutbidInWei = highestBidInWeiBN.sub(userBidInWei).add(web3js.utils.toBN(1));
        const amountToOutbidInEth = web3js.utils.fromWei(amountToOutbidInWei, 'ether');

        if (auction.highestBidder === '0x0000000000000000000000000000000000000000') {
            nftCard.querySelector('.nft-highest-bid').textContent = "No Bids Placed";
        } else {
            const highestBidInEth = web3js.utils.fromWei(auction.highestBid, 'ether');
            if (amountToOutbidInEth) {
                nftHighestBid.textContent = `${highestBidInEth} ETH (+${amountToOutbidInEth} ETH to outbid)`;
            } else {
                nftHighestBid.textContent = `${highestBidInEth} ETH`;
            }
        }

        const viewDetailsButton = nftCard.querySelector('.view-details-btn');
        const myModal = new bootstrap.Modal('#nft-details-modal');
        viewDetailsButton.addEventListener('click', () => {
            const modalBody = document.querySelector(".modal-body");
            const nftDetails = modalBody.querySelector(".nft-details");
            nftDetails.querySelector('.nft-name').textContent = metadata.name;
            const nftDescription = nftDetails.querySelector(".nft-description");
            nftDescription.querySelector(".tokenID").textContent = auction.tokenId;

            nftDescription.querySelector(".card-number").textContent = metadata.description['Card Number'];
            nftDescription.querySelector(".rarity").textContent = metadata.description.Rarity;
            nftDescription.querySelector(".card-type").textContent = metadata.description['Card Type'];
            nftDescription.querySelector(".hp").textContent = metadata.description.HP;
            nftDescription.querySelector(".stage").textContent = metadata.description.Stage;
            nftDescription.querySelector(".card-text").textContent = metadata.description['Card Text'];
            nftDescription.querySelector(".attack-1").textContent = metadata.description['Attack 1'];
            nftDescription.querySelector(".attack-2").textContent = metadata.description['Attack 2'];
            nftDescription.querySelector(".weakness").textContent = metadata.description.Weakness;
            nftDescription.querySelector(".retreat-cost").textContent = metadata.description['Retreat Cost'];

            myModal.show();

            // event listener for modal close button
            document.querySelector('.btn-close').addEventListener('click', () => {
                myModal.hide();
            });
        });

        const placeBidButton = nftCard.querySelector('.place-bid-btn');
        const bidInput = nftCard.querySelector('.bid-input');
        placeBidButton.addEventListener('click', async () => {

            const bidAmount = web3js.utils.toWei(bidInput.value.toString(), 'ether');
            await contract.methods.placeBid(auction.tokenId).estimateGas({ value: bidAmount, from: account })
                .then(async (estimatedGas) => {
                    // Set the gas limit as a percentage of the estimated gas
                    const gasLimit = Math.round(estimatedGas * 1.2); // Increase by 20% for buffer

                    // Call the placeBid function with the dynamically set gas limit
                    await contract.methods.placeBid(auction.tokenId).send({ value: bidAmount, from: account, gas: gasLimit })
                        .on('transactionHash', (hash) => {
                            console.log('Transaction hash:', hash);
                        })
                        .on('confirmation', (confirmationNumber, receipt) => {
                            console.log('Confirmation number:', confirmationNumber);
                            console.log('Receipt:', receipt);
                        })
                        .on('error', (error) => {
                            console.error('Error:', error);
                            if (error.data && error.data.reason) {
                                const revertReason = web3.utils.hexToUtf8(error.data.reason);
                                alert(`Transaction reverted: ${revertReason}`);
                            } else {
                                alert('Transaction reverted without reason.');
                            }
                        });
                    window.location.reload();

                })
                .catch((error) => {
                    alert(extractErrorCode(error.message));
                    console.log(error);
                });
        });

        return nftCard;
    }

    function extractErrorCode(str) {
        const delimiter = '___'; //Replace it with the delimiter you used in the Solidity Contract.
        const firstOccurence = str.indexOf(delimiter);
        if (firstOccurence == -1) {
            return "An error occured";
        }

        const secondOccurence = str.indexOf(delimiter, firstOccurence + 1);
        if (secondOccurence == -1) {
            return "An error occured";
        }

        //Okay so far
        return str.substring(firstOccurence + delimiter.length, secondOccurence);
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
            alert("Failed to fetch metadata");
            return null;
        }

    }

    function noAuctionsAvailable() {
        const msgDiv = document.createElement('div');
        msgDiv.id = 'noNftMsg';
        msgDiv.textContent = 'No Auction Available at the Moment';
        msgDiv.style.justifyContent = "center";
        document.body.appendChild(msgDiv);
    }
});
