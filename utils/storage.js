let  storage = {
    getStorageFn: function (key) {
         return window.localStorage.getItem(key)
    },
    setStorageFn: function (key, data) {

          localStorage.setItem(key, JSON.stringify(data))
    },
    removeStorageFn: function (key) {
         window.localStorage.removeItem(key);
    }
}


export default storage;