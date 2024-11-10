Component({
    properties: {
        goodItem: {

            type: Object,
            
            value: {}
        },
        index: {
             type: Number,
             value: 1
        },
        supplyPriceStatusValue: {
            type: Number || String,
            value: false

        },

        roleId: {
            type: Number | String,
            value: ""
        }
    },
    data: {
        selectIcon: "/public/icon/select.png",

        selectIconOn: "/public/icon/select_on.png",
        goodImg: "https://luockoo.oss-accelerate.aliyuncs.com/1/7/20240823/1826819740669050880.jpg"
    },
    methods: {
        addFn: function (e) {      
            let index = e.currentTarget.dataset.index;
            this.triggerEvent("cartAddFn", index)
        },
        reduceFn: function (e) {
            let index = e.currentTarget.dataset.index;


            this.triggerEvent("cartReduceFn", index)
        },
        selectGoodFn: function (e) {
             let index = e.currentTarget.dataset.index;
             this.triggerEvent("cartSelectGoodFn", index)
        },
        putCountFn: function (e) {

             console.log(e)
             let index = e.currentTarget.dataset.index;
             let count = e.detail.value;
             let option = {
                 index: index,
                 count: count
             }
             this.triggerEvent("cartPutCountFn", option)
        }
    }
})