Page({
    data: {
      payOverIcon: "/public/icon/pay_successful.png",

      orderNumber: ""
    
    },
    onShow () {
        let orderNumber = wx.getStorageSync("orderNumber")

        console.log("orderNumber", orderNumber)
        this.setData({
           orderNumber: orderNumber
        })
    }
})