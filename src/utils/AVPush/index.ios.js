import {
  PushNotificationIOS,
  AppState
} from 'react-native'
import Vue from 'vue-native-core'
import AV from 'leancloud-storage'
import compUtil from '../componentUtil'
import RNSound from '../sound'
import RNVibration from '../vibration'
import {
  saveAsyncStorage,
  getAsyncStorage
} from '../fileUtil'
import NavigationService from '../navigationActions'

AV.init({
  appId: '1gJuzwa4VUs9JxVUjQGTFNLw-gzGzoHsz',
  appKey: 'H9q5UVpG79STJ2NvhXuV9QhG'
})

Vue.prototype.$AV = AV

var LeancloudInstallation = require('leancloud-installation')(AV)

const InstallObject = AV.Object.extend('_Installation')
const backgroundNotification = null
const AVpush = {
  init() {
    // alert('ios init')
    PushNotificationIOS.addEventListener('register', AVpush.onRegister)
    PushNotificationIOS.addEventListener('notification', AVpush.forceNotification)
    PushNotificationIOS.requestPermissions()
    AppState.addEventListener('change', (newState) => {
      if (newState === 'active') {
        if (backgroundNotification != null) {
          AVpush.notificationTapped()
          backgroundNotification = null
          AVpush.cleanBadge()
        }
      }
    })
    PushNotificationIOS.getInitialNotification().then(notification => {
      if (notification) AVpush.notificationTapped()
    })
  },
  onRegister(deviceToken) {
    // alert('register:>>>' + deviceToken)
    if (deviceToken) {
      saveAsyncStorage('deviceToken', deviceToken)
      AVpush.registerDevice(deviceToken)
    }
  },
  forceNotification(notification) {
    if (AppState.currentState == 'active') {
      console.log(notification)
      compUtil.systemNotice(notification._alert)
      getAsyncStorage('soundSet').then(resp => {
        if (resp) RNSound.play()
      })
      getAsyncStorage('vibrateSet').then(resp => {
        if (resp) RNVibration.vibrate()
      })
    } else if (AppState.currentState == 'background') {
      backgroundNotification = notification
    }
  },
  registerDevice(deviceToken) {
    // alert('installation' + deviceToken)
    LeancloudInstallation.getCurrent().then(installation => {
      installation.set('deviceType', 'ios')
      installation.set('deviceToken', deviceToken)
      installation.set('badge', 0)
      installation.set('apnsTopic', 'zhd.xy.crm')
      installation.save()
    })
  },
  cleanBadge() {
    LeancloudInstallation.getCurrent().then(installation => {
      installation.set('badge', 0)
      return installation.save()
    }).then(result => {
      PushNotificationIOS.setApplicationIconBadgeNumber(0)
    }).catch(err => {
      console.error(err)
    })
  },
  notificationTapped() {
    // alert('top notice')
    NavigationService.navigate('消息')
  }
}
export default AVpush