let app = getApp();
Page({
    data: {
        goodImg: "https://luockoo.oss-accelerate.aliyuncs.com/1/7/20240823/1826819740669050880.jpg",
        orderNumber: "",

        orderArr: [],
        orderInfo: "",
        orderStatus: "",
        estimatedDeliveryTime: "", // 
        realDeliveryTime: "" // 
    },
    onLoad (option) {
         let orderNumber = option.id;
         let estimatedDeliveryTime = option.estimatedDeliveryTime;

         let realDeliveryTime = option.realDeliveryTime;
         let token = wx.getStorageSync("userInfo").access_id;
         this.setData({
            token: token,
            orderNumber: orderNumber,

            estimatedDeliveryTime: estimatedDeliveryTime,
            realDeliveryTime: realDeliveryTime
         }, function () {
             this.getOrderDetialFn()
         })
    },
    getOrderDetialFn: function () {
        let _this = this;
        let url = app.globalData.url;
        let token = this.data.token;
        wx.request({
        
          url: url, 
          method: "get",
          data: {    
              api: 'app.orderV2.orderDetail',
              storeId: 1,
              storeType: 6,
              accessId: token,
              orderParentNo: this.data.orderNumber
          },
          header: {
            'content-type': 'application/json'  
          },
          success (res) {
              let resData =  res.data.data;
              let orderArr = [];
              let messages = [];
              // let orders = [];

              if (resData) {
              
                  orderArr =  resData.orders;
                  messages = resData.messages;
              }
              let orderStatus = resData.status;
              if (orderStatus === 5) {

                  orderStatus += 2;
              }

              orderArr.forEach((orderItem, index) => {
                  let orderTotalMoney = 0;
                  let goodCount = 0;


                  orderItem.details.forEach((goodItem, i)=> {
                      orderTotalMoney += goodItem.supplierPrice * goodItem.num;
                      goodCount += goodItem.num;
                  })
                  orderItem.orderTotalMoney = orderTotalMoney;
                  orderItem.goodCount = goodCount;
              })
              _this.setData({
                  orderInfo: resData,
                  orderArr: orderArr, 
                  orderStatus: orderStatus,
                  messages: messages
              })
          }
        })
    }
})