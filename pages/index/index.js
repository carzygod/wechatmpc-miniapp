// index.js
Page({
  data: {
    scene: "",
    tips: "❌ Invalid Message",
    isLogin: false,
    btn_text: "确认签名"
  },
  onLoad(option) {
    // console.log(option)
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
    if (this.data.isLogin) {
      wx.exitMiniProgram()
      return
    }
    if (!this.data.scene) {
      wx.showToast({
        title: "Message Vaild Failed",
        icon: "error"
      })
      return
    }
    wx.login({
      success: (res) => {
        wx.showLoading({
          title: "登录中...",
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
                btn_text: "成功",
                tips: "✅ 签名提交成功"
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