let app = getApp();
Page({
    data: {
        searchSrc: "/public/icon/search.png",

 
        priceDown: "/public/icon/price_up_down.png",
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
        brandName: "",
        option: {
          sortCriteria: "",
          sort: "asc",
          productLabel: ""
       },
        volumeSort: "asc",
        
        priceSort: "asc",
        keyword: "",
        filterNavIndex:0
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
            this.getGoodListFn(this.filterGoodFn)
        })
    },
    onShow () {
        let supplyPriceStatus = wx.getStorageSync('supplyPriceStatus');
        this.setData({
            supplyPriceStatus: supplyPriceStatus
        })  
    },
    onReachBottom () {
          let _this = this;
          let page = this.data.page + 1;
          this.setData({
              page: page
          }, function () {
             this.getGoodListFn(_this.reachBottomGoodFn)
          })      
    },
      selectBuyCountFn: function (e) {    
        let _this = this;
        let option = this.data.option;
        let sort = option.sort;
        let type = e.currentTarget.dataset.type;
        let volumeSort = this.data.volumeSort;
        option.sortCriteria = type;
        if (volumeSort == "asc") {
            volumeSort= "desc";
        } else {
            volumeSort = "asc";
        }
        if (sort == "asc") {
            option.sort = "desc";
        } else {
            option.sort = "asc";
        }
        this.setData({
            option: option,
            page: 1,
            volumeSort: volumeSort,
            filterNavIndex: 1
        }, function () {
            this.getGoodListFn(this.filterGoodFn, volumeSort)
        })
    },

    selectPriceFn: function (e) {
        let _this = this;
        let option = this.data.option;
        let sort = option.sort;
        let type = e.currentTarget.dataset.type;
        let priceSort = this.data.priceSort;
        option.sortCriteria = type;
        if (priceSort == "asc") {
            priceSort= "desc";
        } else {
            priceSort = "asc";
        }
        if (sort == "asc") {
            option.sort = "desc";
        } else {
            option.sort = "asc";
        }

        this.setData({
            option: option,
            page: 1,
            priceSort: priceSort,
            filterNavIndex: 2
        }, function () {
            _this.getGoodListFn(_this.filterGoodFn, priceSort)
        })
    },
    resetFn: function () {
      
          let option =  {
              sortCriteria: "",
              sort: "asc",
              productLabel: ""
          };
          this.setData({
              option: option,
              filterNavIndex: 0
          }, function () {
            this.getGoodListFn(this.filterGoodFn) 
          })
    },
    getGoodListFn: function (callBack, sort) {
        let _this = this;
        let url = app.globalData.url;
        let productClass = this.data.productClass;
        let option = {"brandId":"","minPrice":"","maxPrice":""};
        let page = this.data.page;
        let pageSize = this.data.pageSize;
        let goodArr = this.data.goodArr;
         
        let token = this.data.token;
        
        
        let brandId = this.data.brandId;
        let filterOption = this.data.option;
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
                sortCriteria: filterOption.sortCriteria,
                productLabel: "",
                keyword: "",
                queryCriteria: JSON.stringify(option),
                sort: sort || "asc",
                brandId: brandId,
                accessId: token
                // 供货价
                // supplyPriceStatus: false  
            },
            header: {
              'content-type': 'application/json'  
            },
            success (res) {
                let resData = res.data.data;
                let goodsList = resData.goodsList;
                let total = resData.total;
                let brandName = "";
                // let arr = goodArr.concat(goodsList);
                let emptyFlag = false;
                if (goodsList.length == 0) {
                    page -= 1;
                    emptyFlag = true;
                }
                if (resData) {
                    brandName = resData.brandInfo.brand_name;
                }
      
                callBack(goodsList)
                _this.setData({
                    // goodArr: arr,
                    total: total,
                    page: page,
                    emptyFlag: emptyFlag,
                    brandName: brandName
                })
            }
          })
    },
    filterGoodFn (arr) {
          
      console.log(arr)
          this.setData({
            goodArr: arr
          })
    },
    reachBottomGoodFn: function (arr) {
        let goodArr = this.data.goodArr;
        let goodsList = goodArr.concat(arr);
        this.setData({
          goodArr: goodsList
        })
    }
})