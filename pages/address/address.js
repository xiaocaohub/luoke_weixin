Page({
    data: {
       uName: "",

       phone: "",

       region: [],
       detailAddress: ""
    },
    onShow () {
        let resiveGoodInfo = wx.getStorageSync('resiveGoodInfo');
        console.log(resiveGoodInfo)
        this.setData({
            uName: resiveGoodInfo.uName,
            phone: resiveGoodInfo.phone,
            
            region: resiveGoodInfo.region,
            detailAddress: resiveGoodInfo.detailAddress
        })
    },
    putUserNameFn: function (e) {
        let uName = e.detail.value;
        this.setData({
            uName: uName
        })
    },

    putPhoneFn: function (e) {
         let phone =  e.detail.value;
         this.setData({
            phone: phone
         })
    },
    detailFn: function (e) {
        let detailAddress = e.detail.value;

        this.setData({
            detailAddress: detailAddress
        })
    },
    bindRegionChange: function (e) {
        this.setData({
          region: e.detail.value
        })
    },

    submitFn: function ( ) {
    
    
        let uName = this.data.uName;
        let phone = this.data.phone;
        let region = this.data.region;      
        let detailAddress = this.data.detailAddress;
        
        if (!uName) {
            
            wx.showToast({
                title: "请输入用户名",
                icon: "error",
                mask: true
            })

            return ;
        }

        
        if (!phone) {
            wx.showToast({
                title: "请输入手机号码",
                icon: "error",
                mask: true
            })
            return ;
        }

        
        if (region.length == 0) {
            wx.showToast({
                title: "请选择地区",
                icon: "error",
                mask: true
            })
            return ;
        }


        if (!detailAddress) {
            wx.showToast({
                title: "请输入详细地址",
                icon: "error",
                mask: true
            })
            return ;
        }


        let resiveGoodInfo = {
            uName: uName,
            phone: phone,
            region: region,
            detailAddress: detailAddress
        }
        wx.setStorage({
            key: "resiveGoodInfo",
            data: resiveGoodInfo
        })
        wx.showToast({
            title: "保存成功"
        })
        setTimeout(()=>{
             wx.navigateBack()
        }, 2000)
    }
})