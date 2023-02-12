// pages/management/management.js
Page({

    /**
     * Page initial data
     */
    data: {
        feedbacks: [{
                id: 1,
                content: "我发现这里有一个大bug我发现这里有一个大bug我发现这里有一个大bug我发现这里有一个大bug我发现这里有一个大bug",
                type: 5,
                wechat_account: "shijianfeng",
                email: "shijianfeng@xxx.com",
                picture_url: "/images/search.png",
                create_date_time: "2020-5-15 16:32"
            },
            {
                id: 2,
                content: "这是一个bug",
                type: 4,
                wechat_account: "shijianfeng",
                email: "shijianfeng@xxx.com",
                picture_url: "",
                create_date_time: "2020-5-15 16:32"
            },
            {
                id: 3,
                content: "Lalala",
                type: 2,
                wechat_account: "",
                email: "",
                picture_url: "/images/search.png",
                create_date_time: "2020-5-15 16:32"
            },
            {
                id: 4,
                content: "建议加入词语新兴",
                type: 1,
                wechat_account: "",
                email: "",
                picture_url: "",
                create_date_time: "2020-5-15 16:32"
            }
        ]
    },

    del(e) {
        var that = this

        console.log(e)
        var id = e.target.id
        var idx = e.target.dataset.idx
        console.log("id:" + id + ", idx:" + idx)

        wx.showModal({
            title: '提示',
            content: '您确定要删除该条反馈吗？',
            success(res) {
                if (res.confirm) {
                    console.log('用户点击确定')

                    var tmp = that.data.feedbacks
                    tmp.splice(idx, 1)
                    console.log(tmp)

                    that.setData({
                        feedbacks: tmp
                    })

                    wx.showModal({
                        title: '提示',
                        content: '删除成功',
                        confirmText: "我知道了",
                        showCancel: false,
                        success(res) {
                            if (res.confirm) {
                                console.log('用户点击确定')
                            } else if (res.cancel) {
                                console.log('用户点击取消')
                            }
                        }
                    })
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },



    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {

    },

    /**
     * Lifecycle function--Called when page is initially rendered
     */
    onReady() {

    },

    /**
     * Lifecycle function--Called when page show
     */
    onShow() {

    },

    /**
     * Lifecycle function--Called when page hide
     */
    onHide() {

    },

    /**
     * Lifecycle function--Called when page unload
     */
    onUnload() {

    },

    /**
     * Page event handler function--Called when user drop down
     */
    onPullDownRefresh() {

    },

    /**
     * Called when page reach bottom
     */
    onReachBottom() {

    },

    /**
     * Called when user click on the top right corner to share
     */
    onShareAppMessage() {

    }
})