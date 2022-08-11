import { getWeth } from "../scripts/getWeth"
import { ethers } from "hardhat"
async function main() {
  await getWeth()
  const deployers = await ethers.getSigners()
  const deployer = deployers[0]

  // Landing pool address 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
