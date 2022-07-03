// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract NFT is ERC721, Ownable {
    using SafeMath for uint256;
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private tokenIds;
    string public baseURI;

    mapping(address => uint256[]) public userCollections;

    constructor(string memory baseURI_) ERC721("NFT", "NFT") {
        baseURI = baseURI_;
    }

    function mint(uint256 mintAmount_) external {
        require(mintAmount_ > 0, "Amount must be greater than 0");
        require(msg.sender != address(0)); // check if this function caller is not an zero address account

        for (uint i = 0; i < mintAmount_; i++) {
            tokenIds.increment();
            uint256 newItemId = tokenIds.current();

            require(!_exists(newItemId), newItemId.toString());

            _mint(msg.sender, newItemId);
            userCollections[msg.sender].push(newItemId);
        }
    }

    function multiApprove(address to_, uint256 approveAmount_) external {
        require(approveAmount_ > 0, "Amount must be greater than 0");

        uint256[] memory _userCollections = getUserCollections(msg.sender);
        require(_userCollections.length >= approveAmount_, "Not enough nft."); // check remain amount nft of user.

        for(uint i = 0 ; i < approveAmount_ ; i++) {
            uint256 _tokenId = _userCollections[i];
            approve(to_, _tokenId);
        }
    }

    function _transfer(address from, address to, uint256 tokenId) internal virtual override {
        super._transfer(from, to, tokenId);
        for (uint256 index = 0; index < userCollections[from].length; index++) {
            if (userCollections[from][index] == tokenId) {
                userCollections[from][index] = userCollections[from][userCollections[from].length - 1];
                userCollections[from].pop();
            }
        }
        userCollections[to].push(tokenId);
    }

    function tokenURI(uint256 tokenId_) public view virtual override returns (string memory) {
        require(_exists(tokenId_), "ERC721Metadata: URI query for nonexistent token");
        string memory _baseURI = baseURI;
        return string(abi.encodePacked(_baseURI, tokenId_.toString(), ".json"));
    }

    function totalSupply() public view returns (uint256) {
        return tokenIds.current();
    }

    function setBaseURI(string memory baseURI_) public onlyOwner {
        baseURI = baseURI_;
    }

    function getUserCollections(address user_) public view returns (uint256[] memory) {
        return userCollections[user_];
    }

    function amountOfUser(address user_) public view returns (uint256) {
        uint256 _amount = userCollections[user_].length;
        return _amount;
    }
}