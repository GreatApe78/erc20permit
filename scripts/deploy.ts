import { ethers } from "hardhat";
import {saveDeployment} from "deployment-history"
async function main() {
  const PermitToken_Factory = await ethers.getContractFactory("PermitToken");
  const network = await ethers.provider.getNetwork()
  const permitToken = await PermitToken_Factory.deploy();
  const address = await permitToken.getAddress();
  console.log("PermitToken deployed to:", address);
  saveDeployment("PermitToken "+address, network.name);

}


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
