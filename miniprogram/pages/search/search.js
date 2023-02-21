// pages/search/search.js

// 获取应用实例
const app = getApp()

Page({

    /**
     * Page initial data
     */
    data: {
        search_word: "",
        similar_words: [],
        dataExist: true
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
        console.log("id:" + id + ", idx:" + idx)
        if (this.data.similar_words[idx].isClick) {
            this.showModal('提示', '您已经点过赞了！')

        } else {
            var that = this
            wx.cloud.callFunction({
                name: 'add_words_correlation',
                data: {
                    relation_id: id
                },
                success: res => {
                    console.log(res)
                    if (res.result.errCode == 0) {
                        console.log('服务器返回请求成功')
                        var new_relation = res.result.data.relation
                        new_relation.isClick = 1

                        var tmp_similar_word = "similar_words[" + idx + "]"
                        that.setData({
                            [tmp_similar_word]: new_relation
                        })

                    } else {
                        console.log('服务器返回请求不成功，出现某种问题，需要处理')
                        that.showModal('抱歉，出现错误', res.result.errMsg)
                    }
                },
                fail: err => {
                    console.error('[云函数] [add_words_correlation] 调用失败', err)
                    that.showModal('调用失败', '请检查云函数是否已部署')
                }
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
        // 调用云函数
        var that = this
        wx.cloud.callFunction({
            name: 'query_similar_words',
            data: {
                query_word: that.data.search_word,
                query_type: 1
            },
            success: res => {
                console.log(res)
                if (res.result.errCode == 0) {
                    console.log('服务器返回请求成功')
                    that.setData({
                        similar_words: res.result.data.word.similar_words,
                        dataExist: true
                    })
                } else {
                    // console.log('服务器返回请求不成功，出现某种问题，需要处理')
                    if (res.result.errCode == 3 || res.result.errCode == 4) {
                        that.setData({
                            dataExist: false
                        })
                    }
                    that.setData({
                        similar_words: []
                    })
                    that.showModal('抱歉，出现错误', res.result.errMsg)
                }
            },
            fail: err => {
                console.error('[云函数] [query_similar_words] 调用失败', err)
                that.showModal('调用失败', '请检查云函数是否已部署')
            }
        })
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

            if (data.search_word != "" || data.search_word != undefined) {
                that.search()
            }
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