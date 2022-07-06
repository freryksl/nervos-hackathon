## 1. Screenshots or video of your application running on Godwoken.

**Click on the image below to watch the video.**

[![preview](https://img.youtube.com/vi/9Qv0pSMooMg/maxresdefault.jpg)](https://youtu.be/9Qv0pSMooMg)

**Screenshots**

![ss_1](/tasks/gitcoin-7/ss_1.png)

![ss_2](/tasks/gitcoin-7/ss_2.png)

![ss_3](/tasks/gitcoin-7/ss_3.png)

## 2. Link to the GitHub repository with your application which has been ported to Godwoken. This must be a different application than the one covered in this guide.

[Random Pick Generator](/random-pick-generator)

## 3. If you deployed any smart contracts as part of this tutorial, please provide the transaction hash of the deployment transaction, the deployed contract address, and the ABI of the deployed smart contract. (Provide all in text format.)

Deployed Contract Address:
```
0x10b9A743B93Bf9770dEb90702c6b0f6247759c1b
```

Transaction Hash:
```
0x707a8d3a8a637a2410e74571b13ec05583da7d9b9bbcb5b856c0cbb4c1aef9c5
```

```
"abi": [
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