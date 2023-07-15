import { contractPromise } from './connectToContract.js';
import { web3js } from './connectToContract.js';
document.addEventListener('DOMContentLoaded', async () => {
    const nftContainer1 = document.getElementById("nft-container-1");
    const nftContainer2 = document.getElementById("nft-container-2");
    const nftCardTemplate = document.getElementById("nft-card-template");
    let contract; let account;



    let ownerAddress;
    let currentAddress;
    function match() {
        ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {
            account = accounts[0];
            currentAddress = account;
        });
        contractPromise.then(function (contract) {
            contract.methods.getContractOwner().call()
                .then(function (result) {
                    ownerAddress = result;
                    const isContractOwner = currentAddress.toLowerCase() === ownerAddress.toLowerCase();

                    if (!isContractOwner) {
                        var overlay = document.getElementById("major");
                        overlay.remove();
                        setTimeout(function () {
                            window.alert("User Authentication Failure");
                            // history.back(); // change it
                            window.location = "index.html";
                        }, 500);
                    }



                })
                .catch(function (error) {
                    console.error('Error calling view function:', error);
                });
        })
            .catch(function (error) {
                console.error('Error connecting to contract:', error);
            });
    }
    match();
    ethereum.on("accountsChanged", function (accounts) {
        // Refresh when account changes
        window.location.reload();
    });






    try {
        contract = await contractPromise;
        account;
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
            account = accounts[0];
            // console.log(account);
        });
        await contract.methods.getOwnedNotAuctionedTokens(account).call()
            .then(result => {
                // console.log('getOwnedNotAuctionedTokens ' + result);
                getMetaData(result, nftContainer1);
            })
            .catch(error => {
                console.error('Error calling view function:', error);
            });

        await contract.methods.getAuctionedNotEndedTokens(account).call()
            .then(result => {
                // console.log('getAuctionedNotEndedTokens ' + result);
                getMetaData(result, nftContainer2);
            })
            .catch(error => {
                console.error('Error calling view function:', error);
            });
    } catch (error) {
        console.error('Error connecting to contract:', error);
    }

    ethereum.on("accountsChanged", async function (accounts) {
        // Update button text when account changes
        account = accounts[0];
        await contract.methods.getOwnedNotAuctionedTokens(account).call()
            .then(result => {
                console.log('getOwnedNotAuctionedTokens ' + result);
                getMetaData(result, nftContainer1);
            })
            .catch(error => {
                console.error('Error calling view function:', error);
            });

        await contract.methods.getAuctionedNotEndedTokens(account).call()
            .then(result => {
                // console.log('getAuctionedNotEndedTokens ' + result);
                getMetaData(result, nftContainer2);
            })
            .catch(error => {
                console.error('Error calling view function:', error);
            });
    });

    function getMetaData(response, nftContainer) {
        response.forEach(item => {
            if (item[0] !== '' && item[1] !== '') {
                const tokenId = item[0];
                // console.log("item[0] --> " + item[0] + " item[1] --> " + item[1]);
                fetchMetadata(item[1]).then(nft => {
                    if (nft) {
                        // console.log(metadata);
                        // console.log(metadata.description);
                        const card = nftCardTemplate.content.cloneNode(true);

                        // Update the cloned elements with NFT details
                        const image = card.querySelector(".nft-image");
                        image.src = nft.image;
                        image.alt = nft.name;

                        const nftName = card.querySelector(".nft-name");
                        nftName.textContent = nft.name;

                        const nftDescription = card.querySelector(".nft-description");
                        const nftID = nftDescription.querySelector(".tokenID");
                        nftID.textContent = tokenId;
                        const cardNumber = nftDescription.querySelector(".card-number");
                        cardNumber.textContent = nft.description['Card Number'];

                        const rarity = nftDescription.querySelector(".rarity");
                        rarity.textContent = nft.description.Rarity;

                        const cardType = nftDescription.querySelector(".card-type");
                        cardType.textContent = nft.description['Card Type'];

                        const hp = nftDescription.querySelector(".hp");
                        hp.textContent = nft.description.HP;

                        const stage = nftDescription.querySelector(".stage");
                        stage.textContent = nft.description.Stage;

                        const cardText = nftDescription.querySelector(".card-text");
                        cardText.textContent = nft.description['Card Text'];

                        const attack1 = nftDescription.querySelector(".attack-1");
                        attack1.textContent = nft.description['Attack 1'];

                        const attack2 = nftDescription.querySelector(".attack-2");
                        attack2.textContent = nft.description['Attack 2'];

                        const weakness = nftDescription.querySelector(".weakness");
                        weakness.textContent = nft.description.Weakness;

                        const retreatCost = nftDescription.querySelector(".retreat-cost");
                        retreatCost.textContent = nft.description['Retreat Cost'];

                        const additionalDetails = card.querySelector(".additional-details");
                        const auctionBtn = additionalDetails.querySelector(".auction-button");
                        const listingPrice = additionalDetails.querySelector(".listing-price");
                        if (nftContainer === nftContainer1) {
                            auctionBtn.addEventListener('click', async () => {
                                if (listingPrice.value === "") {
                                    // Input is empty, display an error message or take appropriate action
                                    alert("Listing price cannot be empty.");
                                } else {
                                    // Input is not empty, proceed with further processing
                                    console.log("Listing price:", listingPrice.value);
                                    const weiValue = web3js.utils.toWei(listingPrice.value.toString(), 'ether');
                                    console.log(weiValue);
                                    await contract.methods.startAuction(nftID.textContent, weiValue)
                                        .send({ from: account })
                                        .on('transactionHash', (hash) => {
                                            // Transaction submitted
                                            console.log('Transaction hash:', hash);
                                        })
                                        .on('confirmation', function (confirmationNumber, receipt) {
                                            console.log('Confirmation number:', confirmationNumber);
                                            console.log('Receipt:', receipt);
                                        })
                                        .on('error', (error) => {
                                            // Error occurred
                                            console.error('Error:', error);
                                        });
                                    window.location.reload();
                                }
                            });
                        }
                        else if (nftContainer === nftContainer2) {
                            const listingPriceLabel = additionalDetails.querySelector(".listing-price-label");
                            listingPriceLabel.remove();
                            listingPrice.remove();
                            auctionBtn.textContent = 'End Auction';
                            auctionBtn.addEventListener('click', async () => {
                                await contract.methods.endAuction(nftID.textContent)
                                    .send({ from: account })
                                    .on('transactionHash', function (hash) {
                                        console.log('Transaction hash:', hash);
                                    })
                                    .on('confirmation', function (confirmationNumber, receipt) {
                                        console.log('Confirmation number:', confirmationNumber);
                                        console.log('Receipt:', receipt);
                                    })
                                    .on('error', function (error) {
                                        console.error('Error:', error);
                                    });
                                window.location.reload();
                            });
                        }
                        // Append the card to the container
                        nftContainer.appendChild(card);
                    }
                });

            }
        });

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
    }
});
