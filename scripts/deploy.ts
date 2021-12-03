import { ethers } from "hardhat";

async function main() {

  const Multisig = await ethers.getContractFactory("Multisig");
  const Mock = await ethers.getContractFactory("MockToken");

  const multisig = await Multisig.deploy(
    [
      "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
      "0xf2C3434806e12EcD177ef9873E1c4d5Eb461533c",
    ],
    1
  );
  
  await multisig.deployed();

  const mockToken = await Mock.deploy();
  await mockToken.deployed()

  await mockToken.transferOwnership(multisig.address);

  await multisig.requestTransferOwnership(
    mockToken.address,
    '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'
  );
  
  await multisig.requestAddNewSigner('0x70997970c51812dc3a010c7d01b50e0d17dc79c8');
  
  await multisig.requestAddNewSigner('0x572B44ecb98388c8A3b2D5cAc0dC644d251291D7');

  await multisig.requestUpdateReqApprovals(2)

  await multisig.revokeApproval(0);
  await multisig.rejectProposal(0);
  
  await multisig.executeMultisigProposal(1);
  await multisig.revokeApproval(2);
  await multisig.executeMultisigProposal(3);
  

  console.log("multisig", multisig.address); 
  console.log("mocktoken", mockToken.address); 
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
