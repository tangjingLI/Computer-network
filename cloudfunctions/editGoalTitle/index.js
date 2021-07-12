//TODO 修改目标标题

//初始化
const cloud = require('wx-server-sdk')

cloud.init({
    env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()

exports.main = async (event, context) => {
    const { goalId, goalTitle } = event

    //目标不存在或目标没有标题时直接返回
    if (!goalId || !goalTitle) return

    //目标存在且有标题时尝试修改目标标题
    try {
        const result = await db
            .collection('goals')
            .doc(goalId)
            .update({
                data: {
                    title: goalTitle
                }
            })
        result.data = {
            goalId,
            goalTitle
        }
        return result
    } catch (e) {
        //捕捉到异常时在控制台输出异常信息并返回该异常
        console.log(e)
        return e
    }
}
