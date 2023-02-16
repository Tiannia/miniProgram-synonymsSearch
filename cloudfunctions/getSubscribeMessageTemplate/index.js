// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    //获取当前用户的微信OpenId
    const wxContext = cloud.getWXContext()

    if (wxContext.OPENID == undefined) {
        var result = {}
        result.errCode = 1
        result.errMsg = '没能正确获取到用户的Openid，请退出小程序重试'

        var data = {}
        result.data = data
        return result
    }

    var result = {}
    result.errCode = 0
    result.errMsg = '微信订阅消息模板ID获取成功'

    var data = {}
    data.template = 'wWIPy_EkgiMPaoOs8gk6AdLdyQy632TVoWoROR3UfBY'
    result.data = data
    return result
}