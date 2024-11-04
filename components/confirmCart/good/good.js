Component({
    properties: {
        goodItem: {

            type: Object,

            value: {}
        },
        supplyPriceStatus: {
            type: Boolean,
            value: false
        },

        roleId: {
            type: Number | String,

            value: ""
        }
    },
    data: {
        goodImg: "https://luockoo.oss-accelerate.aliyuncs.com/1/7/20240823/1826819740669050880.jpg",
    }
})