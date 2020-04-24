import {
  NativeModules,
  DeviceEventEmitter,
  Alert
} from 'react-native'
const AVPush = NativeModules.avPushMoudle
import NavigationService from '../navigationActions'
import compUtil from '../componentUtil'
import RNSound from '../sound'
import RNVibration from '../vibration'
import {
  saveAsyncStorage,
  getAsyncStorage
} from '../fileUtil'
let pushTimeout = null

export default {
  init() {
    console.log('android init')
    this.saveInstallation()
  },
  saveInstallation() {
    AVPush.saveInstallation((installId) => {
      if (installId) {
        console.log('保存成功:>>' + installId)
        saveAsyncStorage('deviceToken', installId)
        DeviceEventEmitter.addListener(AVPush.ON_RECEIVE, (notification) => {
          console.log('on app 内')
          console.log(notification)
          if (pushTimeout) clearTimeout(pushTimeout)
          pushTimeout = setTimeout(() => {
            NavigationService.navigate('消息')
          }, 50)
        })
        DeviceEventEmitter.addListener(AVPush.ON_ERROR, (res) => {
          console.log('android notification error')
          console.log(res)
        })
        DeviceEventEmitter.addListener(AVPush.ON_CUSTOM_RECEIVE, (notification) => {
          if (pushTimeout) clearTimeout(pushTimeout)
          pushTimeout = setTimeout(() => {
            console.log('customer push msg')
            const content = JSON.parse(notification.data).alert
            compUtil.systemNotice(content)
            getAsyncStorage('soundSet').then(resp => {
              if (resp) RNSound.play()
            })
            getAsyncStorage('vibrateSet').then(resp => {
              if (resp) RNVibration.vibrate()
            })
          }, 50)
        })
      }
    })
  }

}