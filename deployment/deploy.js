
const etherlime = require('etherlime-lib');
const LIBWrapper = require('../build/LIBWrapper.json');
const deploy = async (network, secret) => {

	// const deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network, '40c2813049e44ec79cb4d7e0d18de173');
	// const result = await deployer.deploy(LIBWrapper);

	const LIBRARY = require('../build/LIBRARY.json');
	const deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network, '40c2813049e44ec79cb4d7e0d18de173');
	const result = await deployer.deploy(
		LIBRARY,
		false,
		"0x491ab57deE536D531F9A90eb66c1cfaa10DEAA34",
		"0xd82D0426eaC976118a5C32f2A8EE50Bf6D196233");

}
module.exports = { deploy }

// const deployer = new etherlime.EtherlimeGanacheDeployer();
// const result = await deployer.deploy(BookLibrary);

// 0x4924d1fD92BcDB63B9Dca043bA9CB5D526a03183 LIB TOKEN
// 0x51ce5fC6cfF638bEeCB7c9094ff2C80c9A669090 LIB WRAPPER
