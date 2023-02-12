// pages/search/search.js
Page({

    /**
     * Page initial data
     */
    data: {
        search_word: "",
        similar_words: [{
                id: 1,
                correlation: 12,
                similar_word_name: "作废",
                word_name: "取消",
                isClick: false
            },
            {
                id: 2,
                correlation: 8,
                similar_word_name: "取消",
                word_name: "取缔",
                isClick: false
            },
            {
                id: 3,
                correlation: 7,
                similar_word_name: "打消",
                word_name: "取消",
                isClick: false
            },
            {
                id: 4,
                correlation: 2,
                similar_word_name: "勾销",
                word_name: "取消",
                isClick: false
            },
            {
                id: 5,
                correlation: 0,
                similar_word_name: "取消",
                word_name: "取销",
                isClick: false
            }
        ]
    },

    showModal(title, content) {
        wx.showModal({
            title: title,
            content: content,
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
    },

    loveClick(e) {
        console.log(e)
        var id = e.target.id
        var idx = e.target.dataset.idx
        console.log("id:" + id + ",idx:" + idx)
        if (this.data.similar_words[idx].isClick) {
            this.showModal('提示', '您已经点过赞了！')

        } else {
            var tmp_click = "similar_words[" + idx + "].isClick"
            var tmp_correlation = "similar_words[" + idx + "].correlation"
            this.setData({
                [tmp_click]: true,
                [tmp_correlation]: (this.data.similar_words[idx].correlation + 1)
            })
            this.showModal('恭喜', '点赞成功！')
        }
    },

    feedback(e) {
        wx.navigateTo({
            url: '../feedback/feedback',
        })
    },

    bindKeyInput(e) {
        var input = e.detail.value
        console.log("检测输入：" + input)
        this.setData({
            search_word: input,
        })
    },

    search(e) {

    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
        var that = this
        console.log(options)
        // 监听acceptDataFromOpenerPage事件，获取上一页面通过eventChannel传送到当前页面的数据
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            console.log(data)
            that.setData({
                search_word: data.search_word
            })
        })
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

    },

    /**
     * 用户点击分享
     */
    onShareAppMessage() {
        if (res.from === 'button') {
            // 来自页面内转发按钮
            console.log(res.target)
        }
        return {
            title: app.globalData.userInfo.nickName + '向您推荐了词典',
            path: '/pages/index/index',
            success: res => {}
        }
    }
})