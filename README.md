# Article.eth

Article.eth 是一款服务于自由作家和文字作品版权的去中心化应用。在 Article.eth 上，你可以匿名地发布文章、交易文章版权并拿到你的稿酬，你也可以预览任何一名作家的作品与订单记录，从而聘请最合适您的那一位创作者。

## 使用指南

### 运行环境

本项目在搭载 MacOS Mojave 的 MacbookPro 平台上完成测试。部署前软件环境要求：

- Node.js Runtime
- npm

在下文，我们默认您已经安装好了上述两个运行环境。请确保您使用 `node --version` 和 `npm --version` 指令可以正确获取当前的软件版本信息。

### 安装和部署

首先，我们从 Github 拉取项目文件，并且使用 npm 安装项目依赖：

```bash
git clone https://github.com/SiskonEmilia/Article.eth.git
cd Article.eth && npm install && npm install -g truffle
```

如果您在 `npm install` 处遇到了问题，您可能需要使用以下命令清空缓存，并将 npm 的运行时安装源设置为淘宝镜像来进行安装，在这个环境下不需要使用代理：

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

### 使用环境

虽然我们已经成功部署了项目，但是想要使用，我们还需要一些配置。在本项目中，我们使用了 **MetaMask** 来管理用户的以太币账户，在您开始使用项目前，您需要首先完成 MetaMask 的配置。对于 Chrome 用户，您可以 [Google Chrome 拓展商店](https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn) 获取到 MetaMask 插件。完成安装后，根据插件的提示进行账户配置，直到看到以下界面，您就完成了所需的配置：

![](Images/ConfigMetaMask.png)