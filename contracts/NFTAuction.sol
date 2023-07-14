// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTAuction is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Auction {
        address owner;
        uint256 tokenId;
        uint256 startingPrice;
        uint256 auctionEndTime;
        address highestBidder;
        uint256 highestBid;
        bool ended;
    }

    uint256 private _auctionDuration = 1 minutes;
    mapping(uint256 => Auction) public auctions;
    mapping(uint256 => mapping(address => uint256)) private _totalBids;
    uint256[] public liveAuctions;

    constructor() ERC721("DERBASSI TOKEN", "DB") {}

    function createToken(string memory _uri) public onlyOwner {
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        _mint(msg.sender, tokenId);
        _setTokenURI(tokenId, _uri);
    }

    function startAuction(uint256 tokenId, uint256 startingPrice)
        public
        onlyOwner
    {
        require(
            ownerOf(tokenId) == msg.sender,
            "Only the token owner can start an auction"
        );
        require(!auctions[tokenId].ended, "Auction has already ended");
        require(
            auctions[tokenId].auctionEndTime == 0,
            "Auction already started"
        );

        uint256 auctionEndTime = block.timestamp + _auctionDuration;

        auctions[tokenId] = Auction({
            owner: msg.sender,
            tokenId: tokenId,
            startingPrice: startingPrice,
            auctionEndTime: auctionEndTime,
            highestBidder: address(0),
            highestBid: 0,
            ended: false
        });
        liveAuctions.push(tokenId);
    }

    function placeBid(uint256 tokenId) public payable {
        Auction storage auction = auctions[tokenId];
        require(!auction.ended, "Auction has already ended");
        require(msg.sender != auction.owner, "Owner cannot place a bid");
        require(
            msg.sender != auction.highestBidder,
            "Highest bidder cannot place a bid"
        );
        require(
            block.timestamp < auction.auctionEndTime,
            "Auction has already ended"
        );

        uint256 totalBid = _totalBids[tokenId][msg.sender] + msg.value;
        require(
            totalBid > auction.highestBid,
            "Bid amount must be higher than the current highest bid"
        );

        _totalBids[tokenId][msg.sender] = totalBid;

        auction.highestBidder = msg.sender;
        auction.highestBid = totalBid;
    }

    function endAuction(uint256 tokenId) public onlyOwner {
        Auction storage auction = auctions[tokenId];
        require(!auction.ended, "Auction has already ended");
        require(
            block.timestamp >= auction.auctionEndTime,
            "Auction has not ended yet"
        );

        auction.ended = true;

        if (auction.highestBidder != address(0)) {
            // Transfer NFT to the highest bidder
            _transfer(auction.owner, auction.highestBidder, tokenId);

            // Transfer auction funds to the owner
            uint256 amount = auction.highestBid;
            payable(auction.owner).transfer(amount);
        }

        // // Transfer NFT to the highest bidder
        // _transfer(auction.owner, auction.highestBidder, tokenId);

        // // Transfer auction funds to the owner
        // uint256 amount = auction.highestBid;
        // payable(auction.owner).transfer(amount);

        // Remove the auction from liveAuctions
        for (uint256 i = 0; i < liveAuctions.length; i++) {
            if (liveAuctions[i] == tokenId) {
                liveAuctions[i] = liveAuctions[liveAuctions.length - 1];
                liveAuctions.pop();
                break;
            }
        }
    }

    function withdraw(uint256 tokenId) public {
        Auction storage auction = auctions[tokenId];
        require(auction.ended, "Auction has not ended");
        require(msg.sender != auction.owner, "Owner cannot withdraw");
        require(
            msg.sender != auction.highestBidder,
            "Highest bidder cannot withdraw"
        );

        uint256 totalBid = _totalBids[tokenId][msg.sender];
        require(totalBid > 0, "No bid amount to withdraw");

        _totalBids[tokenId][msg.sender] = 0;
        payable(msg.sender).transfer(totalBid);
    }

    // function getLiveAuctions() public view returns (Auction[] memory) {
    //     Auction[] memory liveAuctionsData = new Auction[](liveAuctions.length);
    //     for (uint256 i = 0; i < liveAuctions.length; i++) {
    //         uint256 auctionId = liveAuctions[i];
    //         liveAuctionsData[i] = auctions[auctionId];
    //     }
    //     return liveAuctionsData;
    // }

    function getLiveAuctions() public view returns (Auction[] memory) {
        Auction[] memory liveAuctionsData = new Auction[](liveAuctions.length);
        for (uint256 i = 0; i < liveAuctions.length; i++) {
            uint256 auctionId = liveAuctions[i];
            Auction storage auction = auctions[auctionId];
            liveAuctionsData[i] = auction;
        }
        return liveAuctionsData;
    }

    struct TokenMetadata {
        uint256 tokenId;
        string tokenURI;
    }

    function getOwnedTokensMetadata(address owner)
        public
        view
        returns (TokenMetadata[] memory)
    {
        uint256 tokenCount = balanceOf(owner);
        TokenMetadata[] memory ownedTokensMetadata = new TokenMetadata[](
            tokenCount
        );

        uint256 index = 0;
        for (uint256 i = 0; i < _tokenIds.current(); i++) {
            uint256 tokenId = i + 1;
            if (_exists(tokenId) && ownerOf(tokenId) == owner) {
                string memory tokenURI = tokenURI(tokenId);
                ownedTokensMetadata[index] = TokenMetadata(tokenId, tokenURI);
                index++;
            }
        }
        return ownedTokensMetadata;
    }

    function getTokensMetadata() public view returns (TokenMetadata[] memory) {
        uint256 tokenCount = _tokenIds.current();
        TokenMetadata[] memory TokensMetadata = new TokenMetadata[](tokenCount);

        uint256 index = 0;
        for (uint256 i = 0; i < _tokenIds.current(); i++) {
            uint256 tokenId = i + 1;
            if (_exists(tokenId)) {
                string memory tokenURI = tokenURI(tokenId);
                TokensMetadata[index] = TokenMetadata(tokenId, tokenURI);
                index++;
            }
        }
        return TokensMetadata;
    }

    // Returns all the cards owned by the owner and not auctioned yet
    function getAuctionedNotEndedTokens(address owner)
        public
        view
        returns (TokenMetadata[] memory)
    {
        TokenMetadata[] memory auctionedTokens = new TokenMetadata[](
            liveAuctions.length
        );
        for (uint256 i = 0; i < liveAuctions.length; i++) {
            uint256 tokenId = liveAuctions[i];
            Auction storage auction = auctions[tokenId];
            if (
                auction.owner == owner &&
                block.timestamp >= auction.auctionEndTime &&
                !auction.ended
            ) {
                string memory tokenURI = ERC721URIStorage.tokenURI(tokenId); // Call tokenURI from ERC721URIStorage contract
                auctionedTokens[i] = TokenMetadata(tokenId, tokenURI);
            }
        }
        return auctionedTokens;
    }

    function getOwnedNotAuctionedTokens(address owner)
        public
        view
        returns (TokenMetadata[] memory)
    {
        uint256 tokenCount = balanceOf(owner);
        TokenMetadata[] memory ownedTokens = new TokenMetadata[](tokenCount);

        uint256 index = 0;
        for (uint256 i = 0; i < _tokenIds.current(); i++) {
            uint256 tokenId = i + 1;
            if (_exists(tokenId) && ownerOf(tokenId) == owner) {
                Auction storage auction = auctions[tokenId];
                if (!auction.ended && auction.auctionEndTime == 0) {
                    ownedTokens[index] = TokenMetadata(
                        tokenId,
                        tokenURI(tokenId)
                    );
                    index++;
                }
            }
        }
        return ownedTokens;
    }

    event AuctionExpired(uint256 tokenId, string tokenURI);

    function getAuctionedNotEndedTokensEmit(address owner) public {
        for (uint256 i = 0; i < liveAuctions.length; i++) {
            uint256 tokenId = liveAuctions[i];
            Auction storage auction = auctions[tokenId];
            if (
                auction.owner == owner &&
                block.timestamp >= auction.auctionEndTime &&
                !auction.ended
            ) {
                emit AuctionExpired(tokenId, tokenURI(tokenId));
            }
        }
    }
}
