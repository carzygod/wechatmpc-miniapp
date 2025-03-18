// 页面 js 文件

Page({
  data: {
    supportMode: [], // 支持的生物认证方式
    authResult: '', // 认证结果
    isSupported: false // 是否支持生物认证
  },

  onLoad: function() {
    // 检查设备是否支持生物认证
    this.checkSoterSupport();
  },

  // 检查设备支持的生物认证方式
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
        that.setData({
          authResult: '认证成功：' + JSON.stringify(res)
        });
      },
      fail: function(err) {
        console.error('生物认证失败:', err);
        that.setData({
          authResult: '认证失败：' + JSON.stringify(err)
        });
        
        wx.showToast({
          title: '认证失败',
          icon: 'none'
        });
      }
    });
  },

});