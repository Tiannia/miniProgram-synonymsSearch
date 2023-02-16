// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {

    /** 是否获取了用户openid start */
    const wxContext = cloud.getWXContext()
    console.log(wxContext)
    if (wxContext.OPENID == undefined) {
        // 返回执行结果
        var result = {}
        result.errCode = 1
        result.errMsg = '未能正确获取到用户的openid，请退出小程序重试'
        var data = {}
        result.data = data
        return result
    }
    /** 是否获取了用户openid end */

    /** 前端是否必传了参数 start */
    if (event.feedback_id == undefined) {
        // 返回执行结果
        var result = {}
        result.errCode = 2
        result.errMsg = '未传必要参数，请重试'
        var data = {}
        result.data = data
        return result
    }
    /** 前端是否必传了参数 end */

    // 实例化数据库连接
    const db = cloud.database()

    /** 校验管理员权限 start */
    var user;
    await db.collection('user')
        .where({
            openid: wxContext.OPENID
        })
        .get()
        .then(res => {
            console.log('根据openid获取用户信息成功')
            console.log(res.data)
            user = res.data[0]
        })

    // 判断该用户的is_admin是否等于1
    if (user == undefined || user.is_admin != 1) {
        var result = {}
        result.errCode = 4
        result.errMsg = '用户不是管理员，无法获取反馈信息'
        var data = {}
        result.data = data
        return result
    }
    /** 校验管理员权限 end */

    var feedback;
    await db.collection('feedback')
        .where({
            _id: event.feedback_id
        })
        .get()
        .then(res => {
            console.log('根据feedback_id查找反馈信息')
            console.log(res)
            feedback = res.data[0]
        })

    var result = {}
    if (feedback == undefined) {
        result.errCode = 3
        result.errMsg = '不存在该反馈'
    } else {
        // 不需要使用 await 
        cloud.deleteFile({
            fileList: [feedback.picture_url]
        }).then(res => {
            console.log('删除反馈对应图片结果')
            console.log(res.fileList)
        }).catch(error => {
            // handle error
        })

        // 从数据库中删除该条反馈
        var total_removed;
        await db.collection('feedback')
            .where({
                _id: event.feedback_id
            })
            .remove()
            .then(res => {
                console.log('删除操作成功')
                console.log(res)
                total_removed = res.stats.removed
            })

        result.errCode = 0
        result.errMsg = '删除成功'
    }

    var data = {}
    data.total_removed = total_removed
    result.data = data
    return result
}