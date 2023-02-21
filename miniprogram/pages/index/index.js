// pages/index/index.js

const app = getApp()

Page({

    /**
     * Page initial data
     */
    data: {
        nickName: "点击登录",
        avatarUrl: "/images/user-unlogin.png",
        userInfo: {},
        search_word: "",
        hot_words: [],
        is_admin: false,
        user: {},
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

    management() {
        if (!app.globalData.logged) {
            this.showModal('提示', '请先登录！')
        } else {
            wx.navigateTo({
                url: '../management/management',
            })
        }
    },

    bindKeyInput(e) {
        var input = e.detail.value
        console.log("检测输入：" + input)
        this.setData({
            search_word: input,
        })
    },

    hotword(e) {
        console.log(e)
        this.data.search_word = e.currentTarget.dataset.word
        this.search()
    },

    search(e) {
        if (!app.globalData.logged) {
            this.showModal('提示', '请先登录！')
        } else if (this.data.search_word == "") {
            this.showModal('提示', '请输入要查询的词语！')
        } else {
            var that = this
            wx.navigateTo({
                url: '../search/search?search_word=' + that.data.search_word,
                success: res => {
                    //通过eventChannel向被打开页面传送数据
                    res.eventChannel.emit('acceptDataFromOpenerPage', {
                        search_word: that.data.search_word,
                    })
                }
            })
        }
    },

    feedback(e) {
        if (!app.globalData.logged) {
            this.showModal('提示', '请先登录！')
        } else {
            wx.navigateTo({
                url: '../feedback/feedback',
            })
        }
    },

    /**
     * Lifecycle function--Called when page load
     */
    onLoad(options) {
        if (!wx.cloud) {
            this.showModal('初始化失败', '请使用 2.2.3 或以上的基础库以使用云能力')
            return
        }

        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            this.setData({
                                nickName: res.userInfo.nickName,
                                avatarUrl: res.userInfo.avatarUrl,
                                userInfo: res.userInfo
                            })
                            app.globalData.userInfo = res.userInfo
                            this.onGetOpenid()
                        }
                    })
                }
            }
        })
    },

    onGetUserInfo(e) {
        if (!app.globalData.logged && e.detail.userInfo) {
            this.setData({
                userInfo: e.detail.userInfo,
                nickName: e.detail.userInfo.nickName,
                avatarUrl: e.detail.userInfo.avatarUrl,
            })
            app.globalData.userInfo = e.detail.userInfo
            this.onGetOpenid()
        }
    },

    onGetOpenid() {
        // 调用云函数
        var that = this
        wx.cloud.callFunction({
            name: 'wechat_sign',
            data: {
                avatarUrl: that.data.avatarUrl,
                gender: that.data.userInfo.gender,
                nickName: that.data.nickName
            },
            success: res => {
                console.log(res)
                if (res.result.errCode == 0) {
                    console.log('服务器返回请求成功')
                    that.setData({
                        is_admin: res.result.data.user.is_admin
                    })
                    that.data.user = res.result.data.user
                    app.globalData.user = res.result.data.user
                    app.globalData.logged = true
                } else {
                    // console.log('服务器返回请求不成功，出现某种问题，需要处理')
                    that.showModal('抱歉，出现错误', res.result.errMsg)
                }
            },
            fail: err => {
                console.error('[云函数] [wechat_sign] 调用失败', err)
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
        // 调用云函数
        var that = this
        wx.cloud.callFunction({
            name: 'get_hot_words',
            data: {},
            success: res => {
                console.log(res)
                if (res.result.errCode == 0) {
                    console.log('服务器返回请求成功')
                    that.setData({
                        hot_words: res.result.data.hot_words
                    })
                } else {
                    // console.log('服务器返回请求不成功，出现某种问题，需要处理')
                    that.showModal('抱歉，出现错误', res.result.errMsg)
                }
            },
            fail: err => {
                console.error('[云函数] [get_hot_words] 调用失败', err)
                that.showModal('调用失败', '请检查云函数是否已部署')
            }
        })
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
    onShareAppMessage(res) {
        if (res.from === 'button') {
            // 来自页面内转发按钮，可添加其他功能实现，如积分奖赏
            console.log(res.target)
        }
        return {
            title: '快速查询近反义词',
            path: '/pages/index/index',
            success: res => {}
        }
    }
})