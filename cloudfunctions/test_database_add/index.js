// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV }) // 使用当前云环境

// 云函数入口函数
exports.main = async (event, context) => {

    const db = cloud.database()
    to_add_data = {
        description: "good boy.",
        due: new Date(),
        tags: [
            "cloud",
            "database"
        ],
        style: {
            color: 'red',
            size: 'medium'
        },
        importance: 3,
        location: new db.Geo.Point(12, 23),
        done: false
    }
    console.log('Data to be added:')
    console.log(to_add_data)

    await db.collection('todos')
    .add({
        data: to_add_data
    })
    .then(res => {
        console.log('Successful operation!')
        console.log(res)
    })
}