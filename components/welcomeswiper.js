// components/welcomeswiper.js
Component({

    /**
     * 组件的属性列表
     */
    properties: {

    },

    /**
     * 组件的初始数据
     */
    data: {
      packList:[
        {
          title:"极速扫码，安全无忧",
          desc:"只需轻扫二维码，小程序即刻响应，为您带来既快捷又安全的登录方式。",
          img:"../assets/fast.svg"
        },
        {
          title:"单点登录，畅行无阻",
          desc:"支持CAS单点登录，在多个系统间切换自如，无需重复认证，享受一气呵成的工作流程。",
          img:"../assets/pass.svg"
        },
        {
          title:"密码遗忘，安全不打折",
          desc:"无需担心密码安全，采用先进的技术确保账户安全，在享受便捷的同时，也能高枕无忧。",
          img:"../assets/safe.svg"
        }
      ]
    },

    /**
     * 组件的方法列表
     */
    methods: {

    }
})