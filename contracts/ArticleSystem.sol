pragma solidity ^0.4.17;

contract ArticleSystem {
  struct Content {
    string headContent;
    bytes32 hashedContent;
    uint length;
  }

  struct Article {
    address writer;
    address owner;
    Content articleContent;
  }

  uint articleCounter = 0;
  mapping (uint => Article) articles;

  modifier validArticle(uint index) {
    require(index < articleCounter);
    _;
  }

  function _addArticle(address _writer, string headContent,
    bytes32 hashedContent, uint length) internal returns(uint)
  {
      articles[articleCounter] = Article(_writer, _writer, 
        Content(headContent, keccak256(abi.encodePacked(hashedContent)), length));
      return articleCounter++;
  }

  function getArticle(uint articleIndex) public view returns(address, string) {
    require(articleIndex < articleCounter);
    return (articles[articleIndex].writer, articles[articleIndex].articleContent.headContent);
  }

  function _changeOwner(uint articleIndex, address targetOwner) internal {
    require(articleIndex < articleCounter);
    require(articles[articleIndex].owner == msg.sender);
    articles[articleIndex].owner = targetOwner;
  }

  function verifyArticle(uint articleIndex, string article, uint length) public view returns (bool) {
    require(articleIndex < articleCounter);

    return (articles[articleIndex].articleContent.length == length &&
      articles[articleIndex].articleContent.hashedContent == keccak256(abi.encodePacked(keccak256(abi.encodePacked(article)))));
  }
}