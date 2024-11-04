let app = getApp();
let xlsx = require('../../utils/xlsx.mini.min.js');
 
Page({
    data:{
      selectIcon: "/public/icon/select.png",
      selectOnIcon: '/public/icon/select_on.png',
      operateFlag: false,
      goodArr: [],

      selectGood: [],
      emptyImg: "/public/images/empty.png",
      token: "",
      totalMoney: 0,
      totalCount:0,
      selectAllFlag: 0,
      supplyPriceStatus: false, // 供货价

      userInfo: ""
    },
    onShow () {  
        let userInfo = wx.getStorageSync("userInfo");
        let roleId = userInfo.roleId;

        let token = ""; 
        let supplyPriceStatus = wx.getStorageSync('supplyPriceStatus');

        let supplyPriceStatusValue = "";

        if (userInfo) {
           token = userInfo.access_id;
        }
      
        if (supplyPriceStatus) {
           supplyPriceStatusValue = 1;
        } else {
          supplyPriceStatusValue = "";
        }
        this.setData({
            token: token,
            userInfo: userInfo,
            roleId: roleId,
            supplyPriceStatusValue: supplyPriceStatusValue
        }, function () {
            this.getCartInfoFn()
        })
    },


    operateFn: function () {
        let operateFlag = !this.data.operateFlag;
        this.setData({
            operateFlag: operateFlag
        })
    },

    confirmGoodFn: function () {
        let token = this.data.token;
        let userInfo = this.data.userInfo; 
        if (!userInfo) {
            wx.showToast({
                title: "请登录",
                icon: "error",
                mask: true
            })
            setTimeout(()=> {
               wx.navigateTo({
                    url: "/pages/login/login"
                })
            }, 2000)
            return ;
        }
        let goodArr = this.data.goodArr;
        let selectCount = 0;
        goodArr.forEach((item, index)=> {
             if (item.checked) {
                selectCount += 1;
             }
        })
        if (selectCount == 0) {
            wx.showToast({
                title: "请选择商品",
                icon: "error",
                mask: true
            })
            return ;
        }
        if (selectCount > 100) {
            wx.showToast({
                title: "最多选择100件商品",
                icon: "error",
                mask: true
            })
            return ;
        }
        wx.navigateTo({          
             url: "/pages/confirmCart/confirmCart"
        })
    },
    getCartInfoFn: function () {
        let _this = this;
        let url = app.globalData.url;
        let token = this.data.token;
        wx.request({
          url: url, 
          method: "get",
          data: {    
            api: 'app.cart.index',
            storeId: 1,
            storeType: 6,
            accessId: token
          },
          header: {
            'content-type': 'application/json'  
          },
          success (res) {
                let goodsList = res.data.data.data;
                _this.setData({   
                    goodArr: goodsList
                }, function () {
                    _this.totalFn()
                })
          }
        })
    },
    addFn: function (e) {
          let index = e.detail;
          let selectGood = this.data.goodArr[index];
          selectGood.goods_num += 1;
          this.changeGoodCountFn(selectGood)
    },
    reduceFn: function (e) {
          let index = e.detail;
          let selectGood = this.data.goodArr[index];
          selectGood.goods_num -= 1;
          this.changeGoodCountFn(selectGood)
    },
    changeGoodCountFn: function (selectGood) {
          let _this = this;
          let url = app.globalData.url;
          let token = this.data.token;
          let goodsJson = [{"num": selectGood.goods_num,"cart_id":selectGood.id}]
          wx.request({
            url: url, 
            method: "get",
            data: {
              api: 'app.cart.updateCart',
              storeId: 1,
              storeType: 6,
              accessId: token,
              goodsJson: JSON.stringify(goodsJson)
            },
            header: {
              'content-type': 'application/json'  
              },
              success (res) {
                  if (res.data.data == true) {
                      _this.getCartInfoFn()
                  }
            }
          })     
    },
    selectGoodRequestFn: function (selectId) {
        let _this = this;
        let url = app.globalData.url;
        let token = this.data.token;
        wx.request({
          url: url, 
          method: "get",
          data: {
              api: 'app.cart.checkedCart',
              storeId: 1,
              storeType: 6,
              accessId: token,
              cartIds: selectId
          },
          header: {
            'content-type': 'application/json'  
          },
          success (res) {
             if (res.data.data)  {
                _this.getCartInfoFn()
             }
          }
        })
    },
    selectGoodFn: function (e) {
        let  index = e.detail;
        let selectGood = this.data.goodArr[index];
        this.selectGoodRequestFn(selectGood.id)
    },
    totalFn: function () {    
        let goodArr = this.data.goodArr;
        let selectGood = [];
        let totalMoney = 0;
        let totalCount = 0;  
        let  selectAllFlag = 1;
        if (goodArr.length == 0) {
            selectAllFlag = 0;
        }
        goodArr.forEach((item)=> {
            if (item.checked) {             
                totalMoney += item.price * item.goods_num;
                totalCount += 1;
                selectGood.push(item)
            }
            if (!item.checked) {
                selectAllFlag = 0;
            }
          })
          this.setData({
              totalMoney: totalMoney,
              totalCount: totalCount,
              selectAllFlag: selectAllFlag,
              selectGood: selectGood
          })
    },
    selectAllFn: function () {  
        let selectAllFlag = this.data.selectAllFlag==1?0:1;
        let goodArr = this.data.goodArr;
        let ids = "";
        goodArr.forEach((item, index)=> {
          item.checked = selectAllFlag ;
          ids += item.id + ",";
        })
        this.selectAllGoodRequestFn(ids, selectAllFlag)
    },
    selectAllGoodRequestFn: function (selectId, checked) {
        let _this = this;
        let url = app.globalData.url;
        let token = this.data.token;
        let selectAllFlag = this.data.selectAllFlag==1?0:1;
        wx.request({
          url: url, 
          method: "get",
          data: {
              api: "app.cart.checkedAllCart",
              storeId: 1,
              storeType: 6,
              accessId: token,
              cartIds: selectId,
              checked: checked
          },
          header: {
            'content-type': 'application/json'  
          },
          success (res) {
            if (res.data.data)  {
                _this.getCartInfoFn()
                _this.setData({
                    selectAllFlag: selectAllFlag
                })
            }
          }
        })
    },
    deleteGoodConfirmFn: function () {
        let _this = this;
        let goodArr = this.data.goodArr;
        let length = goodArr.length;
        let deleteIds = "";
        for (let i=length-1; i >= 0; i--) {
            if (goodArr[i].checked) {
                deleteIds += goodArr[i].id + ",";
            }
        }
        wx.showModal({
            title: "提示",
            content: "确认删除吗?",
            success (res) {
                if (res.confirm) {
                    _this.deleteGoodFn(deleteIds)
                }
            }
        })
    },
    deleteGoodFn: function (deleteId) {
        let _this = this;
        let url = app.globalData.url;
        let token = this.data.token;
        wx.request({
          url: url, 
          method: "get",
          data: {
            api: 'app.cart.delCart',
            storeId: 1,
            storeType: 6,
            accessId: token,
            cartIds: deleteId
          },
          header: {
            'content-type': 'application/json'  
          },
          success (res) {
              let resData = res.data;        
              if (resData.code == 200 ) {
                   wx.showToast({
                       title: resData.message,
                       icon: "success",
                       mask: true
                   })
                   _this.getCartInfoFn()
              } else {
                wx.showToast({
                    title: resData.message,
                    icon: "error",
                    mask: true
                })
              }
          }
        })
    },
    putCountFn: function (e) {
         let goodArr = this.data.goodArr;
         let index = e.detail.index;
         let count = parseInt(e.detail.count);
         let flag =   typeof count === 'number';
         if (isNaN(count)) {
             count = 1;
         }
         goodArr[index].goods_num = count;
         this.setData({
            goodArr: goodArr
         }, function () {
             this.totalFn()
         })
    },

    exportCartFn: function () {
        let _this = this;
        let url = app.globalData.url;
        let userInfo = this.data.userInfo;
        let token = this.data.token;
        let goodArr = this.data.goodArr;
        let exportArr = [];
        if (!userInfo) {
            wx.showToast({
                title: "请登录",
                icon: "error",
                mask: true,

                duration: 2800,
                success () {
                    wx.navigateTo({
                        
                       url: "/pages/login/login"
                    })
                }
            })
            return ;
        }

        goodArr.forEach((goodItem, index)=>{
            if (goodItem.checked == 1) {
                let item = {};
                item.area = goodItem.areaName;
                item.picture = goodItem.imgurl;    
                item.categoryName = goodItem.categoryName;
                item.productCode = goodItem.productCode;
                item.parameters = goodItem.skuName;
                item.marque = goodItem.marque;

                item.material = goodItem.material;
                item.num = goodItem.goods_num ;
                item.price = goodItem.price ;
                exportArr.push(item);
            }
      })

      if (exportArr.length == 0) {

         wx.showToast({
             title: "请选择商品",
             icon: "error",
             mask: true
         })
          return ;
      }
      let exportArrStr = JSON.stringify(exportArr);
      wx.request({
          url: url, 
          method: "get",
          data: {
            api: 'app.cart.exportGoodsExcel',
            storeId: 1,
            storeType: 6,
            accessId: token,
            supplierOpen: _this.data.supplyPriceStatusValue,
            content: exportArrStr,

            exportType: 1,
            responseType:'blob'
          },
          header: {
            'content-type': 'application/json'  
          },
          success (res) {
              let resData = res.data;   
              // console.log(resData) 
              _this.downLoadFn(resData, "商品订单")
             // _this.downFn(resData.data)
              // if (resData.code == 200 ) {
                   
              // } else {
                   
              // }
          }
        })
    },

    downLoadFn: function (data, filename) {
      // const data = dataNum;
      // 构建一个表的数据
      let sheet = [];
      let titles = ['测量次数'];//固定显示，可参考效果图
      let longestArray = data[0]; // 假设第一个数组是最长的，用于比较  
      let longestLength = longestArray.length;
      // 遍历数组集合，找出最长的数组 ,做标题
      for (let i = 1; i < data.length; i++) {
        if (data[i].length > longestLength) {
          longestArray = data[i];
          longestLength = data[i].length;
        }
      }

      console.log("longestArray")
      console.log(longestArray)
      console.log("longestArray")

      return ;
      longestArray.forEach((item, i) => {
        let title = '标题' + (i + 1);
        titles.push(title);
      })
      sheet.push(titles)
      data.forEach((item, ii) => {
        let content = [];
        let qqq = [ii + 1]; //列的次数
        let abc = item;
        content = [...qqq, ...abc]
        sheet.push(content);
      })
        var ws = xlsx.utils.aoa_to_sheet(sheet);
        var wb = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(wb, ws, "测量");
        var fileData = xlsx.write(wb, {
          bookType: "xlsx",
          type: 'base64'
        });
        let filePath = `${wx.env.USER_DATA_PATH}/测量.xlsx`
        // 写文件
        const fs = wx.getFileSystemManager()

       
        wx.saveFile({
          tempFilePath: filePath,
          filePath: filePath,
          success: function(res) {
            const savedFilePath = res.savedFilePath;
            wx.shareFile({
              filePath: savedFilePath,
              success: function(res) {
                console.log('分享成功');
              },
              fail: function(error) {
                console.log('分享失败', error);
              }
            });
          },
          fail: function(error) {
            console.log('保存文件失败', error);
          }
        });
    },
    downFn: function (data) {
      let blob = new Blob([data], {type: "application/actet-stream;charset=utf-8"})
      if ('download' in document.createElement("a")) {
          const elink = document.createElement("a");
          elink.download = "产品销售表"  + ".xls"
          elink.style.display = "none";
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href)
          document.body.removeChild(elink)
      } else {
          navigator.msSaveBlob(blob, "购物车订单"  + ".xls")
      }
    }
})