let app = getApp();
let now = new Date();
let endTime = new Date(now.setDate(now.getDate() + 7));
Page({
    data: {
        clockIcon: "/public/icon/clock.png",
        rightIcon: "/public/icon/chevron_right.png",
        wechatIcon: "/public/icon/wechat_icon.png",
        bankIcon: "/public/icon/bank_icon.png",
        checkIcon: "/public/icon/check.png",
        checkedIcon: "/public/icon/pay_select_on.png",
        checkOnIcon: "/public/icon/pay_select_on.png",
        payDate: "请选择汇款日期",
        payTime: "请选择汇款时间",
        uploadBtn: "/public/icon/add_upload.png",
        goodImg: "https://luockoo.oss-accelerate.aliyuncs.com/1/7/20240823/1826819740669050880.jpg",
        payType: "weichat",
        orderNumber: "",
        totalPrice: 0,
        dateText: "",
        set: 0,
        token: "",
        upImgArr: [],
        bankText: "",
        closeIcon: "/public/icon/close.png"
    },
    onShow () {
        let token = wx.getStorageSync("userInfo").access_id;
        this.setData({
            token: token    
        })
        this.init()
        this.ltTime()
    },





    // onUnload () {
    //      wx.switchTab({
    //        url: '/pages/cart/cart',
    //      })
    // },
    init () {
         let orderNumber = wx.getStorageSync("orderNumber");
         let payOption = wx.getStorageSync("payOption");
         this.setData({
            orderNumber: orderNumber,
            totalPrice: payOption.totalPrice
         })
    },
    bindDateChange: function (e) {
      this.setData({
          payDate: e.detail.value
      }) 
    },
    bindTimeChange: function (e) {
        this.setData({
            payTime: e.detail.value
        }) 
    },

    selectPayFn: function (e) {
         let payType = e.currentTarget.dataset.type;
         this.setData({
            payType: payType
         })
    },
    ltTime: function () {  
          let _this = this;
          var curTime = new Date();  
          var leftTime= parseInt((endTime.getTime()-curTime.getTime())/1000);
          var d=parseInt(leftTime/(60*60*24));
          var h=parseInt(leftTime/(60*60)%24);
          var m=parseInt(leftTime/60%60);
          var s=parseInt(leftTime%60);
          if (h<10) {
              h = "0" + h;
          }
          if (m<10) {
              m = "0" + m;
          }
          if (s<10) {
              s = "0" + s;
          }
          let dateText = d + "天" + h + "时" + m + "分" + s + "秒";
          if(leftTime <= 0) {
              dateText = "支付时间";
          }
          this.setData({
              dateText: dateText
          })
          let set = setTimeout(()=>{
              _this.ltTime()
          }, 1000);
          this.setData({
              set: set
          })
      },
      selectImgFn: function () {
          let _this = this;
          wx.chooseImage({
            count: 5,
            sizeType: ['original', 'compressed'],
            sourceType: ['album', 'camera'],
            success (res) {
                  const tempFilePaths = res.tempFilePaths; 
                  tempFilePaths.forEach((imgItem)=>{
                        _this.uploadImgFn(imgItem)
                  })
            }
          })
      },
      uploadImgFn: function (file) {
          let _this = this;
          let token = this.data.token;
          let url = app.globalData.url;
          let upImgArr = this.data.upImgArr;
          wx.showLoading({ 
              title: "加载中"
          })
          wx.uploadFile({
            url: url,
            filePath: file,
            name: 'file',
            formData: {
              api: "resources.file.uploadFiles",
              accessId: token,  
              storeId: 1,
              storeType: 6
            },
            success (res){
                const resData = JSON.parse(res.data);
                let  imgUrl = ""
                if (resData) {
                    wx.hideLoading() 
                    imgUrl = resData.data.imgUrls[0];
                    upImgArr.push(imgUrl)
                    _this.setData({
                        upImgArr: upImgArr
                    })
                }
            }
          })
      },
      deleteImgFn: function (e) {
           let index = e.currentTarget.dataset.index;
           let upImgArr = this.data.upImgArr;
           upImgArr.splice(index, 1)
           this.setData({
               upImgArr: upImgArr
           })
      },
      putBankFn: function (e) {
           let  bankText = e.detail.value;
           this.setData({
               bankText: bankText
           })
      },
      submitFn: function () {
            let _this = this;
            let url = app.globalData.url;
            let token = this.data.token;
 
            let orderNumber = this.data.orderNumber;
            let bankText = this.data.bankText;
            let imgStr = "";
            let upImgArr = this.data.upImgArr;
            upImgArr.forEach((item)=>{
                imgStr += item + ",";
            })
            let payDate = this.data.payDate;
            let payTime = this.data.payTime;
            //  let offlinePayTime = payDate + " " + payTime;

            let offlinePayTime = payDate;
            if (!bankText) {
                wx.showToast({
                    title: "请填写付款银行",
                    icon: "error",
                    mask: true
                })
                return ;
            }
            if (!payDate || payDate == '请选择汇款日期') {
              wx.showToast({
                  title: "请选择汇款日期",
                  icon: "error",
                  mask: true
              })
              return ;
            }
            // if (!payTime || payTime == "请选择汇款时间") {
            //   wx.showToast({
            //       title: "请选择汇款时间",
            //       icon: "error",
            //       mask: true
            //   })
            //   return ;
            // }
            if (upImgArr.length == 0) {
              wx.showToast({
                  title: "请选择汇款图片",
                  icon: "error",
                  mask: true
              })
              return ;
            }
            wx.request({
              url: url, 
              method: "get",
              data: {    
                  api: 'app.orderV2.balancePay',
                  storeId: 1,
                  storeType: 6,
                  accessId: token,
                  orderParentNo:  orderNumber,
                  offlinePayBank: bankText,
                  offlinePayImg: imgStr,
                  offlinePayTime: offlinePayTime
              },
              header: {
                'content-type': 'application/json'  
              },
              success (res) {
                  if (res.data.code == 200) {
                      wx.showToast({
                        title: res.data.message,
                        duration: 2900,
                        success: function () {
                            wx.reLaunch({
                                url: "/pages/payOver/payOver"
                            })
                        }
                      })
                  } else {



                    wx.showToast({
                      title: res.data.message,
                      icon: "error"
                    })
                  }
              }
            })
      },
      confirmSubmitFn: function () {
            wx.showModal({
                title: "提示",
                content: "请选择银行转账"
            })
      }
})