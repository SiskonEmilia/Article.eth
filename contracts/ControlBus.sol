pragma solidity ^0.4.17;
import "./ArticleSystem.sol";
import "./AccountSystem.sol";
import "./OrderSystem.sol";
import "./MailSystem.sol";

contract ControlBus is ArticleSystem, AccountSystem, OrderSystem, MailSystem {
  // Article Management //
  function writeArticle(string headContent, bytes32 hashedContent, uint length) public {
    uint writerIndex = getWriterIndex(msg.sender);
    uint articleIndex = _addArticle(msg.sender, headContent, hashedContent, length);
    writers[writerIndex].workedArticles[writers[writerIndex].articleCounter] = articleIndex;
    _addWriterOwnedArticle(writerIndex, articleIndex);
    writers[writerIndex].articleCounter++;
  }

  function _addWriterOwnedArticle(uint writerIndex, uint articleIndex) 
    internal validWriter(writerIndex) validArticle(articleIndex) {
    writers[writerIndex].account.ownedArticles[writers[writerIndex].account.articleCounter] = OwnedIndex(articleIndex, true);
    writers[writerIndex].account.articleCounter++;
  }

  function _addPublisherOwnedArticle(uint publisherIndex, uint articleIndex)
    internal validPublisher(publisherIndex) validArticle(articleIndex) {
    publishers[publisherIndex].account.ownedArticles[publishers[publisherIndex].account.articleCounter] = OwnedIndex(articleIndex, true);
    publishers[publisherIndex].account.articleCounter++;
  }

  function _reomoveWriterOwnedArticleAt(uint writerIndex, uint articleIndex) 
    internal validWriter(writerIndex) {
      require(articleIndex < getWriterOwnedArticleCount(writerIndex));
      writers[writerIndex].account.ownedArticles[articleIndex].active = false;
    }

  // Order Managemenet //
  function createOrder(address writer) public payable {
    _createOrder(writer, msg.value);
  }

  // articleIndex: index of article in the writer's owned article list
  // orderlist: global index in the list of order
  function finishOrder(uint articleIndex, uint orderIndex) public {
    uint realArticleIndex;
    bool ownership;

    Order storage order = _getOrder(orderIndex);
    uint writerIndex = getWriterIndex(msg.sender);
    uint publisherIndex = getPublisherIndex(order.buyer);
    
    (realArticleIndex, ownership) = getWriterOwnedArticleAt(writerIndex,
     articleIndex);

    require(ownership);
    _changeOwner(realArticleIndex, order.buyer);
    _finishOrder(orderIndex);
    _addPublisherOwnedArticle(publisherIndex, realArticleIndex);
    _reomoveWriterOwnedArticleAt(writerIndex, articleIndex);
  }

  // Mail Management //
  function writeMail(address receiver, string content) public {
    uint sendWriter = writerIndex[msg.sender];
    uint recvWriter = writerIndex[receiver];
    uint sendPublisher = publisherIndex[msg.sender];
    uint recvPublisher = publisherIndex[receiver];

    
    require(sendWriter != 0 && sendPublisher != 0);
    require(recvPublisher != 0 && recvWriter != 0);
    uint index = _sendMail(receiver, content);
    
    if (sendWriter != 0) {
      writers[sendWriter].account.mails[writers[sendWriter].account.mailCounter++]
        = index;
    }
    if (sendPublisher != 0) {
      publishers[sendPublisher].account.mails[publishers[sendPublisher].account.mailCounter++]
        = index;
    }
    
    if (recvWriter != 0) {
      writers[recvWriter].account.mails[writers[recvWriter].account.mailCounter++]
        = index;
    }
    if (recvPublisher != 0) {
      publishers[recvPublisher].account.mails[publishers[recvPublisher].account.mailCounter++]
        = index;
    }
  }
}