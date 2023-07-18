import { contractPromise } from './connectToContract.js';
import { web3js } from './connectToContract.js';
document.addEventListener('DOMContentLoaded', async () => {
    const nftContainer = document.getElementById("nft-container");
    const nftCardTemplate = document.getElementById("nft-card-template");
    let contract; let account;
    try {
        contract = await contractPromise;
        account;
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
            account = accounts[0];
            // console.log(account);
        });
        await contract.methods.getWithdrawableTokens(account).call()
            .then(result => {
                // console.log('getOwnedNotAuctionedTokens ' + result);
                getMetaData(result);
            })
            .catch(error => {
                console.error('Error calling view function:', error);
            });

        // await contract.methods.getAuctionedNotEndedTokens(account).call()
        //     .then(result => {
        //         // console.log('getAuctionedNotEndedTokens ' + result);
        //         getMetaData(result, nftContainer2);
        //     })
        //     .catch(error => {
        //         console.error('Error calling view function:', error);
        //     });
    } catch (error) {
        console.error('Error connecting to contract:', error);
    }

    ethereum.on("accountsChanged", async function (accounts) {
        // Update button text when account changes
        account = accounts[0];
        await contract.methods.getWithdrawableTokens(account).call()
            .then(
                // console.log('getOwnedNotAuctionedTokens ' + result);
                window.location.reload()
            )
            .catch(error => {
                console.error('Error calling view function:', error);
            });

        // await contract.methods.getAuctionedNotEndedTokens(account).call()
        //     .then(result => {
        //         // console.log('getAuctionedNotEndedTokens ' + result);
        //         getMetaData(result, nftContainer2);
        //     })
        //     .catch(error => {
        //         console.error('Error calling view function:', error);
        //     });
    });

    function getMetaData(response) {
        console.log("withdrawble tokens : ", response);
        response.forEach(item => {
            if (item[0] !== '' && item[1] !== '') {
                const tokenId = item[0];
                fetchMetadata(item[1]).then(async nft => {
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

                        const nftID = card.querySelector(".tokenID");
                        nftID.textContent = tokenId;

                        const additionalDetails = card.querySelector(".additional-details");
                        const auctionBtn = additionalDetails.querySelector(".withdraw-button");

                        let bidAmount;
                        await contract.methods.getBidAmount(tokenId).call({ from: account }).then(result => {
                            bidAmount = result;
                        });

                        card.querySelector(".bid-amount").textContent = `${web3js.utils.fromWei(bidAmount, 'ether')} ETH`;


                        auctionBtn.addEventListener('click', async () => {
                            await contract.methods.withdraw(tokenId).send({ from: account })
                                .then(
                                    console.log('Withdrawal Successful')
                                )
                                .catch((error) => {
                                    console.error('Error calling withdraw function:', error);
                                });
                            alert('Withdrawal Successful');
                            window.location.reload();
                        });
                        // 91.4747
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
