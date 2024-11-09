let app = getApp();
Page({
    data: {
        searchSrc: "/public/icon/search.png",
        priceUp: "/public/icon/price_up.png",

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

        supplyPriceStatus: false, // 供货价
        searchValue: "",
        option: {
            sortCriteria: "",
            sort: "asc",

            productLabel: ""
        },
        volumeSort: "asc",
        
        priceSort: "asc"
    },
    onLoad (option) {
        let userInfo =  wx.getStorageSync("userInfo");
        let token = "";
        let productClass = "";
        let filterOption = this.data.option;

        
        let searchValue = "";
        if (userInfo) {
           token = userInfo.access_id;
        }
        if (option.topId && option.sid && option.cid) {
            productClass = '-' + option.topId + "-" + option.sid + "-" + option.cid + "-";
        }
        if (option.productLabel) {
            filterOption.productLabel = option.productLabel;
            if (option.productLabel == 101) {
                searchValue = "好物榜";
            }

            if (option.productLabel == 102) {
                searchValue = "找新品";
            }
            if (option.productLabel == 103) {
            
                searchValue =  "找现货";
            }
            this.setData({
               searchValue: searchValue
            })
        }
        this.setData({
            token: token,
            productClass: productClass,
            option: filterOption
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
              _this.getGoodListFn(_this.reachBottomGoodFn)
          })      
    },
    resetFn: function () {
          let option =  {
              sortCriteria: "",
              sort: "asc",
              productLabel: ""
          };
          this.setData({
              option: option
          }, function () {
             this.getGoodListFn(this.filterGoodFn) 
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
            volumeSort: volumeSort
        
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
            priceSort: priceSort
        }, function () {
            _this.getGoodListFn(_this.filterGoodFn, priceSort)
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
        let filterOption = this.data.option;
        let queryCriteria = JSON.stringify(option);
        let searchValue = encodeURIComponent(this.data.searchValue);
        let productLabel = this.data.option.productLabel;
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
                productLabel: filterOption.productLabel,
                // keyword: searchValue,
                keyword: "",
                queryCriteria: queryCriteria,
                // sort: filterOption.sort,
                sort: sort || 'asc',
                accessId: token || ""
            },
            header: {
              'content-type': 'application/json'  
            },
            success (res) {
                let resData = res.data.data;
                let goodsList = resData.goodsList;
                let total = resData.total;
                // let arr = goodArr.concat(goodsList);
                let emptyFlag = false;
                if (goodsList.length == 0) {
                    page -= 1;
                    emptyFlag = true;
                }

                let searchValue = goodsList[0]?goodsList[0].categoryName:"";

                callBack(goodsList)
                _this.setData({
                    // goodArr: arr,
                    total: total,
                    page: page,
                    emptyFlag: emptyFlag
                })           
                if (!productLabel) {
                    _this.setData({               
                        searchValue: searchValue
                    })
                }
            }
          })
    },
    filterGoodFn (arr) {
    
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