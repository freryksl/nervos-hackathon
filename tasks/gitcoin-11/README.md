## 1. A screenshot of the accounts you created (account list) in ckb-cli.

![account_list](/tasks/gitcoin-11/account_list.PNG)

## 2. A link to the Layer 1 address you funded on the Testnet Explorer.

https://explorer.nervos.org/aggron/address/ckt1qyqvhgka85mav0j9pvkaef0xvwl9huesv7qslrh7hg

## 3. A screenshot of the console output immediately after you have successfully submitted a CKByte deposit to your Tron account on Layer 2.

![deposit](/tasks/gitcoin-11/deposit.PNG)

## 4. A screenshot of the console output immediately after you have successfully issued a smart contract calls on Layer 2.

![smart_contract_call](/tasks/gitcoin-11/smart_contract_call.PNG)

## 5. The transaction hash of the "Contract call" from the console output (in text format).

```
0xfcdfa425882de3b82156a01d7c7dfd37825fe2a373850f485877429a6cd25f61
```

## 6. The contract address that you called (in text format).

```
0x10b9A743B93Bf9770dEb90702c6b0f6247759c1b
```

## 7. The ABI for contract you made a call on (in text format).

```
[
    {
      "inputs": [],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": false,
          "internalType": "string",
          "name": "_content",
          "type": "string"
        }
      ],
      "name": "storeEvent",
      "type": "event"
    },
    {
      "inputs": [],
      "name": "getStoredItems",
      "outputs": [
        {
          "internalType": "string",
          "name": "",
          "type": "string"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    },
    {
      "inputs": [
        {
          "internalType": "string",
          "name": "_content",
          "type": "string"
        }
      ],
      "name": "storeItems",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    }
]
```

## 8. Your Tron address (in text format).

```
THdL6xL3WKZBAP23SF5heN4nh59RRWAXSQ
```