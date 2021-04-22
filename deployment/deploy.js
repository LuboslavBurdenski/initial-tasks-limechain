//const deploy = async (network, secret, etherscanApiKey) => {

//	const deployer = new etherlime.EtherlimeGanacheDeployer();
// await deployer.deploy(BookLibrary);
//};
//contract address; 0x8f97C5A3FC849234C2b5fdB9fa81D26F7A565298
//tx hash: 0xd708f88e3ffc347d66e985cdf85b75c2e77e78ab57f94987ab278d92c3ab39d0

const etherlime = require('etherlime-lib');
const BookLibrary = require('../build/BookLibrary.json');
const deploy = async (network, secret) => {
	const deployer = new etherlime.InfuraPrivateKeyDeployer(secret, network, '40c2813049e44ec79cb4d7e0d18de173');
	const result = await deployer.deploy(BookLibrary);
	// const deployer = new etherlime.EtherlimeGanacheDeployer();
	// const result = await deployer.deploy(BookLibrary);

}
module.exports = { deploy }