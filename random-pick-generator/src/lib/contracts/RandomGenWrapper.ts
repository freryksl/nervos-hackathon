import Web3 from 'web3';
import * as RandomGenJSON from '../../../build/contracts/RandomGen.json';
import { RandomGen } from '../../types/RandomGen';

const DEFAULT_SEND_OPTIONS = {
    gas: 6000000
};

export class RandomGenWrapper {
    web3: Web3;

    contract: RandomGen;

    address: string;

    constructor(web3: Web3) {
        this.web3 = web3;
        this.contract = new web3.eth.Contract(RandomGenJSON.abi as any) as any;
    }

    get isDeployed() {
        return Boolean(this.address);
    }

    async getStoredValue(fromAddress: string) {
        const data = await this.contract.methods.getStoredItems().call({ from: fromAddress });
        return data
    }

    async setStoredValue(value: string, fromAddress: string) {
        const tx = await this.contract.methods.storeItems(value).send({
            ...DEFAULT_SEND_OPTIONS,
            from: fromAddress,
            data: value
        });
        return tx;
    }

    async deploy(fromAddress: string) {
        const deployTx = await (this.contract
            .deploy({
                data: RandomGenJSON.bytecode,
                arguments: []
            })
            .send({
                ...DEFAULT_SEND_OPTIONS,
                from: fromAddress,
                to: '0x0000000000000000000000000000000000000000'
            } as any) as any);

        this.useDeployed(deployTx.contractAddress);

        return deployTx.transactionHash;
    }

    useDeployed(contractAddress: string) {
        this.address = contractAddress;
        this.contract.options.address = contractAddress;
    }
}