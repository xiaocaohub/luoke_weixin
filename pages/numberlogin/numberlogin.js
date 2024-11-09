let app = getApp();
Page({
    data: {
        loginImg: "/public/icon/luockoo_logo.png",
        checkIcon: "/public/icon/select_gray.png",
        checkedIcon: "/public/icon/check_on.png",
        selectFlag: false,
         userNumber: "",
         password: ""
    },
    selectFn: function () {
        let selectFlag = !this.data.selectFlag;
        this.setData({
            selectFlag: selectFlag
        })
    },
    loginFn: function () {
      let selectFlag = this.data.selectFlag;
      let storeId =  1;
      let storeType = 6;
      if (!selectFlag) {
           wx.showToast({
               title: '请选择协议',
               icon: "error",
               mask: true
           })
           return ;
      }
      let userNumber = this.data.userNumber;
      if (!userNumber) {
          wx.showToast({
              title: '请输入账号',
              icon: "error",
              mask: true
          })

          return ;
      }
      
      let password = this.data.password;
      if (!password) {
          wx.showToast({
              title: '请输入密码',
              icon: "error",
              mask: true
          })
          return ;
      }
          wx.request({
            url: app.globalData.url, 
            method: "get",
            data: {
                api:'app.login.login',
                storeId: 1,
                storeType: 6,
                phone: userNumber,
                password: password
            },
            header: {
              'content-type': 'application/json' 
            },
            success (res) {
                if (res.data && res.data.code == 200) {
                    let resData = res.data.data;
                    let loginInfo = {
                        userNumber: userNumber,
                        password: password
                    }
                    if (resData.userType == 1) {
                        wx.showModal({
                            title: "提示",
                            content: "您是 C 端用户, 请用一键登录",
                            success (res) {
                                if (res.confirm) {
                                    wx.navigateBack()
                                }
                            }
                        })
                        return ;
                    }
                    wx.setStorage({
                        key: "loginInfo",
                        data: loginInfo
                    })
                    wx.showToast({
                        title: res.data.message,
                        mask: true
                    })

                    setTimeout(()=> {
                        wx.switchTab({
                          url: '/pages/index/index',
                        })
                        wx.setStorage({
                            key: "userInfo",
                            data: resData
                        })
                    }, 2000)
                } else {
                    wx.showToast({
                        title: res.data.message,
                        icon: "error"
                    })
                }
            }
          })
    },
    numberFn: function (e) {
          let userNumber = e.detail.value;
          this.setData({
              userNumber: userNumber
          })
    },

    passwordFn: function (e) {
          let password = e.detail.value;
          this.setData({        
              password: password
          })
    }
})