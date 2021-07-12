//TODO 获取全部目标

//初始化
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
    const { userId } = event

    //用户不存在时直接返回
    if (!userId) {
        return
    }

    //用户存在时尝试获取用户的目标列表
    try {
        return await db
            .collection('goals')
            .where({
                userId
            })
            .get()
    } catch (e) {
        //捕捉到错误时在控制台输出错误信息
        console.log(e)
    }
}
