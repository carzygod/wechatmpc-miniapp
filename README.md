# Wechatmpc miniapp

本仓库旨在构建一个基于微信小程序特性的MPC签名器前端。作为[Tonspack-wallet](https://github.com/tonspay/tonspack-font-end-nextjs)的微信、支付宝版本延展性扩展。

## Change Log

- #### 2025-03-18
  - 面临问题：
    - 微信小程序NPM包兼容问题，导致Tonspack-HD-Wallet 无法正常工作
    - 无法兼容 Web3.js / SolanaWeb3js / Nacl 类库
    - 无原生Buffer
  - 调整方案:
    - 曲线救国。将私钥恢复、keypair派生、签名等操作，全部封装到单页应用中
    - 使用iframe与该单页应用进行内容交互
    - 构建eventBus维持交互关系
    

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
