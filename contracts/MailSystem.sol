pragma solidity ^0.4.17;

contract MailSystem {
  struct Mail {
    address sender;
    address receiver;
    string content;
  }

  uint internal mailCounter = 0;
  mapping (uint => Mail) internal mails;

  function _sendMail(address receiver, string content) internal returns(uint) {
    mails[mailCounter] = Mail(msg.sender, receiver, content);
    return mailCounter++;
  }

  function getMailContentByIndex(uint index) public view returns(string) {
    require(index < mailCounter);
    require(mails[index].receiver == msg.sender || mails[index].sender == msg.sender);
    return mails[index].content;
  }
}