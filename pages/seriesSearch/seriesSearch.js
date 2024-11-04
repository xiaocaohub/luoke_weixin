let app = getApp();
Page({
    data: {
        searchSrc: "/public/icon/search.png",

        priceUp: "/public/icon/price_up.png",

        priceUpOn: "/public/icon/price_up_on.png",
        productClass: "",
        page: 1,
        pageSize: 10,
        goodArr: [],
        emptyFlag: false,
        screenIcon: "/public/icon/screen_icon.png",
        emptyImg: "/public/images/empty.png",

        goodImg: "https://luockoo.oss-accelerate.aliyuncs.com/1/7/20240905/1831642348333887488.jpg",
        token: "",
        brandName: ""
    },
    onLoad (option) {
      
        let brandId = option.id;
        let brandName = option.brandName;
        let token = wx.getStorageSync("userInfo").access_id;
        let productClass = '-' + option.topId + "-" + option.sid + "-" + option.cid;
        this.setData({
            token: token,
            productClass: productClass,
            brandId: brandId,
            brandName: brandName
        }, function () {
            this.getGoodListFn()
        })
    },
    onShow () {
        let supplyPriceStatus = wx.getStorageSync('supplyPriceStatus');
        this.setData({
            supplyPriceStatus: supplyPriceStatus
        })  
    },
    onReachBottom () {
          let page = this.data.page + 1;
          this.setData({
              page: page
          }, function () {
               this.getGoodListFn()
          })      
    },
    getGoodListFn: function () {
        let _this = this;
        let url = app.globalData.url;
        let productClass = this.data.productClass;
        let option = {"brandId":"","minPrice":"","maxPrice":""};
        let page = this.data.page;
        let pageSize = this.data.pageSize;
        let goodArr = this.data.goodArr;
         
        let token = this.data.token;
        let brandId = this.data.brandId;
        wx.request({
            url: url, 
            method: "get",
            data: {
                api: "app.product.listProduct",
                storeId: 1,
                storeType: 6,   
                page: page,
                pageSize: pageSize,   
                productClass: "",
                styleIds: "",
                sortCriteria: "",
                productLabel: "",
                keyword: "",
                queryCriteria: JSON.stringify(option),
                sort: "",
                brandId: brandId,
                accessId: token,
                supplyPriceStatus: false // 供货价
            },
            header: {
              'content-type': 'application/json'  
            },
            success (res) {
                let resData = res.data.data;
                let goodsList = resData.goodsList;
                let total = resData.total;
                let arr = goodArr.concat(goodsList);
                let emptyFlag = false;
                if (goodsList.length == 0) {
                    page -= 1;
                    emptyFlag = true;
                }
                _this.setData({
                    goodArr: arr,
                    total: total,
                    page: page,
                    emptyFlag: emptyFlag
                })
            }
          })
    }
})