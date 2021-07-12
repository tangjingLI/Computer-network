//TODO 删除单个目标

//初始化
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
    const { goalId } = event

    //目标不存在时直接返回
    if (!goalId) {
        return
    }

    //目标存在时尝试删除单个目标
    try {
        await db
            .collection('goal-records')
            .where({
                goalId
            })
            .remove()

        await db
            .collection('goals')
            .doc(goalId)
            .remove()
    } catch (e) {
        //捕捉到异常时在控制台输出异常信息
        console.log(e)
    }
}
