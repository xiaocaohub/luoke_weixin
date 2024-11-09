let app = getApp();
Page({
    data: {
        searchBtn: "/public/icon/search_small.png",
        menuArr: [],

        menuIndex: 0,
        bannerImg:  "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/banner_03.jpg",
        hotBannerImg: "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/hot_sale%402x.png",
        seriesBannerImg: "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/series_products%402x.png",
        goodImg: "https://luockoo.oss-accelerate.aliyuncs.com/1/7/20240823/1826819740669050880.jpg",
        roomKindArr: [],  // 客厅
        slipeKindArr: [],  // 卧室
        eatKindArr: [], // 餐厅
        bookKindArr: [],  //  书房
    
        childKindArr: [],
        token: "",
        brandArr: [],
        hotArr: [], // 热门分类
        scrollIntoView: "",

        screenHeight: 0
    },
    onLoad () {

      let userInfo = wx.getStorageSync("userInfo");
      let token = "";
        if (userInfo) {
            token = userInfo.access_id;
        }
        this.setData({
            token: token
        })
    },
    onShow () {
        const windowInfo = wx.getWindowInfo()
        
        
        let screenHeight = windowInfo.windowHeight;
        this.setData({
            screenHeight: screenHeight
        })

        this.getMenuFn()
    },
    selectMenuFn: function (e) {
        let menuIndex = e.currentTarget.dataset.index;
        let scrollIntoView = "goodKind" + menuIndex;
        this.setData({
            menuIndex: menuIndex,
            scrollIntoView: scrollIntoView
        })
    },
    getMenuFn: function () {
        let _this = this;
        let url = app.globalData.url;
        let token = this.data.token;
        let menuArr = [
            {
              pname: "热门分类"
            },
            {    
              pname: "系列集"
            }
        ];
        wx.request({
            url: url, 
            method: "get",
            data: {
                api: 'app.product.getSpaceClassList',
                storeId: 1,
                storeType: 6,
                accessId: token
            },
            header: {
              'content-type': 'application/json'  
            },
            success (res) {
                let resData = res.data.data;
                let arr = menuArr.concat(resData);
                _this.setData({
                     menuArr: arr
                }, function () {
                    // _this.getRoomKindFn()
                     _this.getKindFn(150, this.getRoomKindFn, 148)
                     _this.getKindFn(166, this.getSlipeKindFn, 148)
                     _this.getKindFn(167, this.getEatKindFn, 148)
                     _this.getKindFn(168, this.getBookKindFn, 148)
                     _this.getKindFn(169, this.getChildKindFn, 148)
                     _this.getStyleGoodArrFn()
                })
            }
          })
    },
    getKindFn: function (cid, callback, topId) {
          let _this = this;
          let url = app.globalData.url;
          let token = this.data.token;
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
              url: url, 
              method: "get",
              data: {
                  api: 'app.product.getSecondClassList',
                  storeId: 1,
                  storeType: 6,
                  parentId: cid,
                  accessId: token
              },
              header: {
                'content-type': 'application/json'  
              },
              success (res) {

                  wx.hideLoading()
                  let resData = res.data.data;
                  resData.forEach((item, index)=> {
                      item.topId = topId;
                  })   
                  callback(resData)
              }
            })
    },
    // 客厅
    getRoomKindFn: function (arr) {
        let hotArr = this.data.hotArr;
        hotArr[0] = arr[0];
        hotArr[4] = arr[1];
        hotArr[5] = arr[2];
        this.setData({
            roomKindArr: arr,
            hotArr: hotArr
        })
    },


    // 卧室
    getSlipeKindFn: function (arr) {
        let hotArr = this.data.hotArr;
        hotArr[1] = arr[1];      
        hotArr[2] = arr[2];
        arr.splice(6, 1);
        this.setData({
            slipeKindArr: arr,
            hotArr: hotArr
        })         
    },
    // 餐厅
    getEatKindFn: function (arr) {
          let hotArr = this.data.hotArr;
          hotArr[3] = arr[0];
          this.setData({ 
              eatKindArr: arr,
              hotArr: hotArr
          })         
     },
     getBookKindFn: function (arr) {
          this.setData({ 
              bookKindArr: arr
          })         
      },
      getChildKindFn: function (arr) {
          this.setData({ 
              childKindArr: arr
          })         
      },
      getStyleGoodArrFn: function () {
          let _this = this;
          let url = app.globalData.url;
          let token = this.data.token;
          wx.request({
                url: url, 
                method: "get",
                data: {
                    api: 'app.product.getBrands',
                    storeId: 1,
                    storeType: 6,
                    accessId: token,
                    page: 1,
                    pageSize: 6,
                    styleId: 1
                },
                header: {
                  'content-type': 'application/json'  
                },
                success (res) {
                    let resData = res.data.data.brandsList;
                    _this.setData({
                        brandArr: resData
                    })
                    
                }
          })
      }
})