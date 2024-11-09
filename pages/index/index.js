let app = getApp();
Page({
  data: {
    
    searchIcon: "/public/icon/search_w.png",

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
    ],
    charts: [
        "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20241108191727.png",
        "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20241108191733.png",
        "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20241108191738.png"
    ],
    vedios: [
       {
          id: 0,
          imgSrc: "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/minute01.png",
          vedioSrc: "https://luockoo.oss-cn-shenzhen.aliyuncs.com/0/1/20240826/%E4%B8%80%E5%88%86%E9%92%9F%E4%BA%86%E8%A7%A3%E5%8E%9F%E5%88%9B%E7%B3%BB%E5%88%97.mp4",
          txt: "一分钟了解原创系列",
          total: "9.5w"
       },
       {
          id: 1,
          imgSrc: "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/minute02.jpg",
          vedioSrc: "https://luockoo.oss-cn-shenzhen.aliyuncs.com/0/1/20240826/%E4%B8%80%E5%88%86%E9%92%9F%E4%BA%86%E8%A7%A3%E4%B8%87%E7%89%A9%E7%B3%BB%E5%88%97.mp4",
          txt: "一分钟了解万物系列",
          total: "2.3w"
       },
       {
          id: 2,
          imgSrc: "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/minute03.jpg",
          vedioSrc: "https://luockoo.oss-cn-shenzhen.aliyuncs.com/0/1/20240826/%E4%B8%80%E5%88%86%E9%92%9F%E4%BA%86%E8%A7%A3%E8%BD%AF%E5%BA%8A%E4%B8%93%E4%BE%9B.mp4",
          txt: "一分钟了解软床专供",
          total: "8.8w"
        }
    ],
    vedioShowFlag: false,
    vedioSrc: "",
    overViewGoodList: [],  // 一览
    hotGoodArr: [
        {
            id: 563,
            title: "极简风格设计师款式蜗牛沙发LKS8873",
            price: 24700,
            imgSrc: "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/rexiao_1_phone.png"
        },
        {
            id: 635,
            title: "极简风格设计师款式云朵沙发S2208",
            price: 8548,
            imgSrc: "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/rexiao_3_phone.jpg"
        },
        {
            id: 648,
            title: "极简风格设计师款式棉花糖沙发LKS8850",
            price: 8686,
            imgSrc: " https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/rexiao_2_phone.png"
        },
        {   
            id: 645,
            title: "极简风格设计师款式皮埃蒙特沙发LKS8848",
            price: 4232,
            imgSrc: "https://luockoo.oss-cn-shenzhen.aliyuncs.com/file/rexiao_4_phone.jpg"
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
    emptyImg: "/public/images/empty.png",
    windowWidth: 375,
    vedioHeight: 200,
    statusBarHeight: 0,
    pageTitleFlag: false
  },

  onLoad () {
        let userInfo = wx.getStorageSync("userInfo");
        let token = "";
        if (userInfo) {
            token = userInfo.access_id;
        }
        this.setData({
          userInfo: userInfo,
          token: token    
        })
  },
  onShow () {
        this.init()
        this.getHotGoodFn()
        this.getStyleNavFn()
        let windowInfo = wx.getWindowInfo()
        let statusBarHeight = windowInfo.statusBarHeight;
        this.setData({
            statusBarHeight: statusBarHeight
        })

  },

  onPageScroll (e) {
     let scrollTop = e.scrollTop;
     let  pageTitleFlag  = false;
     if (scrollTop >= 150) {
         this.setData({         
            pageTitleFlag: true
         })
     } else {
        this.setData({
          pageTitleFlag: false
      })
     }
  },
  onShareAppMessage() {
      return {
        title: '首页',
        path: '/pages/index/index'
      }
  },
  init: function () {
      let deviceInfo = wx.getWindowInfo()
      let windowWidth = deviceInfo.windowWidth;
      let vedioHeight = windowWidth * 0.4;
      this.setData({
          windowWidth: windowWidth,
          vedioHeight: vedioHeight
      })
  },
  searchValueFn: function (e) {
      console.log(e)
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
  },
  showVedioFn: function (e) {
      
      let vedioSrc = e.currentTarget.dataset.item.vedioSrc;


      this.setData({
          vedioShowFlag: true,
          vedioSrc: vedioSrc
      })

  },

  hideVedioFn: function () {
    this.setData({
      vedioShowFlag: false
    })
  }
})
