/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { PolyjuiceHttpProvider } from '@polyjuice-provider/web3';
import { AddressTranslator } from 'nervos-godwoken-integration';
import 'bootstrap/dist/css/bootstrap.min.css';


import { RandomGenWrapper } from '../lib/contracts/RandomGenWrapper';
import { CONFIG } from '../config';
import getSudtBalance from "../sudt-balance";

async function createWeb3() {
    // Modern dapp browsers...
    if ((window as any).ethereum) {
        const godwokenRpcUrl = CONFIG.WEB3_PROVIDER_URL;
	const providerConfig = {
	    rollupTypeHash: CONFIG.ROLLUP_TYPE_HASH,
	    ethAccountLockCodeHash: CONFIG.ETH_ACCOUNT_LOCK_CODE_HASH,
	    web3Url: godwokenRpcUrl
	};
	const provider = new PolyjuiceHttpProvider(godwokenRpcUrl, providerConfig);
	const web3 = new Web3(provider);

        try {
            // Request account access if needed
            await (window as any).ethereum.enable();
        } catch (error) {
            // User denied account access...
        }

        return web3;
    }

    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
    return null;
}

export function App() {
    const [web3, setWeb3] = useState<Web3>(null);
    const [contract, setContract] = useState<RandomGenWrapper>();
    const [accounts, setAccounts] = useState<string[]>();
    const [l2Balance, setL2Balance] = useState<bigint>();
    const [existingContractIdInputValue, setExistingContractIdInputValue] = useState<string>();
    const [transactionInProgress, setTransactionInProgress] = useState(false);
    const [deployTxHash, setDeployTxHash] = useState<string | undefined>();
    const [listItem, setListItem] = useState([]);
    const [pickResult, setPickResult] = useState<number | undefined>();
    const [sudtBalance, setSudtBalance] = useState<number | undefined>();
    const toastId = React.useRef(null);
    const [polyJuiceAddress, setPolyjuiceAddress] = useState<string | undefined>();
    const [depositAddress, setDepositAddress] = useState<string | undefined>();
    
    useEffect(() => {
        if (accounts?.[0]) {
            const addressTranslator = new AddressTranslator();
            setPolyjuiceAddress(addressTranslator.ethAddressToGodwokenShortAddress(accounts?.[0]));
        } else {
            setPolyjuiceAddress(undefined);
        }
    }, [accounts?.[0]]);

    useEffect(() => {
        if (transactionInProgress && !toastId.current) {
            toastId.current = toast.info(
                'Transaction in progress. Confirm MetaMask signing dialog and please wait...',
                {
                    position: 'top-right',
                    autoClose: false,
                    hideProgressBar: false,
                    closeOnClick: false,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    closeButton: false
                }
            );
        } else if (!transactionInProgress && toastId.current) {
            toast.dismiss(toastId.current);
            toastId.current = null;
        }
    }, [transactionInProgress, toastId.current]);

    const account = accounts?.[0];

    useEffect(() => {
        (async () => {
            if(account){
                const addressTranslator = new AddressTranslator();
                const depositAddress = await addressTranslator.getLayer2DepositAddress(web3, account);
                setDepositAddress(depositAddress.addressString);

                const getBalance = await getSudtBalance(account, CONFIG.SUDT_CONTRACT_ADDRESS)
                setSudtBalance(getBalance)
            }
        })()
    }, [account])

    async function deployContract() {
        const _contract = new RandomGenWrapper(web3);

        try {
            setDeployTxHash(undefined);
            setTransactionInProgress(true);

            const txHash = await _contract.deploy(account);

            setDeployTxHash(txHash);

            setExistingContractAddress(_contract.address);
            toast(
                'Successfully deployed a smart-contract. You can now proceed to get or set the value in a smart contract.',
                { type: 'success' }
            );
        } catch (error) {
            console.error(error);
            toast('There was an error sending your transaction. Please check developer console.');
        } finally {
            setTransactionInProgress(false);
        }
    }

    async function getStoredValue() {
        try {
            const storedData = await contract.getStoredValue(account);
            const parseData = JSON.parse(storedData);
            setListItem(parseData[0]);
            setPickResult(parseData[1]);
            toast('Successfully read latest stored list.', { type: 'success' });
        } catch (error) {
           toast(
               "Nothing stored on this contract before."
           ); 
        }
    }

    async function setExistingContractAddress(contractAddress: string) {
        const _contract = new RandomGenWrapper(web3);
        _contract.useDeployed(contractAddress.trim());

        setContract(_contract);
    }

    async function setNewStoredValue() {
        const pickVal = randomNum(listItem.length-1);
        try {
            setTransactionInProgress(true);
            await contract.setStoredValue(JSON.stringify([listItem, pickVal]), account);
            toast(
                'Your list successfully stored',
                { type: 'success' }
            );
            setPickResult(pickVal)
        } catch (error) {
            console.error(error);
            toast('There was an error sending your transaction. Please check developer console.');
        } finally {
            setTransactionInProgress(false);
        }
    }

    useEffect(() => {
        if (web3) {
            return;
        }

        (async () => {
            const _web3 = await createWeb3();
            setWeb3(_web3);

            const _accounts = [(window as any).ethereum.selectedAddress];
            setAccounts(_accounts);

            if (_accounts && _accounts[0]) {
                const _l2Balance = BigInt(await _web3.eth.getBalance(_accounts[0]));
                setL2Balance(_l2Balance);
            }
        })();
    });

    const LoadingIndicator = () => 
    <div className="d-inline">
        &nbsp;
        <div className="spinner-border spinner-border-sm" role="status">
            <span className="sr-only"></span>
        </div>
    </div>;

    const handleSubmit = (event: any) => {
        event.preventDefault();
        const val = event.target.pick.value
        setListItem([...listItem, ...[val.trim()]])
        event.target.pick.value = ""
    }

    const randomNum = (num: number) => {
        return Math.floor(Math.random() * (num - 1) + 1 )
    }

    return (
        <div className="container">
            <div className="row">
            <div className="col">
            ETH address: <b>{accounts?.[0]}</b>
            <br />
            <br />
            Polyjuice Address: <b>{polyJuiceAddress || "-"}</b>
            <br />
            <br />
            Nervos Layer 2 balance:{' '}
            {l2Balance ? <b> {(l2Balance / 10n ** 8n).toString()} CKB</b> : <LoadingIndicator />}
            <br />
            <br />
            Layer 2 Deposit Address: {depositAddress ? <span className="highlight"><b className="text-break">{depositAddress}</b></span> : <LoadingIndicator />}
            <br />
            <br />
            SUDT Balance: {sudtBalance ? <b>{sudtBalance}</b> : <LoadingIndicator />}
            <br />
            <br />
            Deployed contract address: <b>{contract?.address || '-'}</b>
            <br />
            <br />
            Transaction hash: <b>{deployTxHash || "-"}</b>
            <br />
            <br />
            {depositAddress ? <button className="btn btn-warning" onClick={() => window.open(`https://force-bridge-test.ckbapp.dev/bridge/Ethereum/Nervos?xchain-asset=0x0000000000000000000000000000000000000000&recipient=${depositAddress}`)}>
                Force Bridge</button> : ""}
            </div>
            <div className="col">
            <p>
            After deployed the contract, click to "Add" button to add whatever you want into the list and click to "Pick Random" to pick randomly. 
            Also, with your contract address you can see the last result by clicking "Show Last Result" button.
            </p>
            <div className="row">
                <div className="col">
                    <button className="form form-control btn btn-secondary" onClick={deployContract} disabled={!l2Balance}>
                        Deploy contract
                    </button>
                </div>
                <div className="col">
                    <input className="form form-control"
                        placeholder="Existing contract id"
                        onChange={e => setExistingContractIdInputValue(e.target.value)}
                    />
                    <button className="form form-control btn btn-secondary"
                    disabled={!existingContractIdInputValue || !l2Balance}
                    onClick={() => setExistingContractAddress(existingContractIdInputValue)}>
                    Use existing contract
                </button>
                </div>
            </div>
            <br />
            <form className="form" onSubmit={handleSubmit}>
                <input className="form form-control" name="pick" disabled={!contract} type="text" required />
                <input type="submit" className="btn btn-primary form form-control" disabled={!contract} value="Add" />
            </form>
            <br />
            <br />
            <div className="row">
                <div className="col"><button className="btn btn-success" disabled={listItem.length === 0 || !contract} onClick={setNewStoredValue}>Pick Random</button></div>
                <div className="col"><button className="btn btn-warning" disabled={!contract} onClick={getStoredValue}>Show Last Result</button></div>
                {listItem.length > 0 ? (<div className="col">
                    <button className="btn btn-danger" onClick={() => setListItem([])}>Clear List</button>
                </div>) : (<div></div>)}
            </div>
            <br />
            </div>
            <ToastContainer />
            </div>
            <br />
            {listItem.length > 0 ? (
                <div className="row">
                {pickResult > 0 ? <p className="h4 text-center">Picked <b>{pickResult + 1}th</b> line from the list.</p> : ""}
                <table className="table table-striped text-center">
                    <thead>
                        <tr>
                        <th scope="col">#</th>
                        <th scope="col">Pick</th>
                        <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {listItem.map((key, i) => {
                            return <tr key={i} className={pickResult == i ? "bg-danger text-white" : ""}>
                                <th className="align-middle" scope="row">{i+1}</th>
                                <td className="align-middle">{key}</td>
                                <td className="align-middle"><button className={pickResult == i ? "btn btn-light" : "btn btn-danger"} onClick={() => {listItem.splice(i, 1); setListItem([...listItem])}}>X</button></td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </div>
            ) : (
                <div></div>
            )}
        </div>
    );
}
