import { ethers } from "hardhat"

export interface networkConfigItemInterface {
  name: string
  vrfCoordinatorV2?: string
  waitConfirmations?: number
  entranceFee: string
  gasLane: string
  subsciptionId?: string
  callbackGasLimit?: string
  interval: string
}

export interface networkConfigInterface {
  [key: number]: networkConfigItemInterface
}

export const networkConfig: networkConfigInterface = {
  4: {
    name: "rinkeby",
    vrfCoordinatorV2: "0x6168499c0cFfCaCD319c818142124B7A15E857ab",
    waitConfirmations: 6,
    entranceFee: "0.01",
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    subsciptionId: "8726",
    callbackGasLimit: "500000",
    interval: "30",
  },
  31337: {
    name: "hardhat",
    entranceFee: "0.01",
    gasLane:
      "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
    callbackGasLimit: "500000",
    interval: "30",
  },
}

export const developmentChains = ["hardhat", "localhost"]
