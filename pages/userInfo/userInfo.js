let app = getApp();
Page({
    data: {

        userInfo: "",

        token: "",    
        region: [],
        signatoryType: "",
        companyName: "",
        code: "",
        uName: "",
        userId: "",
        province: "",
        city: "",
        area: "",
        detailAddress: ""
    },
    onShow () {
        let userInfo = wx.getStorageSync("userInfo");
        console.log("userInfo", userInfo)
        let token = "";

        if (userInfo) {
            token = userInfo.access_id;
        }
        this.setData({
            userInfo: userInfo,
            token: token    
        })
    },
    radioChange: function (e) {

        let signatoryType = "";

        let value = e.detail.value;
        if (value == 0) {
          signatoryType = 2;
        } else if (value = 1) {
            signatoryType = 3;
        }
        this.setData({
            signatoryType: signatoryType
        })
    },
    companyNameFn: function (e) {  
        let value = e.detail.value;
        this.setData({
            companyName: value
        })
    },
    codeFn: function (e) {
        let value = e.detail.value;
        this.setData({
            code: value
        })
    },
    uNameFn: function (e) {
      let value = e.detail.value;
      this.setData({  
          uName: value
      })
  },
  userIdFn: function (e) {
      let value = e.detail.value;
      this.setData({
          userId: value
      })
  },
  detailAddressFn: function (e) {
      let value = e.detail.value;
      this.setData({
          detailAddress: value
      })
  },
  bindRegionChange: function (e) {
      let arr = e.detail.value;
      let province = arr[0];
      let city = arr[1]; 
      let area = arr[2];
      this.setData({
        region: e.detail.value,
        province: province,
        city: city,
        area: area
      })
    },
    submitFn: function () {     
       let _this = this;
       let url = app.globalData.url;
       let userInfo = this.data.userInfo;
       let token = this.data.token;
       let signatoryType = this.data.signatoryType;
       let companyName = this.data.companyName;
       let code = this.data.code;
       let uName = this.data.uName;
       let userId = this.data.userId;
       let region = this.data.region;
       let detailAddress = this.data.detailAddress;
       wx.request({
          url: url,
          method: "get",
          data: {    
            api: 'app.user.submitInformation',
            storeId: 1,
            storeType: 6,
            accessId: token,
            signatoryType: signatoryType,
            signatoryName: companyName,
            companyCreditCode: code,
            userName: uName,
            idCard: userId,
            province: region[0],
            city: region[1],
            area: region[2],
            detailedAddress:  detailAddress
          },
          header: {
            'content-type': 'application/json'  
          },
          success (res) {

                if (res.data.code == 200) {
                    userInfo.submitFlag = 1;
                    userInfo.examineFlag = 0;
                    wx.showToast({
                        title: res.data.message,
                        mask: true
                    })

                    wx.setStorageSync('userInfo', userInfo)
                    setTimeout(()=>{
                        wx.navigateBack()
                    }, 2000)
                }  else {
                  wx.showToast({
                    title: res.data.message,
                    icon: "error",
                    mask: true
                  })
                }
          }
       })
    }
})