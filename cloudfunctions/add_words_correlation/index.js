// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    // 检验参数
    if (event.relation_id == undefined) {
        var result = {}
        result.errCode = 2
        result.errMsg = '未传必要参数，请重试'
        var data = {}
        result.data = data
        return result
    }
    // 查出该近义词关系
    const db = cloud.database()
    var relation;
    await db.collection('word_similar_relation')
        .where({
            id: parseInt(event.relation_id)
        })
        .get()
        .then(res => {
            console.log('查询关系成功')
            console.log(res.data)
            relation = res.data[0]
        })
    // 判断该关系是否存在
    if (relation == undefined) {
        var result = {}
        result.errCode = 3
        result.errMsg = '不存在该关系，更新失败'
        var data = {}
        data.relation_id = event.relation_id
        result.data = data
        return result
    }

    // 为该关系的相关度加1
    await db.collection('word_similar_relation')
        .where({
            id: relation.id
        })
        .update({
            data: {
                correlation: relation['correlation'] + 1
            }
        })
        .then(res => {
            console.log('修改关系操作成功')
            console.log(res)
            relation.correlation += 1
        })

        var result = {}
        result.errCode = 0
        result.errMsg = '相关性更新成功'
        var data = {}
        data.relation = relation
        result.data = data
        return result
}