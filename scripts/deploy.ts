import { ethers } from 'hardhat'

async function main() {

    const [deployer] = await ethers.getSigners()

    if (deployer === undefined) throw new Error('Deployer is undefined.')

    console.log('Deploying contracts with the account:', deployer.address)
    console.log('Account balance:', (await deployer.getBalance()).toString())

    // NFT
    const nft = await ethers.getContractFactory('NFT')
    const nftArgs: any[] = ["ipfs://QmV9Gk5cugK86N8XC9fKJh8UY2munLqpjV4UakupijBM1J/"]
    const nftContract = await nft.deploy(...nftArgs)
    console.log('NFT:', nftContract.address)

    // stake
    const stake = await ethers.getContractFactory('Stake')
    const stakeArgs: any[] = [nftContract.address, "1000000000000000000"]
    const stakeContract = await stake.deploy(...stakeArgs)
    console.log('Stake:', stakeContract.address)
}

main()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error)
        process.exit(1)
    })
