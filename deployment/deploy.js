// const deploy = async (network, secret, etherscanApiKey) => {

// 	const deployer = new etherlime.EtherlimeGanacheDeployer();
// await deployer.deploy(BookLibrary);
// };
// contract address; 0x8f97C5A3FC849234C2b5fdB9fa81D26F7A565298
// tx hash: 0xd708f88e3ffc347d66e985cdf85b75c2e77e78ab57f94987ab278d92c3ab39d0

const etherlime = require('etherlime-lib');
const LIBWrapper = require('../build/LIBWrapper.json');
const deploy = async (network, secret) => {

	// const deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network, '40c2813049e44ec79cb4d7e0d18de173');
	// const result = await deployer.deploy(LIBWrapper);

	const LIBRARY = require('../build/LIBRARY.json');
	const deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network, '40c2813049e44ec79cb4d7e0d18de173');
	const result =	await deployer.deploy(LIBRARY, false, "0x897626b9FC741D1140Ecb19486e561250006F5DC");;

}
module.exports = { deploy }
// const deployer = new etherlime.EtherlimeGanacheDeployer();
// const result = await deployer.deploy(BookLibrary);

// 0x4924d1fD92BcDB63B9Dca043bA9CB5D526a03183 LIB TOKEN
// 0x51ce5fC6cfF638bEeCB7c9094ff2C80c9A669090 LIB WRAPPER
