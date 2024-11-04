let app = getApp();
Page({
    data: {
        tableNavArr: [
            {
              id: 0,
              title: "全部",
              status: ""
          },
          {
            id: 1,
            title: "待付款",
            status: 1
          },
          {
              id: 2,
              title: "待确认",
              status: 2
          },
          {
            id: 3, 
            title: "配货中",
            status: 3
          },
          {
            id: 4,
            title: "已发货",
            status: 4
          },
          {
            id: 5,
            title: "已完成",
            status: 5
          },
          {
              id: 6,
              title: "已取消",
              status: 0
          }
        ],
        currentIndex: 0,
        orderArr: [],
        status: "", 

        currentPage: 1,
        
        pageSize: 10,
        orderTotalCount: 0,
        emptyImg: "/public/images/empty.png",
        goodImg: "https://luockoo.oss-accelerate.aliyuncs.com/1/7/20240823/1826819740669050880.jpg"
    },
    onLoad (option) {
         console.log(option)
         let _this = this;
         let currentIndex = 0;
         let status = "";
         if (id == 'NaN') {
             currentIndex = 0;
             status = "";
         
        } else {
          currentIndex = option.id;
          status = option.id;   
        }
         _this.setData({
            currentIndex: currentIndex,
            status: status
        })
    },
    onShow () {
        let userInfo = wx.getStorageSync('userInfo');
        let token = userInfo.access_id;
        this.setData({
            token: token,
            userInfo: userInfo

        }, function () {
              this.getOrderListFn()
        })
    },
    selectNavFn: function (e) {
        let index = e.currentTarget.dataset.index;
        let navItem = this.data.tableNavArr[index];
        this.setData({
            currentIndex: index,
            status: navItem.status,
            currentPage: 1
        }, function () {
            this.getOrderListFn()
        })
    },
    getOrderListFn: function () {
        let _this = this;
        let url = app.globalData.url;
        let token = this.data.token;
        wx.request({
          url: url, 
          method: "get",
          data: {    
              api: 'app.orderV2.orderList',
              storeId: 1,
              storeType: 6,
              accessId: token,
              orderParentNo: "",
              status: this.data.status, 
              pageSize: this.data.pageSize, 
              pageNum: this.data.currentPage, 
              startTime: "",
              endTime: "",
              keyWords: ""
          },
          header: {
            'content-type': 'application/json'  
          },
          success (res) {
               let resData = res.data.data;
               let orderArr = resData.records;
               _this.setData({
                   orderArr: orderArr
               })
          }
        })
    }
})