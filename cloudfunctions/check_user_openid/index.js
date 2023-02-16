// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    // 封装：检测用户openid
    const wxContext = cloud.getWXContext()
    console.log('成功获取用户信息')
    console.log(wxContext)
    var result = {}
    var data = {}
    if (wxContext.OPENID == undefined) {
        // 返回执行结果
        result.errCode = 1
        result.errMsg = '未能正确获取到用户的openid，请退出小程序重试'
    } else {
        result.errCode = 0
        result.errMsg = '成功获取到用户的openid'
        data.openid = wxContext.OPENID
    }
    result.data = data
    return result
}