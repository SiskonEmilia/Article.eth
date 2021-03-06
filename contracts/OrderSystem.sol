pragma solidity ^0.4.17;

contract OrderSystem {
  enum State {unfinished, finished}

  struct Order {
    address seller;
    address buyer;
    uint price;
    State state;
  }

  uint internal orderCounter = 0;
  mapping (uint => Order) internal orders;

  function _createOrder(address writer, uint price) internal returns(uint) {
    orders[orderCounter] = Order(writer, msg.sender, price, State.unfinished);
    return orderCounter++;
  }

  function _finishOrder(uint index) internal {
    require(index < orderCounter);
    require(orders[index].seller == msg.sender);
    require(orders[index].state == State.unfinished);
    msg.sender.transfer(orders[index].price);
    orders[index].state = State.finished;
  }

  function _getOrder(uint index) internal view returns(Order storage) {
    require(index < orderCounter);
    return orders[index];
  }

  function getOrder(uint index) public view returns(address, address, uint, bool) {
    require(index < orderCounter);
    return (orders[index].seller, orders[index].buyer, orders[index].price, orders[index].state == State.finished);
  }
}