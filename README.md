# Wechatmpc miniapp

本仓库旨在构建一个基于微信小程序特性的MPC签名器前端。作为[Tonspack-wallet](https://github.com/tonspay/tonspack-font-end-nextjs)的微信、支付宝版本延展性扩展。

考虑到微信小程序的兼容性等问题，尽量使用曲线救国的方案来规避出现太多问题。

## Change Log

- #### 2025-03-19
  - 面临问题：
    - 微信小程序无法使用iframe
    - 微信小程序webview组件无法更改大小与状态
    - 微信小程序webview组件无法实现如iframe等的信息传递方案
  - 调整方案：
    - 所有签名、上报等操作由webview内程序完成
    - 通过Url进行webview内私钥传递

- #### 2025-03-18
  - 面临问题：
    - 微信小程序NPM包兼容问题，导致Tonspack-HD-Wallet 无法正常工作
    - 无法兼容 Web3.js / SolanaWeb3js / Nacl 类库
    - 无原生Buffer
  - 调整方案:
    - 曲线救国。将私钥恢复、keypair派生、签名等操作，全部封装到单页应用中
    - 使用iframe与该单页应用进行内容交互
    - 构建eventBus维持交互关系
    
## 私钥恢复规则
  - PIN 登录 [MPC]
    - UUID + 字母表填充 + PIN码
  - 指纹登录 [Local Bio]
    - UUID + 生物识别UID

## 支持如下功能：

- 实时私钥、恢复
  - 基于 PIN 码+UUID派生
  - 基于指纹认证派生

- BIP44私钥派生
  - 基于[Tonspack HD-wallet SDK](https://github.com/Tonspay/Tonspack-HD-generator) 构建多私钥派生

- QR带参
  - 解析带参QR，获取MsgId

- 消息解析
  - 根据MsgId解析待签名内容
  
- 多规范签名构建
  - Ether.js
  - SolanaWeb3.js
  - XMR.js
  - Bip.js
  - conflux-sdk-js

- 内容回传
  - 封装签名，公示签名
  - 构建符合[Tonspack-sdk规范](https://github.com/Tonspay/Tonspack-demo-and-SDK/tree/sdk)的JS sdk包
