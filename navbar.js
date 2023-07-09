document.addEventListener('DOMContentLoaded', () => {
    const navbarPlaceholder = document.getElementById("navbar-placeholder");
    let account;
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

            connectBtn.addEventListener('click', () => {
                ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
                    account = accounts[0];
                    let displayText = (account.substr(0, 5)).concat("...", account.substr(-4, 4));

                    updateButtonText(displayText);
                    localStorage.setItem("walletAddress", displayText);
                    // connectToContract();
                });
            });

            // Listen for MetaMask account change events
            ethereum.on("accountsChanged", function (accounts) {
                // Update button text when account changes
                account = accounts[0];
                if (account === undefined) {
                    localStorage.removeItem("walletAddress");
                    updateButtonText(null);
                }
                else {
                    let displayText = (account.substr(0, 5)).concat("...", account.substr(-4, 4));
                    localStorage.setItem("walletAddress", displayText);
                    updateButtonText(displayText);
                }
                // connectToContract();
            });
        })
        .catch(function (error) {
            console.log("Error loading navbar:", error);
        });
});