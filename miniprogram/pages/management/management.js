// pages/management/management.js

// 获取应用实例
const app = getApp()

Page({

    /**
     * Page initial data
     */
    data: {
        feedbacks: []
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
                    // 调用云函数
                    wx.cloud.callFunction({
                        name: 'remove_feedback',
                        data: {
                            feedback_id: id,
                        },
                        success: res => {
                            console.log(res)
                            if (res.result.errCode == 0) {
                                console.log('服务器返回请求成功')

                                // TODO：实时更新，可能存在多个管理员
                                var tmp = that.data.feedbacks
                                tmp.splice(idx, 1)
                                console.log(tmp)

                                that.setData({
                                    feedbacks: tmp
                                })
                                that.showModal('提示', '删除成功')

                            } else {
                                // console.log('服务器返回请求不成功，出现某种问题，需要处理')
                                that.showModal('抱歉，出现错误', res.result.errMsg)
                            }
                        },
                        fail: err => {
                            console.error('[云函数] [remove_feedback] 调用失败', err)
                            that.showModal('调用失败', '请检查云函数是否已部署')
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
        // 禁用分享
        wx.hideShareMenu()
        // 调用云函数
        var that = this
        wx.cloud.callFunction({
            name: 'get_feedbacks',
            data: {},
            success: res => {
                console.log(res)
                if (res.result.errCode == 0) {
                    console.log('服务器返回请求成功')
                    that.setData({
                        feedbacks: res.result.data.feedbacks
                    })
                } else {
                    // console.log('服务器返回请求不成功，出现某种问题，需要处理')
                    that.showModal('抱歉，出现错误', res.result.errMsg)
                }
            },
            fail: err => {
                console.error('[云函数] [get_feedbacks] 调用失败', err)
                that.showModal('调用失败', '请检查云函数是否已部署')
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

    }
})