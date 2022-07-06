  
const Web3 = require('web3');
const { PolyjuiceHttpProvider } = require("@polyjuice-provider/web3");
const { AddressTranslator } = require('nervos-godwoken-integration');

const CompiledContractArtifact = require(`../build/contracts/ERC20.json`);
const {CONFIG} = require("./config")

const getSudtBalance = async (ethAddress: string, sudtContract: string) => {
    const ETHEREUM_ADDRESS = ethAddress;
    const SUDT_PROXY_CONTRACT_ADDRESS = sudtContract;

    const polyjuiceConfig = {
        rollupTypeHash: CONFIG.ROLLUP_TYPE_HASH,
        ethAccountLockCodeHash: CONFIG.ETH_ACCOUNT_LOCK_CODE_HASH,
        web3Url: CONFIG.WEB3_PROVIDER_URL
    };

    const provider = new PolyjuiceHttpProvider(
        CONFIG.WEB3_PROVIDER_URL,
        polyjuiceConfig,
    );

    const web3 = new Web3(provider);

    const addressTranslator = new AddressTranslator();
    const polyjuiceAddress = addressTranslator.ethAddressToGodwokenShortAddress(ETHEREUM_ADDRESS);

    const contract = new web3.eth.Contract(CompiledContractArtifact.abi, SUDT_PROXY_CONTRACT_ADDRESS);
    const balance = await contract.methods.balanceOf(polyjuiceAddress).call({
        from: ETHEREUM_ADDRESS
    });
    return balance
}

export default getSudtBalance
