// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
}) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {
    // 检查传递的参数
    if (event.query_word == undefined) {
        var result = {}
        result.errCode = 2
        result.errMsg = '未传必要参数，请重试'

        var data = {}
        result.data = data
        return result
    }
    // 搜索类型，1为近义词，2为反义词
    if (event.query_type == undefined) {
        event.query_type = 1
    }
    // 查询是否存在该词
    const db = cloud.database()
    var word;
    await db.collection('word')
        .where({
            word: event.query_word
        })
        .get()
        .then(res => {
            console.log('查词成功！')
            word = res.data[0]
        })
    console.log(word)

    if (word == undefined) {
        var result = {}
        result.errCode = 3
        result.errMsg = '不存在该词，可联系我们添加'

        var data = {}
        result.data = data
        return result
    } else {
        // 该词语的热度加1（可以进一步检测是否为同一用户）
        await db.collection('word')
            .where({
                id: word.id
            })
            .update({
                data: {
                    hot: word['hot'] + 1
                }
            })
            .then(res => {
                console.log('修改热度成功')
                console.log(res)
            })
    }

    // 判断该词语是否存在近义词关系
    const _ = db.command

    await db.collection('word_similar_relation')
        .where(
            _.or([{
                    word_id: word.id,
                    type: event.query_type
                },
                {
                    similar_word_id: word.id,
                    type: event.query_type
                }
            ])
        )
        .orderBy('correlation', 'desc')
        .get()
        .then(res => {
            console.log('获取近义词关系成功')
            console.log(res.data)
            word.similar_words = res.data
        })

    var result = {}
    if (word.similar_words.length == 0) {
        result.errCode = 4
        result.errMsg = '不存在该词的关联词，可以联系我们添加'
    } else {
        result.errCode = 0
        result.errMsg = '查询成功'
    }
    var data = {}
    data.word = word
    result.data = data
    return result
}