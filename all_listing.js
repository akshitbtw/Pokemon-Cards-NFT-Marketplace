import { contractPromise } from './connectToContract.js';
document.addEventListener('DOMContentLoaded', async () => {
    const nftContainer = document.getElementById("nft-container");
    const nftCardTemplate = document.getElementById("nft-card-template");
    let contract;
    var flag=1;

    try {
        contract = await contractPromise;
        contract.methods.getTokensMetadata().call()
            .then(result => {
                // console.log(result);
                getMetaData(result);
            })
            .catch(error => {
                console.error('Error calling view function:', error);
                alert("Error Calling view Function");
            });
    } catch (error) {
        console.error('Error connecting to contract:', error);
        alert("Error Connecting to Contract");
    }

    ethereum.on("accountsChanged", function (accounts) {
        // Update button text when account changes

        contract.methods.getTokensMetadata().call()
            .then(
                window.location.reload()
            )
            .catch(error => {
                console.error('Error calling view function:', error);
                alert("Error Calling View Function");
            });
    });
    function getMetaData(response) {
        response.forEach(item => {
            const tokenId = item[0];
            flag=0;
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

                    const nftDescription = card.querySelector(".nft-description");
                    const nftID = nftDescription.querySelector(".tokenID");
                    nftID.textContent = tokenId;
                    let owner;
                    const tooltipTriggerList = [].slice.call(nftDescription.querySelectorAll('.btn-tooltip'));
                    // console.log(tooltipTriggerList);
                    tooltipTriggerList.map((tooltipTriggerEl) => new bootstrap.Tooltip(tooltipTriggerEl));
                    await contract.methods.ownerOf(tokenId).call()
                        .then((tokenIdOwner) => {
                            owner = tokenIdOwner;
                        })
                        .catch((error) => {
                            console.error('Error calling ownerOf function:', error);
                            alert("Error Calling ownerOf Function");
                        });
                    const nftOwner = nftDescription.querySelector(".owner");
                    nftOwner.textContent = (owner.substr(0, 5)).concat("...", owner.substr(-4, 4));

                    // Set tooltip text dynamically
                    const tooltipButton = nftDescription.querySelector('.btn-tooltip');
                    tooltipButton.setAttribute('data-bs-original-title', owner);

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
                alert("Failed to Fetch metadata");
                return null;
            }
        }
        
        if(flag==1)
        {
            const msgDiv = document.createElement('div');
            msgDiv.id = 'noNftMsg';
            msgDiv.textContent = 'No NFT Available';
            document.body.appendChild(msgDiv);
        }
    }
});
