import { ethers, network } from "hardhat"

const AMOUNT = ethers.utils.parseEther("0.02")

export async function getWeth() {
  const deployers = await ethers.getSigners()
  const deployer = deployers[0]
  // 0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2

  const iWeth = await ethers.getContractAt(
    "IWeth",
    "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
    deployer
  )

  const tx = await iWeth.deposit({ value: AMOUNT })
  await tx.wait(1)
  const wethBalance = await iWeth.balanceOf(deployer.address)
  console.log(`Got ${wethBalance.toString()} WETH`)
}
