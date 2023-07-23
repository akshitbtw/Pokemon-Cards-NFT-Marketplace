import { contractPromise } from './connectToContract.js';

document.addEventListener('DOMContentLoaded', function () {
  let ownerAddress;
  let currentAddress;
  const navbarPlaceholder = document.getElementById("navbar-placeholder");
  let contract;
  let account;

  if (typeof web3 !== 'undefined') {
    fetch("navbar.html")
      .then(function (response) {
        return response.text();
      })
      .then(function (navbarHtml) {
        navbarPlaceholder.innerHTML = navbarHtml;

        let connectBtn = document.getElementById("connect-button");

        // Function to update button text
        function updateButtonText(walletAddress) {
          connectBtn.textContent = walletAddress || "Connect Wallet";
        }


        // Check if wallet address exists in local storage
        var walletAddress = localStorage.getItem("walletAddress");

        updateButtonText(walletAddress);

        // connectBtn.setAttribute('data-bs-original-title', walletAddress);
        // ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {
        // });

        connectBtn.addEventListener('click', function () {
          ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {
            account = accounts[0];
            let displayText = (account.substr(0, 5)).concat("...", account.substr(-4, 4));
            updateButtonText(displayText);
            localStorage.setItem("walletAddress", displayText);
          });
        });
        match();

        // Listen for MetaMask account change events
        ethereum.on("accountsChanged", function (accounts) {
          // Update button text when account changes
          account = accounts[0];

          if (account === undefined) {
            localStorage.removeItem("walletAddress");
            updateButtonText(null);
          } else {
            let displayText = (account.substr(0, 5)).concat("...", account.substr(-4, 4));
            localStorage.setItem("walletAddress", displayText);
            updateButtonText(displayText);
          }
          match();
        });
      })
      .catch(function (error) {
        console.log("Error loading navbar:", error);
        alert("Error Loading Navigation Bar");
      });

    async function match() {
      await ethereum.request({ method: 'eth_requestAccounts' }).then(function (accounts) {
        account = accounts[0];
        currentAddress = account;
      });

      contractPromise.then(function (contract) {
        contract.methods.getContractOwner().call()
          .then(function (result) {
            ownerAddress = result;
            // console.log("Owner Address: ", ownerAddress);
            // console.log("Current Address : ", currentAddress);

            const admin = document.getElementById("admin");

            const isContractOwner = currentAddress.toLowerCase() === ownerAddress.toLowerCase();

            if (isContractOwner) {
              admin.style.display = "block";
            } else {
              admin.style.display = "none";
            }

          })
          .catch(function (error) {
            console.error('Error calling view function:', error);
            alert("Error calling view function2");
          });
      })
        .catch(function (error) {
          console.error('Error connecting to contract:', error);
          alert("Error Connecting to Contract");
        });
    }
  } else {
    alert("Please install MetaMask to continue.");
    window.location.reload();
  }
});
