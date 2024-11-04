let app = getApp();
Page({
  data: {

    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    banner: [
      "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/banner01_phone.png",
      "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/banner02.png",
      "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/banner03.png",
      "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/banner04.png"
      // "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/banner_01.jpg",
      // "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/banner_02.jpg",
      // "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/banner_03.jpg",

      // "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/banner_04.jpg"
    ],
    charts: [
        "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/rxbk.png",
        "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/xptj.png",
        "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/xhsf.png"
    ],
    vedios: [
       {
           id: 0,
           imgSrc:  "/public/images/vedio1.png",
           text: "一分钟了解原创系列",
           count: 9
       },
       {
            id: 1,
            imgSrc:  "/public/images/vedio1.png",
            text: "一分钟了解万物系列",
            count: 10
       },
       {
          id: 2,


          imgSrc:  "/public/images/vedio1.png",
          text: "一分钟了解软床专供",
          count: 11
        }
    ],
    
    overViewGoodList: [],  // 一览
    
    hotGoodArr: [
        {
            id: 0,
            title: "极简风格设计师款式蜗牛沙发LKS8873",
            price: 24700

        },
        {
            id: 1,
            title: "极简风格设计师款式云朵沙发S2208",
            price: 8548
        },
        {

            id: 2,
            title: "极简风格设计师款式棉花糖沙发LKS8850",
            price: 8686
        },
        {
            
            id: 3,
            title: "极简风格设计师款式皮埃蒙特沙发LKS8848",
            price: 4232

        },
    ],
    styleNavArr: [
         {
             id: 0,
             title: "极简"
         },

          {
              id: 1,
              title: "轻奢"
          },
          {
                id: 2,
                title: "奶油"
          },
          {

              id: 3,
              title: "中古"
          },
          {
              id: 4,
              title: "侘寂"
          },
          {
              id: 0,
              title: "混搭"
          
          }
    ],
    styleIndex: 0,
    styleId: "",
    styleGoodArr: [],
    token: "",

    playIcon: "/public/icon/play.png",
    dianZhanImg: "/public/icon/dian_zhan.png",
    text1: "/public/images/index_text_1.png",
    text2: "/public/images/index_text_2.png",
    text3: "/public/images/index_text_3.png",
    bigBackSrc: "/public/images/big_back.png",
    emptyImg: "/public/images/empty.png"
  },
  onLoad () {

        let token = wx.getStorageSync("userInfo").access_id;
        this.setData({
          token: token    
        })
  },
  
  onShow () {
       this.getHotGoodFn()
       this.getStyleNavFn()
  },
   // 一览
  getHotGoodFn: function () {
       let _this = this;
       let url = app.globalData.url;
       let token = this.data.token;
        wx.request({
          url: url, 
          method: "get",
          data: {
            api: 'app.product.listProduct',
            storeId: 1,
            storeType: 6,
            page: 1,
            pageSize: 6,
            accessId: token
          },
          header: {
            'content-type': 'application/json'  
          },
          success (res) {
               let goodsList = res.data.data.goodsList;
               _this.setData({
                  overViewGoodList: goodsList
               })
          }
        })
  },
  getStyleNavFn: function () {
      let _this = this;
      let url = app.globalData.url;
      let token = this.data.token;
      wx.request({
        url: url, 
        method: "get",
        data: {
          api: 'saas.dic.getDictionaryInfo',
          storeId: 1,
          storeType: 6,
          page: 1,
          pageSize: 6,
          key: "",
          accessId: token
        },
        header: {
          'content-type': 'application/json'  
        },
        success (res) {
            let styleNavArr = res.data.data.list;
            let  styleId =  styleNavArr[0].value;

            _this.setData({
                styleNavArr: styleNavArr
            })
            _this.getStyleFoodFn(styleId)
        }
      })
  },
  selectStyleFn: function (e) {
        let styleId = e.currentTarget.dataset.item.value;    
        let styleIndex = e.currentTarget.dataset.index;
        this.setData({
          styleIndex: styleIndex,
          styleId: styleId
        })
        this.getStyleFoodFn(styleId)
  },
  getStyleFoodFn: function (styleIds) {
          let _this = this;
          let url = app.globalData.url;
          let token = this.data.token;
          wx.request({
            url: url, 
            method: "get",
            data: {
              api: 'app.product.listProduct',
              storeId: 1,
              storeType: 6,
              page: 1,
              pageSize: 6,
              styleIds: styleIds | "",
              accessId: token
            },
            header: {
              'content-type': 'application/json'  
            },
            success (res) {
                  let goodsList = res.data.data.goodsList;
                  _this.setData({
                       styleGoodArr: goodsList
                  })
            }
          })
  }
})
