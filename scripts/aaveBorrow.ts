import { getWeth, AMOUNT } from "../scripts/getWeth"
import { ethers } from "hardhat"
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers"
import { BigNumber } from "ethers"
import { ILendingPool } from "../typechain-types"
async function main() {
  await getWeth()
  const deployers = await ethers.getSigners()
  const deployer = deployers[0]

  const lendingPool = await getLendingPool(deployer)
  console.log(`LendingPool address ${lendingPool.address}`)

  const wethTokenAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
  await approveErc20(wethTokenAddress, lendingPool.address, AMOUNT, deployer)
  console.log("Depositing...")
  await lendingPool.deposit(wethTokenAddress, AMOUNT, deployer.address, 0)
  console.log("Deposited!")

  let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(
    lendingPool,
    deployer
  )
  const daiPrice = await getDaiPrice()
  const amountDaiToBorrow =
    // availableBorrowsETH.toNumber() * 0.95 * (1 / daiPrice.toNumber())
    availableBorrowsETH.div(daiPrice).toNumber() * 0.95
  console.log(`You can borrow ${amountDaiToBorrow} DAI`)

  const amountDaiToBorrowWei = ethers.utils.parseEther(
    amountDaiToBorrow.toString()
  )
  const daiTokenAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
  await borrowDai(
    daiTokenAddress,
    lendingPool,
    amountDaiToBorrowWei.toString(),
    deployer
  )
  await getBorrowUserData(lendingPool, deployer)
  await repay(amountDaiToBorrowWei, daiTokenAddress, lendingPool, deployer)
  await getBorrowUserData(lendingPool, deployer)
}

async function repay(
  amount: BigNumber,
  daiAddress: string,
  lendingPool: ILendingPool,
  account: SignerWithAddress
) {
  await approveErc20(daiAddress, lendingPool.address, amount, account)
  const repayTx = await lendingPool.repay(
    daiAddress,
    amount,
    1,
    account.address
  )
  await repayTx.wait(1)
  console.log("Repaid")
}

async function getDaiPrice() {
  const daiEthPriceFeed = await ethers.getContractAt(
    "AggregatorV3Interface",
    "0x773616E4d11A78F511299002da57A0a94577F1f4"
  )
  const price: BigNumber = (await daiEthPriceFeed.latestRoundData())[1]
  console.log(`The DAI/ETH prce is ${price.toString()}`)
  return price
}

async function borrowDai(
  daiAddress: string,
  lendingPool: ILendingPool,
  amountDaiToBorrowWei: string,
  account: SignerWithAddress
) {
  const borrowTx = await lendingPool.borrow(
    daiAddress,
    amountDaiToBorrowWei,
    1,
    0,
    account.address
  )

  await borrowTx.wait(1)
  console.log("You have borrowed!")
}

async function getBorrowUserData(
  lendingPool: ILendingPool,
  account: SignerWithAddress
) {
  const { totalCollateralETH, totalDebtETH, availableBorrowsETH } =
    await lendingPool.getUserAccountData(account.address)

  console.log(`you have ${totalCollateralETH} worth of ETH deposited`)
  console.log(`you have ${totalDebtETH} worth of ETH borrowed.`)
  console.log(`you can borrow ${availableBorrowsETH} worth of ETH.`)
  return { availableBorrowsETH, totalDebtETH }
}

async function getLendingPool(account: SignerWithAddress) {
  const lendingPoolAddressesProvider = await ethers.getContractAt(
    "ILendingPoolAddressesProvider",
    "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
    account
  )

  const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool()
  const lendingPool = await ethers.getContractAt(
    "ILendingPool",
    lendingPoolAddress,
    account
  )

  return lendingPool
}

async function approveErc20(
  erc20Address: string,
  spenderAddress: string,
  amountToSpend: BigNumber,
  account: SignerWithAddress
) {
  const erc20Token = await ethers.getContractAt("IERC20", erc20Address, account)

  const tx = await erc20Token.approve(spenderAddress, amountToSpend)
  await tx.wait(1)
  console.log("Approved")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
