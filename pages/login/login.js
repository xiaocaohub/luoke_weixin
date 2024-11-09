let app = getApp();
Page({
    data: {
        checkIcon: "/public/icon/select_gray.png",
        checkedIcon: "/public/icon/check_on.png",

        selectFlag: false
    },
    selectFn: function () {
        let  selectFlag = !this.data.selectFlag;
        this.setData({
            selectFlag: selectFlag
        })
    },
    getPhoneFn: function (e) {
  
        console.log(e)
        let code = e.detail.code;
        let selectFlag = this.data.selectFlag;
        let _this = this;
        if (!code) {
         
            return ;
        }
        if (!selectFlag) {
            
            wx.showModal({
              content: '我已阅读并同意《珞珂用户协议》《信息数据收集协议》',
              cancelText: "不同意",
              confirmText: "同意",
              success (res) {
                if (res.confirm) {
                    _this.setData({
                        selectFlag: true
                    })

                    _this.loginFn(code)
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
          })
        }  else {

            this.loginFn(code)
        }
        
        // if (code) {
        //    this.loginFn(code)
        // }
    },

    loginFn: function (code) {
        console.log("login code", code)
        // wx.showModal({
        //   content: '我已阅读并同意《珞珂用户协议》《信息数据收集协议》',
        //   cancelText: "不同意",
        //   confirmText: "同意",
        //   success (res) {
        //     if (res.confirm) {
        //       console.log('用户点击确定')
        //     } else if (res.cancel) {
        //       console.log('用户点击取消')
        //     }
        //   }
        // })



        let _this = this;
        let url = app.globalData.url;
        wx.showLoading({
            title: "加载中"
        })
        wx.request({
          url: url, 
          method: "get",
          data: {
            api: 'app.login.appletsBindPhoneLogin',
            storeId: 1,
            storeType: 6,
            code: code
          },
          header: {
            'content-type': 'application/json'  
          },
          success (res) {
              wx.hideLoading()
              let resData = res.data;

              if (resData) {
                  wx.showToast({
                      title: "登录成功"
                  })
                  let userInfo =  resData.data;
                  
                  wx.setStorageSync('userInfo', userInfo)
                  setTimeout(()=>{
                      wx.switchTab({            
                          url: "/pages/index/index"
                      })
                  }, 2000)
              } 
          }
        })

    },
    titleFn: function () {
          let _this = this;
          wx.showModal({
            content: '我已阅读并同意《珞珂用户协议》《信息数据收集协议》',
            cancelText: "不同意",
            confirmText: "同意",
            success (res) {
              if (res.confirm) {
                  
                  _this.setData({
                      selectFlag: true
                  })
              } else if (res.cancel) {
                console.log('用户点击取消')
              }
            }
        })
    }
})