// pages/feedback/feedback.js

const app = getApp()

Page({

    /**
     * Page initial data
     */
    data: {
        content: "",
        array: ['增加词语', '加入我们', '商务合作', '其他', 'BUG反馈'],
        index: 0,
        wechatNo: "",
        email: "",
        isShowPic: false,
        fileID: "",
        cloudPath: "",
        template: "",
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

    submitClick(e) {
        if (this.data.content == "") {
            this.showModal('提示', '请输入反馈内容！')
        } else {
            // requestSubscribeMessage
            var that = this
            wx.requestSubscribeMessage({
                tmplIds: [that.data.template],
                success: res => {
                    if (res[that.data.template] === 'accept') {
                        console.log('成功')
                    } else {
                        console.log(`失败（${res[that.data.template]}）`)
                    }
                },
                fail: err => {
                    console.log(`失败（${JSON.stringify(err)}）`)
                },
                complete: () => {
                    // 调用云函数
                    wx.cloud.callFunction({
                        name: 'add_feedback',
                        data: {
                            nickName: app.globalData.userInfo.nickName,
                            content: that.data.content,
                            wechat_account: that.data.wechatNo,
                            email: that.data.email,
                            type: Number(that.data.index) + 1,
                            picture_url: that.data.fileID
                        },
                        success: res => {
                            console.log(res)
                            // 删除了部分 console.log 调试信息
                            if (res.result.errCode == 0) {
                                wx.showModal({
                                    title: '提示',
                                    content: '反馈成功！',
                                    confirmText: "我知道了",
                                    showCancel: false,
                                    success(res) {
                                        if (res.confirm) {
                                            wx.navigateBack({
                                                delta: 1,
                                            })
                                        }
                                    }
                                })
                            } else {
                                that.showModal('抱歉，出现错误', res.result.errMsg)
                            }
                        },
                        fail: err => {
                            console.error('[云函数] [add_feedback] 调用失败', err)
                            that.showModal('调用失败', '请检查云函数是否已部署')
                        },
                        complete: () => {
                            // 重置页面数据（个人觉得更加贴近用户）
                            // 更新：也可直接回到上一级页面
                            // this.setData({
                            //     content: "",
                            //     wechatNo: "",
                            //     email: "",
                            //     fileID: "",
                            //     index: 0,
                            //     isShowPic: false
                            // })
                        }
                    })
                }
            })
        }
    },

    // 上传图片
    doUpload(e) {
        var that = this
        // 选择图片
        wx.chooseMedia({
            count: 1,
            mediaType: ['image', 'video'],
            sizeType: ['compressed'],
            sourceType: ['album', 'camera'],
            success: function (res) {
                wx.showLoading({
                    title: '上传中',
                })

                // 上传图片
                //const filePath = res.tempFilePaths[0]
                const filePath = res.tempFiles[0].tempFilePath
                var timestamp = new Date().getTime()
                const cloudPath = timestamp + filePath.match(/\.[^.]+?$/)[0]

                console.log("filePath:", filePath, ", cloudPath:", cloudPath)

                that.setData({
                    isShowPic: false,
                })

                wx.cloud.uploadFile({
                    cloudPath,
                    filePath,
                    success: res => {
                        console.log('[上传文件] 成功:', res)
                        that.setData({
                            isShowPic: true,
                            fileID: res.fileID,
                            cloudPath: cloudPath,
                        })
                    },
                    fail: e => {
                        console.error('[上传文件] 失败:', e)
                        wx.showToast({
                            icon: 'none',
                            title: '上传失败',
                        })
                    },
                    complete: () => {
                        wx.hideLoading()
                    }
                })
            },
            fail: e => {
                console.error(e)
            }
        })
    },

    bindKeyInputWechat(e) {
        this.setData({
            wechatNo: e.detail.value
        })
    },

    bindKeyInputEmail(e) {
        this.setData({
            email: e.detail.value
        })
    },

    bindPickerChange(e) {
        console.log('picker sends selection change, carries value of', e.detail.value)
        this.setData({
            index: e.detail.value
        })
    },

    bindTextAreaBlur(e) {
        console.log("Content Input:", e.detail.value)
        this.setData({
            content: e.detail.value
        })
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
        // 调用云函数
        var that = this
        wx.cloud.callFunction({
            name: 'getSubscribeMessageTemplate',
            data: {},
            success: res => {
                console.log(res)
                if (res.result.errCode == 0) {
                    console.log('服务器返回请求成功')
                    that.setData({
                        template: res.result.data.template
                    })
                } else {
                    // console.log('服务器返回请求不成功，出现某种问题，需要处理')
                    that.showModal('抱歉，出现错误', res.result.errMsg)
                }
            },
            fail: err => {
                console.error('[云函数] [getSubscribeMessageTemplate] 调用失败', err)
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