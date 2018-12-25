# Article.eth

Article.eth 是一款服务于自由作家和文字作品版权的去中心化应用。在 Article.eth 上，你可以匿名地发布文章、交易文章版权并拿到你的稿酬，你也可以预览任何一名作家的作品与订单记录，从而聘请最合适您的那一位创作者。

## 使用指南

### 项目安装、部署、运行

#### 运行环境

本项目在搭载 MacOS Mojave 的 MacBook Pro 2017 平台 和 搭载 Windows 10 的 Intel i7-4720HQ 平台 上完成测试。部署前软件环境要求：

- Node.js Runtime
- npm

在下文，我们默认您已经安装好了上述两个运行环境。请确保您使用 `node --version` 和 `npm --version` 指令可以正确获取当前的软件版本信息。

#### 安装和部署

首先，我们从 Github 拉取项目文件，并且使用 npm 安装项目依赖：

```bash
git clone https://github.com/SiskonEmilia/Article.eth.git
cd Article.eth && npm install && npm install -g truffle
```

如果您在 `npm install` 处遇到了问题（truffle test 阶段的异常终止属于正常情况），您可能需要使用以下命令清空缓存，并将 npm 的运行时安装源设置为淘宝镜像来进行安装（如果您遇到下载失败，请配置 npm 代理，并等待下载完成后再关闭代理）：

```bash
npm cache clean --force
npm install --registry=https://registry.npm.taobao.org
npm install -g truffle --registry=https://registry.npm.taobao.org
```

然后，我们即可部署测试用以太坊网络：

```bash
truffle develop
```

进入 truffle 控制台后，使用以下命令部署合约：

```javascript
migrate --reset
```

最后，我们新开启一个终端窗口（并进入项目文件夹），使用如下命令来运行 webpack 测试服务器：

```bash
npm run dev
```

