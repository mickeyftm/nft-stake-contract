// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "./NFT.sol";
import "./RewardToken.sol";

import "@openzeppelin/contracts/access/Ownable.sol";

contract Stake is Ownable {

    struct UserStructure {
        uint256 depositedAmount;
        uint256 currentReward;
        uint256 lastStakedTime;
    }

    RewardToken public rewardToken;
    NFT public nft;
    uint256 public rewardPerBlock;

    mapping(address => UserStructure) public userInfos;

    constructor(NFT stakeNFT_, uint256 rewardPerBlock_) {
        rewardToken = new RewardToken();
        nft = stakeNFT_;
        rewardPerBlock = rewardPerBlock_;
    }

    function depositNFT(uint256 depositAmount_) external {
        require(depositAmount_ > 0, "Amount must be greater than 0");

        uint256[] memory _userCollections = nft.getUserCollections(msg.sender);

        require(_userCollections.length >= depositAmount_, "Not enough nft."); // check remain amount nft of user.

        for(uint i = 0 ; i < depositAmount_ ; i++) {
          uint256 _tokenId = _userCollections[i];
          require(nft.getApproved(_tokenId) == address(this), "not approved"); // check nfts is approved.
          nft.transferFrom(msg.sender, address(this), _tokenId); // transfer nft to stake contract.
        }

        if(userInfos[msg.sender].lastStakedTime == 0) {
            userInfos[msg.sender].lastStakedTime = block.timestamp;
            userInfos[msg.sender].depositedAmount = depositAmount_;
        } else {
            userInfos[msg.sender].currentReward += userInfos[msg.sender].depositedAmount * rewardPerBlock * (block.timestamp - userInfos[msg.sender].lastStakedTime);
            userInfos[msg.sender].depositedAmount += depositAmount_;
            userInfos[msg.sender].lastStakedTime = block.timestamp;
        }
    }

    function claimReward() external {
        require(rewardOfUser(msg.sender) > 0, "No reward."); // check reward mount.
        userInfos[msg.sender].currentReward = 0;
        userInfos[msg.sender].lastStakedTime = block.timestamp;
        rewardToken.mint(msg.sender, rewardOfUser(msg.sender));
    }

    function rewardOfUser(address user_) public view returns(uint256) {
        uint256 _reward = userInfos[user_].currentReward + userInfos[user_].depositedAmount * rewardPerBlock * (block.timestamp - userInfos[user_].lastStakedTime);
        return _reward;
    }

    function updateRewardPerBlock(uint256 rewardPerBlock_) external {
        rewardPerBlock = rewardPerBlock_;
    }
}