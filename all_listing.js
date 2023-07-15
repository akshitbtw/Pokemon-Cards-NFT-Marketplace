import { contractPromise } from './connectToContract.js';
document.addEventListener('DOMContentLoaded', async () => {
    const nftContainer = document.getElementById("nft-container");
    const nftCardTemplate = document.getElementById("nft-card-template");
    let contract;
    try {
        contract = await contractPromise;
        contract.methods.getTokensMetadata().call()
            .then(result => {
                console.log(result);
                getMetaData(result);
            })
            .catch(error => {
                console.error('Error calling view function:', error);
            });
    } catch (error) {
        console.error('Error connecting to contract:', error);
    }

    ethereum.on("accountsChanged", function (accounts) {
        // Update button text when account changes
      
        contract.methods.getTokensMetadata().call()
            .then(result => {
                    window.location.reload();
                  
            })
            .catch(error => {
                console.error('Error calling view function:', error);
            });
    });
    function getMetaData(response) {
        response.forEach(item => {
            const tokenId = item[0];
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

                    // Append the card to the container
                    nftContainer.appendChild(card);
                }
            });
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
