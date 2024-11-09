let app = getApp();
Page({
    data: {
        banner: [
          "https://luockoo.oss-accelerate.aliyuncs.com/1/7/20240905/1831642348333887488.jpg",
          
          "https://luockoo.oss-accelerate.aliyuncs.com/1/7/20240823/1826820053467660288.jpg",
          "https://luockoo.oss-accelerate.aliyuncs.com/1/7/20240905/1831654169866465280.jpg"
        ],
        indicatorDots: false,
        autoplay: true,
        interval: 2000,
        priceImg: "/public/icon/price_bac.png",
        selectIcon: "/public/icon/select_icon.png",
        chevronRight: "/public/icon/chevron_right.png",
        collapseIcon: "/public/icon/collapse.png",
        shoppingIcon:"/public/icon/shopping.png",
        copyIcon: "/public/icon/copy.png",
        showDialog: false,
        btnFlag: false,
        closeIcon: "/public/icon/close.png",

        token: "",
        userInfo: "",
        roleId: "",
        goodId: "",
        productVideo: "",
        defaultImgArr: [],
        allGoodArr: [], // 商场现所有商品
        goodFirst: "",
        currentGood: "", // 选中的商品
        allColorArr: [],
        currentColor: "",
        currentColorIndex: 0,
        allSizeArr: [],
        
        currentSize: "",
        
        
        currentSizeIndex: 0,
        goodInfo: "",
        goodAttr: [],
        mchName: "",
        selectGoodIds: [],
        count: 1,

        detailImg: "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20241108200710.png",
        goodImg: "https://luockoo.oss-accelerate.aliyuncs.com/1/7/20240905/1831642348333887488.jpg",
        goodArr: [],
        supplyPriceStatus: false, // 供货价
        sameGoodArr: [],

        current: 1,
        emptyImg: "/public/images/empty.png"
      },
      onLoad (option) {
            let goodId = option.id;
            let userInfo = wx.getStorageSync("userInfo");
            let token = "";

            let roleId = "";
            if (userInfo) {
                token = userInfo.access_id;
                roleId = userInfo.roleId;
            }
            this.setData({
               goodId: goodId,
               userInfo: userInfo,
               token: token,
               roleId: roleId
            })
      },
      onShow () {
          this.getGoodInfoFn()
          this.getCartInfoFn()
          let supplyPriceStatus = wx.getStorageSync('supplyPriceStatus');
          this.setData({
              supplyPriceStatus: supplyPriceStatus
          }, function () {
              this.getSameGoodFn()
          })
      },
      showDialogFn: function (e) {
           let index = e.currentTarget.dataset.index;
           let btnFlag = index==0?false:true;
           let userInfo = wx.getStorageSync("userInfo");
          //  console.log("userInfo")
          //  console.log(userInfo)
          //  console.log("userInfo")
           let roleId = "";
           let submitFlag = "";  // 提交
           let examineFlag = ""; // 审核
           let examineMsg = ""; 
           
           if (!userInfo) {
               wx.showToast({
                   title: "请登录",
                   icon: "error"
               })
               setTimeout(()=>{
                   wx.navigateTo({
                       url: "/pages/login/login"
                   })
               }, 2000)
               return ;
           }
          roleId = userInfo.roleId; 
          submitFlag = userInfo.submitFlag;
          examineFlag = userInfo.examineFlag;
          // submitFlag = 0;
          if ( !roleId && submitFlag == 0) {
                wx.showModal({
                  title: "提示",
                  content: "请填写申请信息",
                  success (res) {
                      if (res.confirm) {
                          wx.navigateTo({
                              url: "/pages/userInfo/userInfo"
                          })
                      }
                  }
              })
              return ;
          }
          if (examineFlag == 0) {
              examineMsg = "审核中";
          } else if ( examineFlag == -1 ) {
              examineMsg = "未通过";
          }
          if (!roleId && userInfo.examineFlag != 1) {
               wx.showModal({
                  title: "提示",
                  content: "提交成功, " + examineMsg,
                  success (res) {
                      if (res.confirm) {

                      }
                  }
               })
               return ;
           }
           this.setData({
              showDialog: true,
              btnFlag: btnFlag
           })
      },
      closeDialogFn: function () {
          this.setData({
             showDialog: false
          })
      },
      sliderFn: function (e) {
          let current = e.detail.current ;
          this.setData({
              current: current
          })
      },
      getGoodInfoFn: function () {
          let _this = this;
          let url = app.globalData.url;
          let goodId = this.data.goodId;
          let token = this.data.token;
          wx.showLoading({
            title: '加载中'
          })
          wx.request({
              url: url, 
              method: "get",
              data: {
                  api: 'app.product.productDetails',

                  accessId: token || "",
                  storeId: 1,
                  storeType: 6,
                  productId: goodId
              },
              header: {
                'content-type': 'application/json'  
              },
              success (res) {
                  wx.hideLoading()
                  let resData = res.data.data;
                  let productVideo = resData.product.productVideo;
                  let defaultImgArr = resData.product.defaultImgArr;
                  let allGoodArr = resData.skuBeanList;
                  let goodFirst = allGoodArr[0];
                  let allColorArr = resData.attrList[0].attr;
                  let allSizeArr =  resData.attrList[1].attr;
                  let goodInfo = resData.product;
                  let goodAttr = JSON.parse(goodInfo.parameters);
                  let content = JSON.parse(goodInfo.content)[0].content;
                  let selectGoodIds = [];
                  selectGoodIds[0] = allColorArr[0].id;
                  selectGoodIds[1] = allSizeArr[0].id;
                  let currentColor = allColorArr[0];
                  let currentSize = allSizeArr[0];
                  let currentGood = goodFirst;
                  _this.setData({
                      productVideo: productVideo,
                      defaultImgArr: defaultImgArr,
                      allGoodArr: allGoodArr,
                      goodFirst: goodFirst,
                      allColorArr: allColorArr,
                      currentColor: currentColor,
                      allSizeArr: allSizeArr,
                      currentSize: currentSize,
                      goodInfo: goodInfo,
                      goodAttr: goodAttr,
                      selectGoodIds: selectGoodIds,
                      currentGood: currentGood,
                      mchName: resData.mchName
                  }, function () {
                      _this.checkColorArrDisableFn()
                      _this.checkSizeArrDisableFn()
                  })
              }
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
              accessId: token || ""
            },
            header: {
              'content-type': 'application/json'  
            },
            success (res) {
                  let goodsList = res.data.data.data;
                  _this.setData({       
                      goodArr: goodsList
                  })
            }
          })
      },
      // 导航选颜色
      selectColorFn: function (e) {
          let resData =  e.currentTarget.dataset;
          let index = resData.index;
          let currentColor = resData.item;
          let selectGoodIds = this.data.selectGoodIds;
          let currentColorIndex = this.data.currentColorIndex;
          if (currentColorIndex == index) {
             index = -1;
             currentColor = "";
          }
          selectGoodIds[0] = currentColor.id;
          this.setData({
              currentColorIndex: index,   
              currentColor: currentColor,
              selectGoodIds: selectGoodIds,
              count: 1
          }, function () {
              this.checkSizeArrDisableFn()
              this.selectGoodFn()
          })
      },
      selectSizeFn: function (e) {
          let resData = e.currentTarget.dataset;
          let index = resData.index;
          let currentSize = resData.item;
          let selectGoodIds = this.data.selectGoodIds;
          let currentSizeIndex = this.data.currentSizeIndex;
          if (currentSizeIndex == index) {
              index = -1;
              currentSize = "";
          }
          selectGoodIds[1] = currentSize.id;
          this.setData({    
               currentSizeIndex: index,
               currentSize: currentSize,
               selectGoodIds: selectGoodIds,
               count: 1
          }, function () {
              this.checkColorArrDisableFn()
              this.selectGoodFn()
          })
      },
      selectGoodFn: function () {
            let allGoodArr = this.data.allGoodArr;
            let selectGoodIds =  this.data.selectGoodIds;  
            let length = allGoodArr.length;
            let currentGood = "";
            for (let i=0; i<length; i++) {
                let attributes = allGoodArr[i].attributes;
                let flag = attributes[0].attributeValId == selectGoodIds[0] && attributes[1].attributeValId == selectGoodIds[1];
                if (flag) {
                    currentGood = allGoodArr[i];
                }
            }
            // console.log("currentGood")
            // console.log(currentGood)
            // console.log("currentGood")
            this.setData({
                currentGood: currentGood
            })
      },
      setCountFn: function (e) {
            let count = e.detail.value;
            if (isNaN(count)) {
                count = 1;
            }
            this.setData({      
                count: count
            })
      },
      addCountFn: function () {
          let count = this.data.count + 1;
          this.setData({
              count: count
          })
      },
      reduceCountFn: function () {
           let count = this.data.count;
           if (count > 1) {
               count -= 1;
           }
           this.setData({
               count: count
           })
      },
      checkSizeArrDisableFn: function () {
          let currentColor = this.data.currentColor;
          let colorId = currentColor.id;
          let sizeArr = this.data.allSizeArr;
          let sizeLength = sizeArr.length;
          let allGoodArr = this.data.allGoodArr;
          let allLength = allGoodArr.length;
          if (!colorId) {
              return ;
          }
          for (let i=0; i<sizeLength; i++) {
            let sizeItem = sizeArr[i];
            sizeItem.showFlag = false;
            for (let j=0; j<allLength; j++) {
                let allItem = allGoodArr[j];  
                if (colorId==allItem.attributes[0].attributeValId && sizeItem.id == allItem.attributes[1].attributeValId) {
                    if (allItem.status == "0") {
                        sizeItem.showFlag = true;
                    }
                }
            }
        }
        this.setData({
            allSizeArr: sizeArr
        })
      },
      checkColorArrDisableFn: function () {
          var currentSize = this.data.currentSize;
          var sizeId = currentSize.id;
          var colorArr = this.data.allColorArr;  
          var colorLength = colorArr.length;
          var allGoodArr = this.data.allGoodArr;
          var allLength = allGoodArr.length;    
          if (!sizeId) {
              return ;
          }
          for (var i=0; i < colorLength; i++) {
                var colorItem = colorArr[i];
                colorItem.showFlag = false;
                for (var j=0; j<allLength; j++) {
                    var allItem = allGoodArr[j];
                    var flag = colorItem.id == allItem.attributes[0].attributeValId && sizeId == allItem.attributes[1].attributeValId;  
                    if (flag) {
                       if (allItem.status == "0") {
                            colorItem.showFlag = true;
                        }
                    }
                }
          }
          this.setData({
              allColorArr: colorArr
          })
      },
      addCartFn: function () { 
           let _this = this;
           let url = app.globalData.url;
           let userInfo = this.data.userInfo;
           let token = this.data.token;
           let currentGood = this.data.currentGood;
           if (!userInfo) {
                wx.showToast({
                  title: "请登录",              
                  icon: "error",
                  mask: true
                })
                setTimeout(()=> {
                    wx.navigateTo({
                        url: '/pages/login/login'
                    })
                }, 2000)
                return ;
           }
           wx.request({
             url: url, 
             method: "get",
             data: {
               api: 'app.cart.addCart',
               storeId: 1,
               storeType: 6,
               accessId: token || "",
               goodsId: this.data.goodId,
               num: this.data.count,
               attributeId: currentGood.cid 
             },
             header: {
               'content-type': 'application/json'  
             },
             success (res) {
                  let resData = res.data;
                  if (resData.code) {
                      wx.showToast({
                        title: resData.message,
                        icon: "success",
                        mask: true
                      })
                      _this.setData({
                          showDialog: false
                      })
                      _this.getCartInfoFn()
                  }  else {
                    wx.showToast({    
                      title: resData.message,
                      icon: "error",
                      mask: true
                    })
                  }
             }
           })
      },
      buyGoodFn: function () {
          let _this = this;
          let url = app.globalData.url;
          let userInfo = this.data.userInfo;
          let token = this.data.token;
          let currentGood = this.data.currentGood;
          if (!userInfo) {
              wx.showToast({       
                title: "请登录",
                icon: "error",
                mask: true
              })
             setTimeout(()=> {
                  wx.navigateTo({
                    url: "/pages/login/login"
                 })
             }, 2000)
              return ;
          }
          wx.request({
            url: url, 
            method: "get",
            data: {
              api: 'app.cart.addCart',
              storeId: 1,
              storeType: 6,
              accessId: token || "",
              goodsId: this.data.goodId,
              num: this.data.count,
              attributeId: currentGood.cid 
            },
            header: {
              'content-type': 'application/json'  
            },
            success (res) {
                let resData = res.data;
                if (resData.code) {
                    _this.setData({
                        showDialog: false
                    })
                    wx.switchTab({
                      url: '/pages/cart/cart'
                    })
                }  else {
                  wx.showToast({
                    title: resData.message,
                    icon: "error",
                    mask: true
                  })
                }
            }
          })
      },
      getSameGoodFn: function () {
            let _this = this;
            let url = app.globalData.url;
            let token = this.data.token;
            let currentGood = this.data.currentGood;
            wx.request({
              url: url, 
              method: "get",
              data: {
                api: 'app.product.listSimilarProduct',
                storeId: 1,
                storeType: 6,
                accessId: token || "",
                productId: this.data.goodId
              },
              header: {
                'content-type': 'application/json'  
              },
              success (res) {
                  let resData = res.data.data.goodsList;
                  _this.setData({
                      sameGoodArr: resData
                  })
              }
            })
      },
      viewCopyTextClick: function(){
          var _this = this;
          var currentGood = this.data.currentGood;
          var goodFirst = this.data.goodFirst;
          var productCode = currentGood?currentGood.productCode: goodFirst.productCode;
          wx.setClipboardData({
              data: productCode,
              success: function (res) {
                  wx.getClipboardData({
                      success: function (res) {
                          wx.showToast({
                            title: '复制成功'
                          })
                      }        
                  })
              }
          })
      }
})