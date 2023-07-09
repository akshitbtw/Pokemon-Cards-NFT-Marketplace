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
const response = { "0": "string[]: ipfs://bafkreicg5bzc3fncuapi5vfrgzz3er26k4aot6iaj6r46x6rcsqqvozjfm,ipfs://bafkreiapp23w3vfpi4v35h57c6jtfolyonua4qtwa5gq4cw5kmqrj5jemm" };

// Extract the metadata string from the response
const metadataString = response["0"].substring("string[]: ".length);

// Split the metadata string into individual metadata URIs
const metadataURIs = metadataString.split(",");

// Store the metadata URIs in the tokenURIs array
const tokenURIs = [];
metadataURIs.forEach((metadataURI) => {
  tokenURIs.push(metadataURI);
});

// console.log(tokenURIs);

tokenURIs.forEach((uri)=>{
    fetchMetadata(uri)
    .then(metadata => {
        if (metadata) {
            console.log(metadata);
        }
    });
});

// // Example usage:
// const tokenURI = "ipfs://bafkreicg5bzc3fncuapi5vfrgzz3er26k4aot6iaj6r46x6rcsqqvozjfm";
// fetchMetadata(tokenURI)
//     .then(metadata => {
//         if (metadata) {
//             console.log(metadata);
//         }
//     });

