pragma solidity >=0.8.0;

contract RandomGen {
  event storeEvent(string _content);
  string items;

  constructor() payable {
    items = "";
  }

  function getStoredItems() public view returns (string memory) {
    return items;
  }
  
  function storeItems(string memory _content) public payable {
     items = _content;
     emit storeEvent(items);
  }
}
