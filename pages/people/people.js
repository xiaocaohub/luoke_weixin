Page({
    data: {
         headImg: "/public/icon/people_head_img.png",
         loginOutIcon: "/public/icon/log_out.png",
         rightIcon: "/public/icon/chevron_right_btn.png",
         icon1: "/public/icon/people_icon1.png",
         icon2: "/public/icon/people_icon2.png",
         icon3: "/public/icon/people_icon3.png",
         icon4: "/public/icon/people_icon4.png",
         icon5: "/public/icon/people_icon5.png",
         icon10: "/public/icon/people_icon10.png",
         userInfo: "",
         supplyPriceStatus: false,
         token: ""
    },
    onLoad (option) {
         console.log(option)
    },
    onShow () {
        let userInfo = wx.getStorageSync('userInfo');
        let supplyPriceStatus = wx.getStorageSync('supplyPriceStatus');

        let token = userInfo.access_id;
        this.setData({
            token: token,
            userInfo: userInfo,
            supplyPriceStatus: supplyPriceStatus
        })
    },

    loginOutFn: function () {
        wx.showModal({
            title: "提示",
            content: "退出登录？",
            success (res) {
                if (res.confirm) {
                    wx.clearStorage()
                  
                   
                    wx.navigateTo({
                        url: '/pages/login/login'
                    })
                }
            }
        })
    },
    supplyPriceStatusFn: function () {
         let supplyPriceStatus = this.data.supplyPriceStatus; 
         let _this = this;
         let message = supplyPriceStatus?"关闭供货价数据吗？":"确认开启展示供货价数据吗？"
         let userInfo = this.data.userInfo;
         
         if (!userInfo) {
             wx.showToast({
                 title: "请登录",
                 icon: "error"
             })
             setTimeout(()=> {
                 wx.navigateTo({
                     url: "/pages/login/login"
                 })
             }, 2000)
             return ;
         }
         wx.showModal({
             title: "",
             content: message,
             success (res) {
                  if (res.confirm) {
                      supplyPriceStatus = !_this.data.supplyPriceStatus;
                       _this.setData({
                          supplyPriceStatus: supplyPriceStatus
                       })
                       wx.setStorage({
                           key: "supplyPriceStatus",
                           data: supplyPriceStatus
                       })     
                  }
             }
         })
    },
    goDetailFn: function (e) {
        let userInfo = this.data.userInfo;
        let id = parseInt(e.currentTarget.dataset.id);
        if (!userInfo) {
            wx.showToast({
                title: "请登录",
                icon: "error"
            })
            setTimeout(()=> {
                wx.navigateTo({
                    url: "/pages/login/login"
                })
            }, 2000)
            return ;
        }
        wx.navigateTo({
          url: "/pages/order/order?id=" + id
        })
    }
})