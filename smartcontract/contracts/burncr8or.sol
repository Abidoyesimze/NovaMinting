// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Royalty.sol";

contract BurnCr8or is ERC721Burnable, ERC721Royalty {
    // STATE VARIABLES
    mapping(uint256 => uint256) public tokenPrices;
    mapping(uint256 => bool) public tokenForSale;
    mapping(uint256 => address) public tokenCreators;

    // EVENTS
    event TokenPriceUpdated(
        uint256 indexed tokenId,
        address indexed owner,
        uint256 newPrice,
        bool forSale
    );
    event TokenBurned(uint256 indexed tokenId, address indexed owner);

    constructor() ERC721("BurnCr8or", "BCR8") {}

    // BURN FUNCTIONS
    function burnToken(uint256 tokenId) external {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only owner can burn token");

        if (tokenForSale[tokenId]) {
            tokenPrices[tokenId] = 0;
            tokenForSale[tokenId] = false;
        }

        _resetTokenRoyalty(tokenId);
        delete tokenCreators[tokenId];

        _burn(tokenId);
        emit TokenBurned(tokenId, msg.sender);
    }

    function burn(uint256 tokenId) public override {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(
            _isAuthorized(ownerOf(tokenId), msg.sender, tokenId),
            "Not authorized to burn"
        );

        if (tokenForSale[tokenId]) {
            tokenPrices[tokenId] = 0;
            tokenForSale[tokenId] = false;
        }

        _resetTokenRoyalty(tokenId);
        delete tokenCreators[tokenId];

        super.burn(tokenId);
        emit TokenBurned(tokenId, ownerOf(tokenId));
    }

    // PRICE UPDATE FUNCTIONS
    function setTokenPrice(uint256 tokenId, uint256 price) external {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only owner can set price");

        tokenPrices[tokenId] = price;
        tokenForSale[tokenId] = price > 0;

        emit TokenPriceUpdated(tokenId, msg.sender, price, price > 0);
    }

    function updateTokenPrice(uint256 tokenId, uint256 newPrice) external {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(ownerOf(tokenId) == msg.sender, "Only owner can update price");
        require(newPrice > 0, "Price must be greater than 0");

        tokenPrices[tokenId] = newPrice;
        tokenForSale[tokenId] = true;

        emit TokenPriceUpdated(tokenId, msg.sender, newPrice, true);
    }

    function removeFromSale(uint256 tokenId) external {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        require(
            ownerOf(tokenId) == msg.sender,
            "Only owner can remove from sale"
        );

        tokenPrices[tokenId] = 0;
        tokenForSale[tokenId] = false;

        emit TokenPriceUpdated(tokenId, msg.sender, 0, false);
    }

    // HELPERS
    function getTokenPrice(
        uint256 tokenId
    ) external view returns (uint256 price, bool forSale) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return (tokenPrices[tokenId], tokenForSale[tokenId]);
    }

    function isTokenForSale(uint256 tokenId) external view returns (bool) {
        require(_ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenForSale[tokenId];
    }

    // FIX: Resolve inheritance clash
    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721, ERC721Royalty) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}
