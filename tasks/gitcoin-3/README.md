1. A screenshot of the console output immediately after you have successfully issued a smart contract call.

![smart_contract_call](/tasks/gitcoin-3/smart_contract_call.PNG)

2. The transaction hash from the console output (in text format).

```
0x824ffc5f1fa3d3fe5be4ab4d7d521430316a87d300303391444e46335bc9b9c0
```

3. The contract address that you called (in text format).

```
0xA9EFdAbf5503d75AC681291c6983520dD400D15B
```

4. The ABI for contract you made a call on (in text format).

```

[
    {
      "inputs": [],
      "stateMutability": "payable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "uint256",
          "name": "x",
          "type": "uint256"
        }
      ],
      "name": "set",
      "outputs": [],
      "stateMutability": "payable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "get",
      "outputs": [
        {
          "internalType": "uint256",
          "name": "",
          "type": "uint256"
        }
      ],
      "stateMutability": "view",
      "type": "function"
    }
  ]

```