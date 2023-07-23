import { contractPromise } from './connectToContract.js';
document.addEventListener('DOMContentLoaded', async () => {
    let contract;
    let account;
    let ownerAddress;
    let currentAddress;
    try {
        contract = await contractPromise;
        await ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
            account = accounts[0];
            console.log(account);
        });
    } catch (error) {
        console.error('Error connecting to contract:', error);
        alert("Error Connecting to Contract");
    }

    async function uploadNFT(NFTFile) {
        const formData = new FormData();
        formData.append("file", NFTFile);

        const response = await fetch("https://api.nft.storage/upload", {
            method: "POST",
            headers: {
                Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDk0MjQxMDI0RkQxYTA5NjMyRjFjOTFBQ0E4MkVGZDAzOEEwNThhODgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY4OTA5MzI0MzI0OSwibmFtZSI6Im1vaGl0MTIzIn0.JtUXvkMnoPmofXXJyCGUS6TwazGibOl785DFaepibPE`
            },
            body: formData
        });

        const data = await response.json();
        return data.value.cid;
    }

    async function handleFormSubmit(event) {
        event.preventDefault();
        const imageFile = document.getElementById("imageUpload").files[0];
        const fullPath = document.getElementById("imageUpload").files[0].name;
        var index = fullPath.lastIndexOf("/");
        var filename = fullPath;
        if (index !== -1) {
            filename = fullPath.substring(index + 1, fullPath.length);
        }
        const ipfsUrl1 = await uploadNFT(imageFile);

        const name = document.getElementById("name").value;
        const cardnumber = document.getElementById("cardnumber").value;
        const rarity = document.getElementById("rarity").value;
        const cardtype = document.getElementById("cardtype").value;
        const hp = document.getElementById("hp").value;
        const stage = document.getElementById("stage").value;
        const attack1 = document.getElementById("attack1").value;
        const attack2 = document.getElementById("attack2").value;
        const weakness = document.getElementById("weakness").value;
        const retreatcost = document.getElementById("retreatcost").value;
        const file1 = [`{ "name" : "${name}","description" : {"Card Number" : "${cardnumber}","Rarity" : "${rarity}","Card Type" : "${cardtype}", "HP" : "${hp}", "Stage" : "${stage}","Attack 1" : "${attack1}","Attack 2" : "${attack2}","Weakness" : "${weakness}","Retreat Cost" : "${retreatcost}"},"image" : "ipfs://${ipfsUrl1}/${filename}" }`]
        const file2 = new Blob(file1, { type: 'text/plain' });
        const ipfsUrl2 = await uploadNFT(file2);
        document.getElementById("ipfsUrl").textContent = `IPFS URL: https://ipfs.io/ipfs/${ipfsUrl2}/blob`;
        await contract.methods.createToken("ipfs://" + ipfsUrl2 + "/blob").send({ from: account });
        alert("NFT Created Successfully");
        window.location.reload();
    }

    function match(){
        ethereum.request({ method: 'eth_requestAccounts' }).then(function(accounts) {
                account = accounts[0];
                currentAddress = account;
        });
          contractPromise.then(function(contract) {
            contract.methods.getContractOwner().call()
              .then(function(result) {
                ownerAddress = result;
                const isContractOwner = currentAddress.toLowerCase() === ownerAddress.toLowerCase();
        
                if (isContractOwner) {
                document.getElementById("uploadForm").addEventListener("submit", handleFormSubmit);
                } else {
                    var overlay = document.getElementById("major");
                    overlay.remove();
                    setTimeout(function() {
                        window.alert("User Authentication Failure");
                        // history.back(); // change it
                        window.location="index.html";
                      }, 500);        
                }
        
        
        
              })
              .catch(function(error) {
                console.error('Error calling view function:', error);
                alert("Error Calling View Function");
              });
          })
          .catch(function(error) {
            console.error('Error connecting to contract:', error);
            alert("Error Connecting to Contract");
          });
        }
        match();
        ethereum.on("accountsChanged", function () {
            window.location.reload();
        });
});