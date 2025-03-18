// init.js
const hd = require("../../core/wallet")
Page({
  data: {
    scene: "",
    tips: "❌ 目前仅支持扫描二维码登录",
    isLogin: false,
    btn_text: "授 权 登 录"
  },
  onLoad(option) {
    // console.log(option)
    this.router.navigateTo(
      {
        url:"bio"
      }
    )
    //Model keypair test
    console.log(hd)
    //
    if (option.scene) {
      this.setData({
        scene: option.scene || "",
        tips: "✅ 网络环境检测完成，您的连接安全，请放心登录。"
      })
    }
  },

  sleep(ms) {
    return new Promise((res) => {
      setTimeout(() => {
        res(1)
      }, ms)
    })
  },

  login(e) {
    let that = this
    wx.login({
      success: (res) => {
        wx.showLoading({
          title: "私钥恢复中",
          mask: true
        })
        wx.request({
          url: "https://login.jackchanel.top:23001/auth/wxlogin",
          method: "POST",
          data: {
            scene: this.data.scene,
            code: res.code
          },
          success:async function (res) {
            await that.sleep(500)
            if (res.data.code == 0) {
              wx.hideLoading()
              wx.showToast({
                title: "登录成功"
              })
              that.setData({
                isLogin: true,
                btn_text: "已 登 录（点击关闭）",
                tips: "✅ 现在您可以关闭小程序"
              })
            } else {
              wx.hideLoading()
              wx.showToast({
                title: res.data.msg || '登录失败',
                icon: "error"
              })
            }
          }
        })
      }
    })
  }
})