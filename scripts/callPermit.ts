import { ethers } from "hardhat";
import dotenv from "dotenv"
dotenv.config()

function getTimeStamp() {
    return Math.floor(Date.now() / 1000)
}


async function main() {
    const signers = await ethers.getSigners()
    // get a provider instance
    const provider = new ethers.JsonRpcProvider(process.env.FANTOM_TESTNET_RPC)
    const chainId = (await provider.getNetwork()).chainId
    const tokenOwner = signers[0]
    const tokenReceiver = signers[4]
    const permitTokenInstance = await ethers.getContractAt("PermitToken", `${process.env.PERMIT_TOKEN_ADDRESS}`)

    let tokenOwnerBalance = await permitTokenInstance.balanceOf(tokenOwner.address)
    let tokenReceiverBalance = await permitTokenInstance.balanceOf(tokenReceiver.address)
    // set token value and deadline
    const value = ethers.parseEther("1");
    const deadline = getTimeStamp() + 4200;
    const ownerNonces = await permitTokenInstance.nonces(tokenOwner.address)
    const domain = {
        name: await permitTokenInstance.name(),
        version: "1",
        chainId: chainId,
        verifyingContract: await permitTokenInstance.getAddress()
    }
    const types = {
        Permit: [{
            name: "owner",
            type: "address"
        },
        {
            name: "spender",
            type: "address"
        },
        {
            name: "value",
            type: "uint256"
        },
        {
            name: "nonce",
            type: "uint256"
        },
        {
            name: "deadline",
            type: "uint256"
        },
        ],
    };

    const values = {
        owner: tokenOwner.address,
        spender: tokenReceiver.address,
        value: value,
        nonce: ownerNonces,
        deadline: deadline
    }

    const signature = await tokenOwner.signTypedData(domain, types, values)
    const sigComponents = ethers.Signature.from(signature)
    

    // verify the Permit type data with the signature
    const recovered = ethers.verifyTypedData(
        domain,
        types,
        values,
        sigComponents
    );

    let transaction = await permitTokenInstance.connect(tokenReceiver).permit(tokenOwner.address, tokenReceiver.address, value, deadline, sigComponents.v, sigComponents.r, sigComponents.s)
    await transaction.wait(1)

    console.log(` allowance: ${((await permitTokenInstance.allowance(tokenOwner.address,tokenReceiver.address)).toString())}`)
    transaction = await permitTokenInstance.connect(tokenReceiver).transferFrom(tokenOwner.address,tokenReceiver.address,value)
    await transaction.wait(1)
    console.log(` tokenOwnerBalance: ${((await permitTokenInstance.balanceOf(tokenOwner.address))).toString()}`)
    console.log(` tokenReceiverBalance: ${(await permitTokenInstance.balanceOf(tokenReceiver.address)).toString()}`)
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})