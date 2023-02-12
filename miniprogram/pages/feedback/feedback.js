// pages/feedback/feedback.js
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
        cloudPath: ""
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
            this.showModal('提示', '反馈成功！')
            this.setData({
                content: "",
                wechatNo: "",
                email: "",
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