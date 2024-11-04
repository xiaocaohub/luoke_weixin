Page({
    data: {
        checkIcon: "/public/icon/select_gray.png",

        checkedIcon: "/public/icon/check_on.png",

        selectFlag: false
    },
    selectFn: function () {
        let  selectFlag = !this.data.selectFlag;
        this.setData({
            selectFlag: selectFlag
        })
    },
    loginFn: function () {

        wx.showModal({
          content: '我已阅读并同意《珞珂用户协议》《信息数据收集协议》',
          cancelText: "不同意",
          confirmText: "同意",
          success (res) {
            if (res.confirm) {
              console.log('用户点击确定')
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
    }
})