这样，我们就可以访问 [http://localhost:8080](http://localhost:8080) 来进入项目了。

#### 使用环境

虽然我们已经成功部署了项目，但是想要使用，我们还需要一些配置。在本项目中，我们使用了 **MetaMask** 来管理用户的以太币账户，在您开始使用项目前，您需要首先完成 MetaMask 的配置。对于 Chrome 用户，您可以从 [Google Chrome 拓展商店](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) 获取到 MetaMask 插件。完成安装后，根据插件的提示进行账户配置，直到看到以下界面，您就完成了所需的配置：

![ConfigMetaMask](/Assets/Images/ConfigMetaMask.png)

### 应用操作

#### 用户登录

每次当你重新打开应用网页时，您将会看到一个登陆窗口，您可以选择使用 创作者 或是 出版商 身份进行登录：

![Login](/Assets/Images/Login.png)

点击相应的按钮即可登陆，如果您还没有用此身份登陆过，Article.eth 会为您当前以太币账户创建一个账号（这可能会需要一定的以太币作为存储费用）。

登陆成功后，您将会看到如下界面：

![MainUI](/Assets/Images/MainUI.png)

左侧边栏可以供您选择您需要使用的功能，点击相应的导航栏即可跳转到对应功能的界面。

#### 文章系统

点击左侧 Article System 即可进入文章管理系统。该系统允许用户管理自己创建和具有所有权的文章并进行全文重复校验。

##### 查看具有所有权的文章

在界面左上角，点击 Owned 标签即可查看你所拥有的所有文章的列表：

![Owned Article](/Assets/Images/OwnedArticle.png)

##### 查看所有创作的文章

同理，在界面左上角，点击 Created 标签即可查看你所创建的所有文章的列表，这个功能只有以创作者身份登陆时才可用：

![Owned Article](/Assets/Images/CreatedArticle.png)

##### 撰写文章

在查看创作文章的界面的右下角，有一个创建新文章的按钮：

![Create Button](/Assets/Images/CreateArticleButton.png)

点击即可进入相应界面：

![Create Article UI](/Assets/Images/CreateArticleUI.png)

在当前界面，输入相应的内容（文章标题，文章明文字数，文章内容），然后点击创建按钮即可创建文章（为了保存文章，以太坊将会收取一定的费用）。你创建的文章将会立即出现在创作文章列表中。

##### 验证文章

在任意文章列表的文章卡片的右上角都有一个 Verify 按钮，点击即可进入验证文章界面。以我们之前创建的文章为例，其标题是 *C++ Primer*，内容为 *C++ primer / Stanley B. Lippman, Josée Lajoie, Barbara E. Moo*。输入内容后点击按钮即可验证内容是否一致：

![Verify Success](/Assets/Images/VerifySuccess.png)

由于使用了多层哈希（SHA3、SHA256），我们可以在不暴露全文且节约存储空间的情况下进行全文验证。

#### 订单系统

点击左侧 Order System 即可进入订单管理系统。该系统允许用户间进行以太币为计价单位的文章所有权交易。

##### 查看收到的订单

在界面左上角，点击 Received 标签即可查看你所收到的所有订单的列表：

![Received Order](/Assets/Images/ReceivedOrder.png)

##### 查看创建的订单

同理，在界面左上角，点击 Sent 标签即可查看你所发送的所有订单的列表：

![Sent Order](/Assets/Images/SentOrder.png)

##### 创建新的订单

在查看创建订单的右下角，有一个创建新订单的按钮：

![OrderButton](/Assets/Images/SendOrderButton.png)

点击即可进入创建订单的界面：

![CreateOrder](/Assets/Images/CreateOrderUI.png)

填入你想委托的创作人的账户地址（您可以在用户系统寻找你中意的创作人，并且通过邮件和他们预约）和订单价格，然后点击发送即可。你创建的订单将会立即出现在列表中。

##### 完成订单

当出版商创建了一个订单后，被委托的创作者可以选择一篇文章，将其所有权移交给出版商来完成订单。要完成上述操作，首先在收到的订单列表中找到相应订单，点击卡片右上角的 Finish，进入完成订单页面：

![FinishOrder](/Assets/Images/FinishOrder.png)

点选列表中的任意文章，然后点 Finish 即可完成订单（可能需要支付一定的手续费）。你将会失去这篇文章的所有权，并获得订单附带的以太币。

#### 邮件系统

点击左侧 Mail System 即可进入邮件管理系统。该系统允许你进行收发邮件的操作。

##### 查看所有相关邮件

在 Mail System 的初始界面，你就能看到所有发送的和收到的邮件：

![Mail List](/Assets/Images/MailSystem.png)

##### 寄送邮件

在邮件管理系统界面右下角，有一个新建邮件的按钮：

![SendMailButton](/Assets/Images/SendMailButton.png)

点击后即可进入新建邮件的界面：

![SendMail](/Assets/Images/SendMail.png)

填写好收件人地址和邮件内容后，点击右下角的 Send 即可发送邮件（需要一定的手续费）。您将可以立即在管理系统中看到您发送的邮件。

#### 用户系统

点击左侧 User List 即可进入用户管理系统。在这个系统，你可以查看所有身份的所有用户，并获取他们的公开信息。

##### 查看创作人/创作人作品列表

在界面左上角，点击 Writer 标签即可进入创作人列表，在这里你可以看到已经注册的所有创作者和他们的统计信息：

![Writer List](/Assets/Images/WriterList.png)

如果要查看一个创作者创作的所有文章，点击卡片右上角的 Detail 即可：

![Writer Detail](/Assets/Images/WriterDetail.png)

##### 查看出版商/出版商订单列表

在界面左上角，点击 Publisher 标签即可进入出版商列表，在这里你可以看到已经注册的所有出版商和他们的统计信息：

![Publisher List](/Assets/Images/PublisherList.png)

如果要查看一个出版商发起的所有订单，点击卡片右上角的 Detail 即可：

![Publisher Detail](/Assets/Images/PublisherDetail.png)