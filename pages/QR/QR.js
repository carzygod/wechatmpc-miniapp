// init.js
const hd = require("../../core/wallet")
Page({
  data: {
    scene: "",
    tips: "❌ 目前仅支持扫描二维码登录",
    isLogin: false,
    webviewUrl:"https://cryptoloot.sidcloud.cn/",
    sidePart:"wallet?n=m",
    pin:"",
    supportMode: [], // 支持的生物认证方式
    authResult: '', // 认证结果
    isSupported: false // 是否支持生物认证
  },
  onLoad(option) {
    console.log(option)
    if (option.scene) {
      this.setData({
        sidePart:`action?action=${option.scene}`,
        scene: option.scene || "",
      })
    }
    this.login()
    this.checkSoterSupport()
    this.router.navigateTo(
      {
        url:"bio"
      }
    )
    //Model keypair test
    console.log(hd.resotreSeed(239102331231,"wdnmd123"))
    //

  },
  bindKeyInput: function (e) {
    this.setData({
      pin: e.detail.value
    })
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
          title: "初始化中",
          mask: true
        })
        wx.request({
          url: "https://mpcapi.sidcloud.cn/wechat/login",
          method: "POST",
          data: {
            code: res.code
          },
          success:async function (res) {
            await that.sleep(500)
            console.log(res.data)
            if(res.data.code == 200)
            {
              //Success
              that.setData({
                isInit: true,
                uid: res.data.uid,
              })
              wx.hideLoading()
            }else{
              wx.hideLoading()
              wx.showToast({
                title: res.data.msg || '初始化失败',
                icon: "error"
              })
            }
          }
        })
      }
    })
  },

  pinLogin(e)
  {
    const seed = hd.resotreSeed(this.data.uid,this.data.pin)
    console.log(seed)
    this.setData({
      isLogin:true,
      webviewUrl:`https://cryptoloot.sidcloud.cn/${this.data.sidePart}&tk=${seed}&randomSeed=${Date.now()}`
    })
  },
  bioLogin (e)
  {
   this.startSoterAuth()
  },

  checkSoterSupport: function() {
    const that = this;
    wx.checkIsSoterEnrolledInDevice({
      checkAuthMode: 'fingerPrint', // 检查指纹识别，还可以是 'facial'(人脸识别)
      success: function(res) {
        console.log('设备支持的生物认证方式:', res);
        if (res.isEnrolled) {
          // 如果已录入指纹
          that.setData({
            isSupported: true
          });
          
          // 查询支持的认证方式
          wx.checkIsSupportSoterAuthentication({
            success: function(res) {
              console.log('支持的认证方式:', res.supportMode);
              that.setData({
                supportMode: res.supportMode
              });
            },
            fail: function(err) {
              console.error('查询支持的认证方式失败:', err);
            }
          });
        } else {
          console.log('设备未录入指纹');
          wx.showToast({
            title: '请先在系统中录入指纹',
            icon: 'none'
          });
        }
      },
      fail: function(err) {
        console.error('检查指纹识别支持失败:', err);
      }
    });
  },

  // 开始生物认证
  startSoterAuth: function() {
    const that = this;
    if (!this.data.isSupported) {
      wx.showToast({
        title: '您的设备不支持生物认证',
        icon: 'none'
      });
      return;
    }
    const authMode = this.data.supportMode.includes('fingerPrint') ? 'fingerPrint' : 
                     this.data.supportMode.includes('facial') ? 'facial' : '';
    
    if (!authMode) {
      wx.showToast({
        title: '无可用的生物认证方式',
        icon: 'none'
      });
      return;
    }
    const challenge = 'challenge_code_from_server';
    wx.startSoterAuthentication({
      requestAuthModes: [authMode],
      challenge: challenge, 
      authContent: '请进行生物认证以验证身份',
      success: function(res) {
        console.log('生物认证成功:', res);
        const ret = JSON.parse(res.resultJSON)
        console.log(ret.uid)
        const seed = hd.resotreSeed(that.data.uid,ret.uid)
        console.log(seed)
        that.setData({
          isLogin:true,
          webviewUrl:`https://cryptoloot.sidcloud.cn/${that.data.sidePart}&tk=${seed}&randomSeed=${Date.now()}`
        })
      },
      fail: function(err) {
        console.error('生物认证失败:', err);
        
        wx.showToast({
          title: '认证失败',
          icon: 'none'
        });
      }
    });
  },
  
})