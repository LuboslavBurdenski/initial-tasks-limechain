const { ethers } = require("ethers");
const LIBRARY = require('./build/LIBRARY.json')
const LIBWrapper = require('./build/LIBWrapper.json')
const run = async function () {
    const providerURL = "http://localhost:8545";
    const walletPrivateKey = "0x7ab741b57e8d94dd7e1a29055646bafde7010f38a900f55bbd7647880faa6ee8";
    const wrapperContractAddress = "0x9eD274314f0fB37837346C425D3cF28d89ca9599";
    const provider = new ethers.providers.JsonRpcProvider(providerURL)
    const wallet = new ethers.Wallet(walletPrivateKey, provider)
    const wrapperContract = new ethers.Contract(wrapperContractAddress, ETHWrapper.abi, wallet)
    const wethAddress = await wrapperContract.WETHToken();

    console.log(wethAddress);

    const tokenContract = new ethers.Contract(wethAddress, WETH.abi, wallet)

    const wrapValue = ethers.utils.parseEther("1")

    const wrapTx = await wrapperContract.wrap({ value: wrapValue })
    await wrapTx.wait();

    let balance = await tokenContract.balanceOf(wallet.address)
    console.log("Balance after wrapping:", balance.toString())

    let contractETHBalance = await provider.getBalance(wrapperContractAddress);
    console.log("Contract ETH balance after wrapping:", contractETHBalance.toString())

    const approveTx = await tokenContract.approve(wrapperContractAddress, wrapValue)
    await approveTx.wait()

    const unwrapTx = await wrapperContract.unwrap(wrapValue)
    await unwrapTx.wait()

    balance = await tokenContract.balanceOf(wallet.address)
    console.log("Balance after unwrapping:", balance.toString())

    contractETHBalance = await provider.getBalance(wrapperContractAddress);
    console.log("Contract ETH balance after unwrapping:", contractETHBalance.toString())
}
run()
//etherlime deploy --file=./deployment/deploy.js --network=ropsten --secret=1ea6a0ac245df86cc26df6d43b333db6e06315235bbf011a1f38a5709e102214`