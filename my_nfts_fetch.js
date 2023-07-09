import { contractPromise } from './connectToContract.js';
document.addEventListener('DOMContentLoaded', async () => {
    try {
        const contract = await contractPromise;
        let account;
        // ethereum.request({ method: 'eth_requestAccounts' }).then(accounts => {
        //     account = accounts[0];
        //     console.log(account);
        // });
        // contract.methods.getOwnedTokensMetadata(account).call()
        //     .then(result => {
        //         console.log('View function result:', result);
        //     })
        //     .catch(error => {
        //         console.error('Error calling view function:', error);
        //     });
    } catch (error) {
        console.error('Error connecting to contract:', error);
    }

    async function requestAccounts() {
        return new Promise((resolve, reject) => {
            ethereum.request({ method: 'eth_requestAccounts' })
                .then(accounts => resolve(accounts))
                .catch(error => reject(error));
        });
    }
});
