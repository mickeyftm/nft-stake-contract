import {network} from "hardhat";

const {ethers} = require('hardhat')

const forwardBlockTime = async (time: number) => {
    await network.provider.send("evm_increaseTime", [time]);
    await network.provider.send("evm_mine");
}

describe("test", () => {
    let addrs;
    let nft, stake;

    describe("Deploy", () => {
        it("Deploy", async () => {
            [...addrs] = await ethers.getSigners();

            // stake nft deploy
            const _nft = await ethers.getContractFactory("NFT")
            nft = await _nft.deploy("")
            await nft.deployed();
            console.log("NFT Address", nft.address)

            // stake deploy
            const _stake = await ethers.getContractFactory("Stake")
            stake = await _stake.deploy(nft.address, ethers.utils.parseEther("1"));
            await stake.deployed();
            console.log("Stake Address", stake.address)

            // mint token
            await (await nft.connect(addrs[0]).mint(3)).wait()
            await (await nft.connect(addrs[1]).mint(3)).wait()
            await (await nft.connect(addrs[0]).mint(3)).wait()

            // stake nft
            await (await nft.connect(addrs[0]).multiApprove(stake.address, 3)).wait()
            await (await stake.connect(addrs[0]).depositNFT(3)).wait()
            console.log("addrs[0] reward", ethers.utils.formatEther(await stake.rewardOfUser(addrs[0].address)));
            forwardBlockTime(10)  // 10 blocks forward
            console.log("addrs[0] reward", ethers.utils.formatEther(await stake.rewardOfUser(addrs[0].address)));
            await (await stake.connect(addrs[0]).claimReward()).wait() // claim

            await (await nft.connect(addrs[0]).multiApprove(stake.address, 3)).wait()
            await (await stake.connect(addrs[0]).depositNFT(3)).wait()
            console.log("addrs[0] reward", ethers.utils.formatEther(await stake.rewardOfUser(addrs[0].address)));
            forwardBlockTime(10)  // 10 blocks forward
            console.log("addrs[0] reward", ethers.utils.formatEther(await stake.rewardOfUser(addrs[0].address)));
            await (await stake.connect(addrs[0]).claimReward()).wait()  // claim
        })
    })
})




