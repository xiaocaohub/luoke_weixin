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

        supplyPriceStatus: false, // 供货价
        
        searchValue: "",
        option: {
            sortCriteria: "",
            sort: "asc"
        }
    },
    onLoad (option) {
        let token = wx.getStorageSync("userInfo").access_id;
        let productClass = '-' + option.topId + "-" + option.sid + "-" + option.cid + "-";
        this.setData({
            token: token,
            productClass: productClass
        }, function () {
            this.getGoodListFn()
        })
    },
    onShow () {
          let supplyPriceStatus = wx.getStorageSync('supplyPriceStatus');
          // let search = this.selectComponent("#search");
          // search.blur()
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
    resetFn: function () {
          let option = this.data.option;
          option.sort = "asc";

          this.setData({
              option: option
          }, function () {

             this.getGoodListFn() 
          })
    },
    selectBuyCountFn: function (e) {
        let type = e.currentTarget.dataset.type;
        let option = this.data.option;
        option.sortCriteria = type;
        this.setData({
            option: option
        }, function () {
            this.getGoodListFn()
        })
    },
    selectPriceFn: function (e) {
        let option = this.data.option;
        let sort = option.sort;
        let type = e.currentTarget.dataset.type;
        option.sortCriteria = type;
        if (sort == "asc") {
            option.sort = "desc";
        } else {
            option.sort = "asc";
        }
        this.setData({
            option: option
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
        let filterOption = this.data.option;
        let queryCriteria = JSON.stringify(option);
        let searchValue = encodeURIComponent(this.data.searchValue);
        wx.request({
            url: url, 
            method: "get",
            data: {
                api: "app.product.listProduct",
                storeId: 1,
                storeType: 6,   
                page: page,
                pageSize: pageSize,   
                productClass: productClass,
                styleIds: "",
                sortCriteria: filterOption.sortCriteria,
                productLabel: "",

                // keyword: searchValue,
                keyword: "",
                queryCriteria: queryCriteria,
                sort: filterOption.sort,
                accessId: token
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
                let searchValue = goodsList[0].categoryName;
                _this.setData({
                    goodArr: arr,
                    total: total,
                    page: page,
                    emptyFlag: emptyFlag,
                    searchValue: searchValue
                })
            }
          })
    }
})