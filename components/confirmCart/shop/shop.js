Component({
    properties: {
        orderItem: {
            
            type: Object,

            value: {}
        },
        orderIndex: {
             type: Number,
             value: 0
        }
    },
    data: {
    },

    methods: {
        remarkFn: function (e) {
            let value = e.detail.value;
            let orderIndex = e.currentTarget.dataset.orderindex;
            let option = {

                orderIndex: orderIndex,
                value: value
            }

            
            this.triggerEvent("remarkFn", option)
        } 
    }
})