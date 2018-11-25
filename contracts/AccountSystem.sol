pragma solidity ^0.4.17;

contract AccountSystem {
  struct OwnedIndex {
    uint index;
    bool active;
  }

  struct Account {
    address owner;
    uint articleCounter;
    uint orderCounter;
    uint mailCounter;

    mapping (uint => uint) mails;
    mapping (uint => uint) orders;
    mapping (uint => OwnedIndex) ownedArticles;
  }

  struct Writer {
    Account account;
    uint writerId;
    uint articleCounter;
    mapping (uint => uint) workedArticles;
  }

  struct Publisher {
    Account account;
    uint publisherId;
    uint orderCounter;
    mapping (uint => uint) sentOrders;
  }

  uint internal writerCounter = 1;
  mapping (address => uint) internal writerIndex;
  mapping (uint => Writer) internal writers; 

  uint internal publisherCounter = 1;
  mapping (address => uint) internal publisherIndex;
  mapping (uint => Publisher) internal publishers;

  function createWriter() public {
    require(writerIndex[msg.sender] == 0);
    writers[writerCounter] = Writer(Account(msg.sender, 0, 0, 0), writerCounter, 0);
    writerIndex[msg.sender] = writerCounter;
    writerCounter++;
  }

  function createPublisher() public {
    require(publisherIndex[msg.sender] == 0);
    publishers[publisherCounter] = Publisher(Account(msg.sender, 0, 0, 0), publisherCounter, 0);
    publisherIndex[msg.sender] = publisherCounter;
    publisherCounter++;
  }

  function getWriterCount() public view returns(uint) {
    return writerCounter - 1;
  }

  function getPublisherCount() public view returns(uint) {
    return publisherCounter - 1;
  }

  modifier validWriter(uint index) {
    require(index < writerCounter);
    _;
  }

  modifier validPublisher(uint index) {
    require(index < publisherCounter);
    _;
  }

  function getWriterIndex(address owner) public view returns(uint) {
    require(writerIndex[owner] != 0);
    return writerIndex[owner];
  }

  function getWriterAddress(uint index) public view 
    validWriter(index) returns(address) {
    return writers[index].account.owner;
  }

  function getPublisherAddress(uint index) public view 
    validPublisher(index) returns(address) {
    return publishers[index].account.owner;
  }

  function getPublisherIndex(address owner) public view returns(uint) {
    require(publisherIndex[owner] != 0);
    return publisherIndex[owner];
  }

  function getWriterOwnedArticleCount(uint index) public view 
  validWriter(index) returns(uint) {
    return writers[index].account.articleCounter;
  }

  function getWriterCreatedArticleCount(uint index) public view 
  validWriter(index) returns(uint) {
    return writers[index].articleCounter;
  }

  function getPublisherOwnedArticleCount(uint index) public view 
  validPublisher(index) returns(uint) {
    return publishers[index].account.articleCounter;
  }

  function getWriterOrderCount(uint index) public view 
  validWriter(index) returns(uint) {
    return writers[index].account.orderCounter;
  }

  function getPublisherOrderCount(uint index) public view 
  validPublisher(index) returns(uint) {
    return publishers[index].account.orderCounter;
  }

  function getPublisherCreatedOrderCount(uint index) public view
  validPublisher(index) returns(uint) {
    return publishers[index].orderCounter;
  }

  function getWriterMailCount(uint index) public view 
  validWriter(index) returns(uint) {
    return writers[index].account.mailCounter;
  }

  function getPublisherMailCount(uint index) public view 
  validPublisher(index) returns(uint) {
    return publishers[index].account.mailCounter;
  }

  function _getWriterAt(uint index) internal view 
  validWriter(index) returns(Writer) {
    return writers[index];
  }

  function _getPublisherAt(uint index) internal view 
  validPublisher(index) returns(Publisher) {
    return publishers[index];
  }

  function getWriterOwnedArticleAt(uint writer, uint articleIndex) public view returns(uint, bool) {
    require(articleIndex < getWriterOwnedArticleCount(writer));
    return (writers[writer].account.ownedArticles[articleIndex].index, 
      writers[writer].account.ownedArticles[articleIndex].active);
  }

  function getWriterCreatedArticleAt(uint writer, uint articleIndex) public view returns(uint) {
    require(articleIndex < getWriterCreatedArticleCount(writer));
    return writers[writer].workedArticles[articleIndex];
  }

  function getPublisherOwnedArticleAt(uint publisher, uint articleIndex) public view returns(uint, bool) {
    require(articleIndex < getPublisherOwnedArticleCount(publisher));
    return (publishers[publisher].account.ownedArticles[articleIndex].index, 
      publishers[publisher].account.ownedArticles[articleIndex].active);
  }

  function getWriterOrderAt(uint writer, uint index) public validWriter(writer) view returns(uint) {
    require(index < getWriterOrderCount(writer));
    return writers[writer].account.orders[index];
  }

  function getPublisherOrderAt(uint publisher, uint index) public validPublisher(publisher) view returns(uint) {
    require(index < getPublisherOrderCount(publisher));
    return publishers[publisher].account.orders[index];
  }

  function getPublisherCreatedOrderAt(uint publisher, uint index) public validPublisher(publisher) view returns(uint) {
    require(index < getPublisherCreatedOrderCount(publisher));
    return publishers[publisher].sentOrders[index];
  }

  function getWriterMailAt(uint writer, uint index) public view validWriter(writer) returns(uint) {
    require(index < getWriterMailCount(writer));
    return writers[writer].account.mails[index];
  }

  function getPublisherMailAt(uint publisher, uint index) public view validPublisher(publisher) returns(uint) {
    require(index < getPublisherMailCount(publisher));
    return publishers[publisher].account.mails[index];
  }
}