import ListModel from '../../models/list'
import TimerState from '../../config/timerState'
import { formatDurationToTimer } from '../../utils/dateTimeUtil'

const globalEnv = getApp()


Page({
  data: {
    goalList: null,
    isDataLoaded: false,
    isPieInited: false,
    isCreating: false,
    isUploading: false,
    timerGoalTitle: '',
    timer: '00:00:00',
    timerState: null
  },
 

  
  onShow() {
    // 若初始化id失败则在catch中初始化userId，否则直接获取列表
    this.initOpenIdAndUserId()
      .then()
      .catch(err => {
        if (err === 0) {
          return this.initUserId()
        }
      })
      .then(() => {
        this.getGoalList()
      })

    this.setTimerTips()
  },

  onGoalClick(e) {
    const { goalId } = e.currentTarget.dataset

    wx.navigateTo({
      url: `/pages/detail/index?id=${goalId}`
    })
  },

  onJumpToTimerPage() {
    wx.navigateTo({
      url: '/pages/timer/index'
    })
  },

  setTimerTips() {
    const timerInfo = globalEnv.data
    let stateDesc = ''

    switch (timerInfo.timerState) {
      case TimerState.NONE:
        stateDesc = ''
        break
      case TimerState.PAUSE:
        stateDesc = '暂停中'
        this.setData({
          timer: formatDurationToTimer(timerInfo.duration),
          timerGoalId: timerInfo.goalId
        })
        break
      case TimerState.ONGOING:
        stateDesc = '进行中'
        this.setData({
          timer: formatDurationToTimer(timerInfo.duration)
        })
        globalEnv.startTimer(null, null, duration => {
          this.setData({
            timer: formatDurationToTimer(duration),
            timerGoalId: timerInfo.goalId
          })
        })
    }
    this.setData({
      timerState: stateDesc,
      timerGoalTitle: timerInfo.goalTitle
    })
  },

 

  initOpenIdAndUserId() {
    return new Promise((resolve, reject) => {
      ListModel.getOpenIdAndUserId().then(
        res => {
          const idData = res.result
          globalEnv.data.openid = idData.openId
          if (idData.userId) {
            globalEnv.data.userId = idData.userId
            resolve()
          } else {
            reject(0)
          }
        },
        err => {
          if (err.errCode === -1) {
            showToast('网络不佳，登录失败')
          } else {
            showToast(`登录失败，错误码：${err.errCode}`)
          }
          reject(-1)
        }
      )
    })
  },



  getGoalList() {
    ListModel.getGoalList(globalEnv.data.userId).then(
      res => {
        if (!res.result) {
          this.setData({
            goalList: []
          })
          return
        }
        const formattedData = ListModel.formatGoalList(res.result.data)
        this.setData({
          goalList: formattedData.list,
          wholeTime: formattedData.wholeTime
        })

        this.data.isDataLoaded = true
        if (this.data.isPieInited) {
          this.updatePieOption()
        }
      },
      err => {
        showToast('获取目标列表失败')
      }
    )
  },


})
