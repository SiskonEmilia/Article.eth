// Import the page's CSS. Webpack will know what to do with it.
import '../styles/app.css'

// Import libraries we need.
import { default as Web3 } from 'web3'
import { default as contract } from 'truffle-contract'

// Import our contract artifacts and turn them into usable abstractions.
import controlBus from '../../build/contracts/ControlBus.json'

// MetaCoin is our usable abstraction, which we'll use through the code below.
window.ControlBus = contract(controlBus);
window.controlBusInstance = null;

let main = new Vue({
  el: '#main',
  data: {
    // null for logo
    // 1 for Article System
    // 2 for Order System
    // 3 for Mail System
    currentSystem: null,
    mainLoading: false,
    loginStatus: false,
    // Login Dialog //
    loginDialogVisible: false,
    isWriterLoading: false,
    isPublisherLoading: false,
    currentAccount: undefined,
    // 0 for writer
    // 1 for publisher
    accountType: null,
    accountIndex: 0,

    // Article System //
    activeArticleLabel: "owned",
    articles: [],
    writingDialogVisible: false,
    newArticle: {
      title: '',
      content: '',
      limit: 0,
    },
    verifyingArticleIndex: 0,
    verifyDialogVisible: false,
    toVerify: {
      title: '',
      content: '',
    },

    // Order System //
    activeOrderLabel: 'received',
    orders: [],
    sendingOrderDialogVisible: false,
    newOrder: {
      to: '',
      price: 0,
    },
    finishingOrderIndex: 0,
    finishingOrderDialogVisible: false,
    ownedArticles: [],
    chosenArticleRow: null,
    chooseLoading: false,
    gainedPrice: 0,

    // Mail System //
    mails: [{
      mailId: 0,
      from: "0x0000",
      to:   "0x0000",
      content: "123"
    }],
    writingMailDialogVisible: false,
    newMail: {
      to: '',
      content: '',
    },

    // User List //
    activeUserLabel: 'writers',
    users: [{
      userId: 0,
      address: '0x000000',
      count1: 0,
      count2: 0,
    }],
    viewingUserIndex: 0,
    writerDetailDialogVisible: false,
    publisherDetailDialogVisible: false,
    writerDetail: [],
    publisherDetail: [],
    writerDetailLoading: false,
    publisherDetailLoading: false,
    userListLabel1: '',
    userListLabel2: '',


  },
  methods: {
    handleMenuSelect: function (key, keyPath) {
      this.currentSystem = key;
      switch(key) {
        case '1':
          this.activeArticleLabel = 'owned';
          this.loadOwnedArticle();
          break;
        case '2':
          this.activeOrderLabel = 'received';
          this.loadReceivedOrder();
          break;
        case '3':
          this.loadMail();
          break;
        default:
          this.activeUserLabel = 'writers';
          this.loadWriter();
          break;
      }
    },
    homeButtonClicked: function() {
      document.getElementById("scrollContainer").scrollTo({
        top: 0, 
        left: 0, 
        behavior: 'smooth'
      });
    },
    articleTabClicked: function(key, event) {
      if (this.activeArticleLabel === 'owned') {
        this.loadOwnedArticle();
      } else {
        this.loadCreatedArticle();
      }
    },
    orderTabClicked: function(key, event) {
      if (this.activeOrderLabel === 'received') {
        this.loadReceivedOrder();
      } else {
        this.loadSentOrder();
      }
    },
    userTabClicked: function(key, event) {
      if (this.activeUserLabel === 'writers') {
        this.loadWriter();
      } else {
        this.loadPublisher();
      }
    },
    loadOwnedArticle: function() {
      this.mainLoading = true;
      this.articles.length = 0;
      ((this.accountType === 0) ? controlBusInstance.getWriterOwnedArticleCount(this.accountIndex) 
        : controlBusInstance.getPublisherOwnedArticleCount(this.accountIndex))
        .then(result => {
          let ownedCount = result.toNumber();
          if (ownedCount === 0) {
            this.mainLoading = false;
            return;
          }
          let doneCount = 0;
          for (let i = 0; i < ownedCount; ++i) {
            let personalIndex = Number(i);
            ((this.accountType === 0) ? controlBusInstance.getWriterOwnedArticleAt(this.accountIndex, personalIndex) 
              : controlBusInstance.getPublisherOwnedArticleAt(this.accountIndex, personalIndex))
            .then(result => {
              let realIndex = result[0].toNumber();
              if (result[1] === true) {
                controlBusInstance.getArticle(realIndex)
                .then(result => {
                  let lines = result[1].split('\n');
                  this.articles.push({
                    articleId: realIndex,
                    title: lines[0],
                    author: String(result[0]),
                    content: lines.splice(1).join('\n') + '...',
                  })
                })
                .catch(error => {
                  this.$message.error("Error: Failed to query article content");
                  console.log(error);
                })
                .then(() => {
                  if (++doneCount === ownedCount)
                    this.mainLoading = false;
                })
              } else {
                if (++doneCount === ownedCount)
                  this.mainLoading = false;
              }
            })
            .catch(error => {
              this.$message.error("Error: Failed to query article index");
              console.log(error);
              if (++doneCount === ownedCount)
                  this.mainLoading = false;
            })
          }
        })
        .catch(error => {
          this.$message.error("Error: Failed to query article count");
          console.log(error);
          this.mainLoading = false;
        })
    },
    loadCreatedArticle: function() {
      this.mainLoading = true;
      this.articles.length = 0;
      controlBusInstance.getWriterCreatedArticleCount(this.accountIndex)
        .then(result => {
          let createdCount = result.toNumber();
          if (createdCount === 0) {
            this.mainLoading = false;
            return;
          }
          let doneCount = 0;
          for (let i = 0; i < createdCount; ++i) {
            let personalIndex = Number(i);
            controlBusInstance.getWriterCreatedArticleAt(this.accountIndex, personalIndex)
            .then(result => {
              let realIndex = result.toNumber();
              controlBusInstance.getArticle(realIndex)
              .then(result => {
                let lines = result[1].split('\n');
                this.articles.push({
                  articleId: realIndex,
                  title: lines[0],
                  author: String(result[0]),
                  content: lines.splice(1).join('\n') + '...',
                })
              })
              .catch(error => {
                this.$message.error("Error: Failed to query article content");
                console.log(error);
              })
              .then(() => {
                if (++doneCount === createdCount)
                  this.mainLoading = false;
              })
            })
            .catch(error => {
              this.$message.error("Error: Failed to query article index");
              console.log(error);
              if (++doneCount === createdCount)
                  this.mainLoading = false;
            })
          }
        })
        .catch(error => {
          this.$message.error("Error: Failed to query article count");
          console.log(error);
          this.mainLoading = false;
        })
    },
    writerClicked: function() {
      this.isWriterLoading = true;
      
      if (web3.eth.accounts[0] === undefined) {
        this.$message.error("Error: No available account");
        this.isWriterLoading = false;
      } 
      else {
        controlBusInstance.getWriterIndex(web3.eth.accounts[0])
          .then(result=>{
            this.$message.success("Welcome, writer " + String(web3.eth.accounts[0]));
            this.loginStatus = true;
            this.currentSystem = '0';
            this.isWriterLoading = false;
            this.loginDialogVisible = false;
            this.currentAccount = web3.eth.accounts[0];
            this.accountType = 0;
            this.accountIndex = result.toNumber();
          })
          .catch(error=>{
            console.log(error);
            this.$message.info("Creating new writer account for you...");
            controlBusInstance.createWriter({from: web3.eth.accounts[0]})
              .then(result=>{
                this.writerClicked();
              })
              .catch(error=>{
                console.log(error);
                this.$message.error("Error: Failed to create new writer account");
                this.isWriterLoading = false;
              });
          })
      }
    },
    publisherClicked: function() {
      this.isPublisherLoading = true;

      if (web3.eth.accounts[0] === undefined) {
        this.$message.error("Error: No available account");
        this.isPublisherLoading = false;
      } else {
        controlBusInstance.getPublisherIndex(web3.eth.accounts[0])
          .then(result=>{
            this.$message.success("Welcome, publisher " + String(web3.eth.accounts[0]));
            this.loginStatus = true;
            this.currentSystem = '0';
            this.isPublisherLoading = false;
            this.loginDialogVisible = false;
            this.currentAccount = web3.eth.accounts[0];
            this.accountType = 1;
            this.accountIndex = result.toNumber();
          })
          .catch(error=>{
            console.log(error);
            this.$message.info("Creating new publisher account for you...");
            controlBusInstance.createPublisher({from: web3.eth.accounts[0]})
              .then(result=>{
                this.publisherClicked();
              })
              .catch(error=>{
                console.log(error);
                this.$message.error("Error: Failed to create new publisher account");
                this.isPublisherLoading = false;
              });
          })
      }
    },
    createArticle: function() {
      this.$refs['newArticleForm'].validate((valid) => {
        if (valid) {
          let fullText = this.newArticle.title + '\n' + this.newArticle.content;
          let visibleText = this.newArticle.title + '\n' + this.newArticle.content.substr(0, this.newArticle.limit);     
          this.$message.info("Creating article for you...")
          
          controlBusInstance.writeArticle(visibleText, web3.sha3(fullText), fullText.length, {from: web3.eth.accounts[0]})
            .then(result => {
              this.$message.success("Your article has been successfully created")
              this.newArticle.title = '';
              this.newArticle.content = '';
              this.newArticle.limit = 0;
              this.writingDialogVisible = false;
              this.loadCreatedArticle();
            })
            .catch(error => {
              this.$message.error("Error: Failed to create article");
              console.log(error);
            });
          return false;
        } else {
          this.$message.warning("Some mistakes remained in your form.")
          return false;
        }
      });
    },
    verifyClicked: function(articleId) {
      this.verifyingArticleIndex = articleId;
      this.verifyDialogVisible = true;
    },
    verifyArticle: function() {
      this.$refs['verifyForm'].validate((valid) => {
        if (valid) {
          let fullText = this.toVerify.title + '\n' + this.toVerify.content;
          controlBusInstance.verifyArticle(this.verifyingArticleIndex, fullText, fullText.length)
          .then(result => {
            if (result === true) {
              this.$message.success("Matches! This is the article you're looking for.");
            }
            else {
              this.$message.warning("Not Match! These two articles are different.");
            }
          })
          .catch(error => {
            this.$message.error("Error: Failed to verify this article");
            console.log(error);
          })
          return false;
        } else {
          this.$message.warning("Some mistakes remained in your form.")
          return false;
        }
      });
    },

    // Order System //
    loadReceivedOrder: function() {
      this.mainLoading = true;
      this.orders.length = 0;
      ((this.accountType === 0) ? controlBusInstance.getWriterOrderCount(this.accountIndex) 
        : controlBusInstance.getPublisherOrderCount(this.accountIndex))
        .then(result => {
          let receivedCount = result.toNumber();
          if (receivedCount === 0) {
            this.mainLoading = false;
            return;
          }
          let doneCount = 0;
          for (let i = 0; i < receivedCount; ++i) {
            let personalIndex = Number(i);
            ((this.accountType === 0) ? controlBusInstance.getWriterOrderAt(this.accountIndex, personalIndex) 
              : controlBusInstance.getPublisherOrderAt(this.accountIndex, personalIndex))
            .then(result => {
              let realIndex = result.toNumber();
              controlBusInstance.getOrder(realIndex)
              .then(result => {
                this.orders.push({
                  orderId: realIndex,
                  to: result[0],
                  from: result[1],
                  price: web3.fromWei(result[2].toNumber(), "ether"),
                  isDone: result[3],
                })
              })
              .catch(error => {
                this.$message.error("Error: Failed to query order content");
                console.log(error);
              })
              .then(() => {
                if (++doneCount === receivedCount)
                  this.mainLoading = false;
              })
              
            })
            .catch(error => {
              this.$message.error("Error: Failed to query order index");
              console.log(error);
              if (++doneCount === receivedCount)
                  this.mainLoading = false;
            })
          }
        })
        .catch(error => {
          this.$message.error("Error: Failed to query order count");
          console.log(error);
          this.mainLoading = false;
        })
    },
    loadSentOrder: function() {
      this.mainLoading = true;
      this.orders.length = 0;
      controlBusInstance.getPublisherCreatedOrderCount(this.accountIndex)
        .then(result => {
          let sentCount = result.toNumber();
          if (sentCount === 0) {
            this.mainLoading = false;
            return;
          }
          let doneCount = 0;
          for (let i = 0; i < sentCount; ++i) {
            let personalIndex = Number(i);
            controlBusInstance.getPublisherCreatedOrderAt(this.accountIndex, personalIndex)
            .then(result => {
              let realIndex = result.toNumber();
              controlBusInstance.getOrder(realIndex)
              .then(result => {
                this.orders.push({
                  orderId: realIndex,
                  to: result[0],
                  from: result[1],
                  price: web3.fromWei(result[2].toNumber(), "ether"),
                  isDone: result[3],
                })
              })
              .catch(error => {
                this.$message.error("Error: Failed to query order content");
                console.log(error);
              })
              .then(() => {
                if (++doneCount === sentCount)
                  this.mainLoading = false;
              })
            })
            .catch(error => {
              this.$message.error("Error: Failed to query order index");
              console.log(error);
              if (++doneCount === sentCount)
                  this.mainLoading = false;
            })
          }
        })
        .catch(error => {
          this.$message.error("Error: Failed to query order count");
          console.log(error);
          this.mainLoading = false;
        })
    },
    sendOrder: function() {
      this.$refs['sendOrderForm'].validate((valid) => {
        if (valid) {
          this.$message.info("Sending order...");
          controlBusInstance.createOrder(this.newOrder.to, {
            from: this.currentAccount,
            value: web3.toWei(this.newOrder.price, "ether"),
          })
          .then(result => {
            this.$message.success("Your order has been sent to the writer.")
            this.newOrder.price = 0;
            this.newOrder.to = '';
            this.sendingOrderDialogVisible = false;
            this.loadSentOrder();
          })
          .catch(error => {
            this.$message.error("Error: Failed to send order");
            console.log(error);
          })
          return false;
        } else {
          this.$message.warning("Some mistakes remained in your form.")
          return false;
        }
      });
    },
    finishClicked: function(orderId, price) {
      this.finishingOrderDialogVisible = true;
      this.finishingOrderIndex = orderId;
      this.gainedPrice = price;
      this.loadChoosingOwnedArticles();
    },
    handleChooseChanged: function(rowNumber) {
      this.chosenArticleRow = rowNumber;
    },
    loadChoosingOwnedArticles: function() {
      this.chooseLoading = true;
      this.ownedArticles.length = 0;
      ((this.accountType === 0) ? controlBusInstance.getWriterOwnedArticleCount(this.accountIndex) 
        : controlBusInstance.getPublisherOwnedArticleCount(this.accountIndex))
        .then(result => {
          let ownedCount = result.toNumber();
          if (ownedCount === 0) {
            this.chooseLoading = false;
            return;
          }
          let doneCount = 0;
          for (let i = 0; i < ownedCount; ++i) {
            let personalIndex = Number(i);
            ((this.accountType === 0) ? controlBusInstance.getWriterOwnedArticleAt(this.accountIndex, personalIndex) 
              : controlBusInstance.getPublisherOwnedArticleAt(this.accountIndex, personalIndex))
            .then(result => {
              let realIndex = result[0].toNumber();
              if (result[1] === true) {
                controlBusInstance.getArticle(realIndex)
                .then(result => {
                  let lines = result[1].split('\n');
                  this.ownedArticles.push({
                    articleId: personalIndex,
                    title: lines[0],
                    author: String(result[0]),
                    content: lines.splice(1).join('\n') + '...',
                  })
                })
                .catch(error => {
                  this.$message.error("Error: Failed to query article content");
                  console.log(error);
                })
                .then(() => {
                  if (++doneCount === ownedCount)
                    this.chooseLoading = false;
                })
              } else {
                if (++doneCount === ownedCount)
                  this.chooseLoading = false;
              }
            })
            .catch(error => {
              this.$message.error("Error: Failed to query article index");
              console.log(error);
              if (++doneCount === ownedCount)
                  this.chooseLoading = false;
            })
          }
        })
        .catch(error => {
          this.$message.error("Error: Failed to query article count");
          console.log(error);
          this.chooseLoading = false;
        })
    },
    finishOrder: function() {
      if (this.chosenArticleRow === null) {
        this.$message.warning("You need to choose an available article first");
        return false;
      }
      this.$message.info("Finishing order...");
      controlBusInstance.finishOrder(
        this.chosenArticleRow.articleId,
        this.finishingOrderIndex,
        {from:this.currentAccount})
      .then(result=>{
        this.$message.success("You've finished this order and gained " + 
          String(this.gainedPrice) + " eth");
        this.finishingOrderDialogVisible = false;
        this.chosenArticleRow = null;
        this.loadReceivedOrder();
      })
      .catch(error=>{
        this.$message.error("Error: Failed to finish this order");
        console.log(error);
      })
      return false;
    },

    // Mail System //
    loadMail: function() {
      this.mainLoading = true;
      this.mails.length = 0;
      ((this.accountType === 0) ? controlBusInstance.getWriterMailCount(this.accountIndex) 
        : controlBusInstance.getPublisherMailCount(this.accountIndex))
        .then(result => {
          let mailCount = result.toNumber();
          if (mailCount === 0) {
            this.mainLoading = false;
            return;
          }
          let doneCount = 0;
          for (let i = 0; i < mailCount; ++i) {
            let personalIndex = Number(i);
            ((this.accountType === 0) ? controlBusInstance.getWriterMailAt(this.accountIndex, personalIndex) 
              : controlBusInstance.getPublisherMailAt(this.accountIndex, personalIndex))
            .then(result => {
              let realIndex = result.toNumber();
              controlBusInstance.getMail(realIndex)
              .then(result => {
                this.mails.push({
                  mailId: realIndex,
                  from: result[0],
                  to: result[1],
                  content: result[2],
                })
              })
              .catch(error => {
                this.$message.error("Error: Failed to query mail content");
                console.log(error);
              })
              .then(() => {
                if (++doneCount === mailCount)
                  this.mainLoading = false;
              })
            })
            .catch(error => {
              this.$message.error("Error: Failed to query mail index");
              console.log(error);
              if (++doneCount === mailCount)
                  this.mainLoading = false;
            })
          }
        })
        .catch(error => {
          this.$message.error("Error: Failed to query mail count");
          console.log(error);
          this.mainLoading = false;
        })
    },
    sendMail: function() {
      this.$refs['sendMailForm'].validate((valid) => {
        if (valid) {
          this.$message.info("Sending mail for you...");
          controlBusInstance.writeMail(this.newMail.to, 
            this.newMail.content,
            {from: this.currentAccount,})
          .then(result => {
            this.$message.success("Mail sent successfully.")
            this.newMail.to = '';
            this.newMail.content = '';
            this.writingMailDialogVisible = false;
            this.loadMail();
          })
          .catch(error => {
            this.$message.error("Error: Failed to send mail");
            console.log(error);
          })
          return false;
        } else {
          this.$message.warning("Some mistakes remained in your form.")
          return false;
        }
      });
    },

    // User List//
    loadWriter: function() {
      this.userListLabel1 = 'Created Article Count';
      this.userListLabel2 = 'Received Order Count';
      this.mainLoading = true;
      this.users.length = 0;

      controlBusInstance.getWriterCount()
      .then(result => {
        let writerCount = result.toNumber() + 1;
        if (writerCount === 1) {
          this.mainLoading = false;
          return;
        }
        let doneCount = 1;
        for (let index = 1; index < writerCount; ++index) {
          let writerIndex = Number(index);
          let writer = {};
          let isError = false;
          
          controlBusInstance.getWriterAddress(writerIndex)
          .then(result => {
            writer.address = String(result);
            if (writer.address !== undefined &&
              writer.count1 !== undefined &&
              writer.count2 !== undefined) {
                writer.userId = writerIndex;
                this.users.push(writer);
                if (++doneCount === writerCount)
                  this.mainLoading = false;
            }
          })
          .catch(error => {
            this.$message.error("Error: Failed to query writer address");
            console.log(error);
            if (isError === false) {
              isError = true;
              if (++doneCount === writerCount)
                  this.mainLoading = false;
            }
          })

          controlBusInstance.getWriterCreatedArticleCount(writerIndex)
          .then(result => {
            writer.count1 = result.toNumber();
            if (writer.address !== undefined &&
              writer.count1 !== undefined &&
              writer.count2 !== undefined) {
                writer.userId = writerIndex;
                this.users.push(writer);
                if (++doneCount === writerCount)
                  this.mainLoading = false;
            }
          })
          .catch(error => {
            this.$message.error("Error: Failed to query writer article count");
            console.log(error);
            if (isError === false) {
              isError = true;
              if (++doneCount === writerCount)
                  this.mainLoading = false;
            }
          })

          controlBusInstance.getWriterOrderCount(writerIndex)
          .then(result => {
            writer.count2 = result.toNumber();
            if (writer.address !== undefined &&
              writer.count1 !== undefined &&
              writer.count2 !== undefined) {
                writer.userId = writerIndex;
                this.users.push(writer);
                if (++doneCount === writerCount)
                  this.mainLoading = false;
            }
          })
          .catch(error => {
            this.$message.error("Error: Failed to query writer order count");
            console.log(error);
            if (isError === false) {
              isError = true;
              if (++doneCount === writerCount)
                  this.mainLoading = false;
            }
          })
        }
      })
      .catch(error => {
        this.$message.error("Error: Failed to query writer count")
        console.log(error);
      })

    },
    loadPublisher: function() {
      this.userListLabel1 = 'Owned Article Count';
      this.userListLabel2 = 'Sent Order Count';
      this.mainLoading = true;
      this.users.length = 0;

      controlBusInstance.getPublisherCount()
      .then(result => {
        let PublisherCount = result.toNumber() + 1;
        if (PublisherCount === 1) {
          this.mainLoading = false;
          return;
        }
        let doneCount = 1;
        for (let index = 1; index < PublisherCount; ++index) {
          let PublisherIndex = Number(index);
          let Publisher = {};
          let isError = false;
          
          controlBusInstance.getPublisherAddress(PublisherIndex)
          .then(result => {
            Publisher.address = String(result);
            if (Publisher.address !== undefined &&
              Publisher.count1 !== undefined &&
              Publisher.count2 !== undefined) {
                Publisher.userId = PublisherIndex;
                this.users.push(Publisher);
                if (++doneCount === PublisherCount)
                  this.mainLoading = false;
            }
          })
          .catch(error => {
            this.$message.error("Error: Failed to query Publisher address");
            console.log(error);
            if (isError === false) {
              isError = true;
              if (++doneCount === PublisherCount)
                  this.mainLoading = false;
            }
          })

          controlBusInstance.getPublisherOwnedArticleCount(PublisherIndex)
          .then(result => {
            Publisher.count1 = result.toNumber();
            if (Publisher.address !== undefined &&
              Publisher.count1 !== undefined &&
              Publisher.count2 !== undefined) {
                Publisher.userId = PublisherIndex;
                this.users.push(Publisher);
                if (++doneCount === PublisherCount)
                  this.mainLoading = false;
            }
          })
          .catch(error => {
            this.$message.error("Error: Failed to query Publisher article count");
            console.log(error);
            if (isError === false) {
              isError = true;
              if (++doneCount === PublisherCount)
                  this.mainLoading = false;
            }
          })

          controlBusInstance.getPublisherCreatedOrderCount(PublisherIndex)
          .then(result => {
            Publisher.count2 = result.toNumber();
            if (Publisher.address !== undefined &&
              Publisher.count1 !== undefined &&
              Publisher.count2 !== undefined) {
                Publisher.userId = PublisherIndex;
                this.users.push(Publisher);
                if (++doneCount === PublisherCount)
                  this.mainLoading = false;
            }
          })
          .catch(error => {
            this.$message.error("Error: Failed to query Publisher order count");
            console.log(error);
            if (isError === false) {
              isError = true;
              if (++doneCount === PublisherCount)
                  this.mainLoading = false;
            }
          })
        }
      })
      .catch(error => {
        this.$message.error("Error: Failed to query writer count")
        console.log(error);
      })
    },
    viewDetail: function(userId) {
      if (this.activeUserLabel === 'writers') {
        this.loadArticles(userId);
        this.writerDetailDialogVisible = true;
      } else {
        this.loadOrders(userId);
        this.publisherDetailDialogVisible = true;
      }
    },
    loadArticles: function(writerId) {
      this.writerDetailLoading = true;
      this.writerDetail.length = 0;
      controlBusInstance.getWriterCreatedArticleCount(writerId)
        .then(result => {
          let createdCount = result.toNumber();
          if (createdCount === 0) {
            this.writerDetailLoading = false;
            return;
          }
          let doneCount = 0;
          for (let i = 0; i < createdCount; ++i) {
            let personalIndex = Number(i);
            controlBusInstance.getWriterCreatedArticleAt(writerId, personalIndex)
            .then(result => {
              let realIndex = result.toNumber();
              controlBusInstance.getArticle(realIndex)
              .then(result => {
                let lines = result[1].split('\n');
                this.writerDetail.push({
                  articleId: realIndex,
                  title: lines[0],
                  author: String(result[0]),
                  content: lines.splice(1).join('\n') + '...',
                })
              })
              .catch(error => {
                this.$message.error("Error: Failed to query article content");
                console.log(error);
              })
              .then(() => {
                if (++doneCount === createdCount)
                  this.writerDetailLoading = false;
              })
            })
            .catch(error => {
              this.$message.error("Error: Failed to query article index");
              console.log(error);
              if (++doneCount === createdCount)
                  this.writerDetailLoading = false;
            })
          }
        })
        .catch(error => {
          this.$message.error("Error: Failed to query article count");
          console.log(error);
          this.writerDetailLoading = false;
        })
    },
    loadOrders: function(publisherId) {
      this.publisherDetailLoading = true;
      this.publisherDetail.length = 0;
      controlBusInstance.getPublisherCreatedOrderCount(publisherId)
        .then(result => {
          let sentCount = result.toNumber();
          if (sentCount === 0) {
            this.publisherDetailLoading = false;
            return;
          }
          let doneCount = 0;
          for (let i = 0; i < sentCount; ++i) {
            let personalIndex = Number(i);
            controlBusInstance.getPublisherCreatedOrderAt(publisherId, personalIndex)
            .then(result => {
              let realIndex = result.toNumber();
              controlBusInstance.getOrder(realIndex)
              .then(result => {
                this.publisherDetail.push({
                  orderId: realIndex,
                  to: result[0],
                  from: result[1],
                  price: web3.fromWei(result[2].toNumber(), "ether"),
                  isDone: (result[3]) ? 'Yes' : 'No',
                })
              })
              .catch(error => {
                this.$message.error("Error: Failed to query order content");
                console.log(error);
              })
              .then(() => {
                if (++doneCount === sentCount)
                  this.publisherDetailLoading = false;
              })
            })
            .catch(error => {
              this.$message.error("Error: Failed to query order index");
              console.log(error);
              if (++doneCount === sentCount)
                  this.publisherDetailLoading = false;
            })
          }
        })
        .catch(error => {
          this.$message.error("Error: Failed to query order count");
          console.log(error);
          this.publisherDetailLoading = false;
        })
    }
    

  },
  computed: {
    
  },
  mounted: function() {
    let vueInstance = this;

    if (typeof web3 !== 'undefined') {
      console.warn("Using web3 detected from external source like MetaMask")
      // Use Mist/MetaMask's provider
      window.web3 = new Web3(web3.currentProvider);
    } else {
      console.warn("No web3 detected. Falling back to http://localhost:9545.");
      // fallback - use your fallback strategy
      window.web3 = new Web3(new Web3.providers.HttpProvider("http://127.0.0.1:9545"));
    }

    window.ControlBus.setProvider(web3.currentProvider);
    window.ControlBus.deployed().then(instance => {window.controlBusInstance = instance});

    // TODO: Check login when clicked
    this.loginDialogVisible = true;

    // setTimeout(function() {
    //   vueInstance.currentSystem = '0';
    //   vueInstance.$message.success("Welcome, Administrator")
    //   vueInstance.loginStatus = true;
    // }, 300);
  },
})