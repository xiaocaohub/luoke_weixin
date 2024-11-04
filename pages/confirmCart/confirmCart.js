let app = getApp();
Page({
    data: {
        rightIcon: "/public/icon/chevron_right.png",
        dropletIcon: "/public/icon/droplet.png",

        addressFlag: true,
        date: "请选择时间",
        closeIcon: "/public/icon/close.png",
        goodImg: "https://luockoo.oss-accelerate.aliyuncs.com/1/7/20240823/1826819740669050880.jpg",
        showGoodListFlag: false,
        showRemarkListFlag: false,
        goodArr: [],
        goodShotArr: [],
        selectGoodArr: [],

        resiveGoodInfo: "",
        orders: [],
        token: "",
        userInfo: "",
        expectedDeliveryTime: "请选择日期", // 期望日期

        totalMoney: 0,
        totalCount: 0,
        supplyPriceStatus: false // 供货价
    },
    onShow () {
        let userInfo = wx.getStorageSync("userInfo");
        let roleId = userInfo.roleId;
        let token = userInfo.access_id;
        let resiveGoodInfo = wx.getStorageSync("resiveGoodInfo");
        let supplyPriceStatus = wx.getStorageSync('supplyPriceStatus');
        this.setData({
            token: token,
            userInfo: userInfo,

            roleId: roleId,


            resiveGoodInfo: resiveGoodInfo,
            supplyPriceStatus: supplyPriceStatus
        }, function () {
            this.getCartInfoFn()
        })
    },
    getCartInfoFn: function () {
        let _this = this;
        let url = app.globalData.url;
        let token = this.data.token;  
        wx.request({
          url: url, 
          method: "get",
          data: {    
            api: 'app.cart.index',
            storeId: 1,
            storeType: 6,
            accessId: token
          },
          header: {
            'content-type': 'application/json'  
          },
          success (res) {
            let goodsList = res.data.data.data;   
            let goodShotArr = [];
            let selectGoodArr = [];
            goodsList.forEach((item)=>{                
                 if (item.checked) {
                      selectGoodArr.push(item)
                 }
            })
            goodShotArr = selectGoodArr.slice(0, 3);
            _this.setData({
                goodArr: goodsList,
                selectGoodArr: selectGoodArr,
                goodShotArr: goodShotArr
            }, function () {
                _this.getSelectIdsFn()
                _this.totalAllFn()
            })
          }
        })
    },
    getSelectIdsFn: function () {
        let _this = this;
        let goodArr = this.data.goodArr;
        let ids = "";
        goodArr.forEach((item, index)=> {
            if (item.checked) {
                ids += item.id + ",";
            }
        })
        setTimeout(()=>{
            _this.getCartListFn(ids)
        })
    },
    getCartListFn: function (selectId) {
          let _this = this;
          let url = app.globalData.url;
          let token = this.data.token;  
          wx.request({
            url: url, 
            method: "get",
            data: {    
              api: 'app.orderV2.confirmOrder',
              storeId: 1,
              storeType: 6,
              accessId: token,
              cartIds:  selectId
            },
            header: {
              'content-type': 'application/json'  
            },
            success (res) {
              let resData = res.data.data;
              let orders = resData.orders;
              let payOption = {
                  taxation: resData.taxation,
                  totalPrice: resData.totalPrice,    
                  totalVolume: resData.totalVolume,
                  orderInfo: resData
              }
              orders.forEach((item, index)=> {
                  item.remark = "";
              })
              _this.setData({
                  orders: orders,
                  orderInfo: resData
              })
              wx.setStorage({
                  key: "payOption",
                  data: payOption
              })
            }
          })
    },
    bindDateChange: function(e) {



        this.setData({    
            expectedDeliveryTime: e.detail.value
        })
    },
    showGoodListFn: function () {
        this.setData({
          showGoodListFlag: true
        })
    },
    closeGoodListDialogFn: function () {
        this.setData({
          showGoodListFlag: false,
          showRemarkListFlag: false
        })
    },  
    showRemarkListFn: function () {
        this.setData({
            showRemarkListFlag: true
        })
    },
    remarkFn: function (e) {
        let value = e.detail.value;
        let index = e.detail.orderIndex;
        let orders = this.data.orders;
        if (orders.length == 0) {
            return ;
        }
        orders[index].remark = value;
        this.setData({
            orders: orders
        })
    },
    payOrderFn: function () {
        let _this = this;
        let url = app.globalData.url;
        let userInfo = this.data.userInfo;
        let token = this.data.token;  
        let orderInfo = this.data.orderInfo;
        let userInfoDetail = this.data.resiveGoodInfo;
        let orders = this.data.orders;
        let remarks = [];
        let expectedDeliveryTime = this.data.expectedDeliveryTime;
        if (!userInfo) {
            wx.showToast({
                title: "请登录",
                icon: "error",
                mask: true
            })
            setTimeout(()=> {
                wx.navigatoTo({
                  url: "/pages/login/login"
                })
            }, 2000)
            return ;
        }

        if (!userInfoDetail) {
            wx.showToast({
                title: "请选择地址",
                icon: "error",
                mask: true
            })
            return ;
        }
        if (!expectedDeliveryTime || expectedDeliveryTime == "请选择日期") {
            wx.showToast({
                title: "期望发货时间",
                icon: "error",
                mask: true
            })
            return ;
        }
        orders.forEach((item, index)=>{
            let orderItem = {
                mchId: item.mchId,
                remark: item.remark
            }
            remarks.push(orderItem)
        })
        let skuNums = [];
        let orderList = orders[0].details;
        orderList.forEach((orderItem, index)=> {
            let item = {num: orderItem.num, skuId: orderItem.skuId}
            skuNums.push(item)
        })
        let skuNumsStr = JSON.stringify(skuNums);
        wx.request({
          url: url, 
          method: "get",
          data: {    
            api: 'app.orderV2.placeOrder',
            storeId: 1,
            storeType: 6,
            accessId: token,
            cartIds:  orderInfo.cartIds,
            taxType: 0,
            taxName: "",
            taxCardNo: "",
            expectedDeliveryTime: expectedDeliveryTime,
            organization: "", 
            taxpayerNumber: "", 
            taxAddress: "",
            taxPhone: "", 
            taxAccount: "", 
            taxBank: "",
            // name: userInfoDetail.recipient, 
            name: userInfoDetail.uName, 
            sheng: userInfoDetail.region[0], 
            city:  userInfoDetail.region[1],
            quyu:  userInfoDetail.region[2],
            address: userInfoDetail.detailAddress,
            tel:  userInfoDetail.phone,
            invoice: 1,
            skuNums: skuNumsStr,
            remarks: JSON.stringify(remarks)
          },
          header: {
            'content-type': 'application/json'  
          },
          success (res) {
              let  message = res.data.message; 
              let  orderNumber = res.data.data;
               if (res.data.code) {
                    wx.showToast({
                        title: message,
                        mask: true
                    })
                    wx.setStorage({
                        key: "orderNumber",
                        data: orderNumber
                    })
                    setTimeout(()=>{
                        wx.reLaunch({
                            url: "/pages/pay/pay"
                        })
                    }, 1500)
               } else {
                  wx.showToast({
                      title: message,                    
                      icon: "error",
                      mask: true
                  })
               }
          }
        })
    },
    totalAllFn: function () {
        let selectGoodArr = this.data.selectGoodArr;
        let totalMoney = 0;
        let totalCount = 0;
        selectGoodArr.forEach((item)=> {
            totalCount += item.goods_num;
        })
        this.setData({
            totalCount: totalCount
        })
    }
})