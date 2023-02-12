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
        logged: false,
        search_word: "",
        hot_words: [{
                id: 1,
                word: "取消",
                hot: 30
            },
            {
                id: 5,
                word: "热爱",
                hot: 14
            },
            {
                id: 9,
                word: "学习",
                hot: 9
            },
            {
                id: 6,
                word: "模仿",
                hot: 1
            }
        ],
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
        if (!this.data.logged) {
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

    search(e) {
        if (!this.data.logged) {
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
        if (!this.data.logged) {
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
                                logged: true,
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
        if (!this.data.logged && e.detail.userInfo) {
            this.setData({
                logged: true,
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
        // wx.cloud.callFunction({
        //   name: 'login',
        //   data: {},
        //   success: res => {
        //     console.log('[云函数] [login] user openid: ', res.result.openid)
        //     app.globalData.openid = res.result.openid
        //     wx.navigateTo({
        //       url: '../userConsole/userConsole',
        //     })
        //   },
        //   fail: err => {
        //     console.error('[云函数] [login] 调用失败', err)
        //     wx.navigateTo({
        //       url: '../deployFunctions/deployFunctions',
        //     })
        //   }
        // })
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