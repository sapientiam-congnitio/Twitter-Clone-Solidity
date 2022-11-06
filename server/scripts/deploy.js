const { ethers } = require("hardhat")

async function main() {
    const TwitterContract = await ethers.getContractFactory("TwitterContract")
    const twitterContract = await TwitterContract.deploy()
    await twitterContract.deployed()
    console.log("Deployed!)")
    console.log(`Address: ${twitterContract.address}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
