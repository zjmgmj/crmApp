import httpUtil from '../utils/httpUtil'
import styles from '../utils/globalStyle'
import values from '../utils/globalStylValue'
import {
  Platform,
  Dimensions,
  Linking,
  NativeModules
} from 'react-native'
import defaultAvatar from '../../assets/img/icon.png'
import * as screenUtil from '../utils/screenUtil'
import routeConfig from '../utils/route'
import webApi from '../utils/webApi'
import compUtil from '../utils/componentUtil'
import communicationUtil from '../utils/communication'

const RNDatePicker = NativeModules.RNDatePicker
const IOS = Platform.OS === "ios"
const WIDTH = Dimensions.get("window").width
const HEIGHT = IOS ? Dimensions.get("window").height : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT")

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}
export default {
  data() {
    return {
      styl: styles,
      stylVal: values,
      screenWidth: WIDTH,
      screenHeight: HEIGHT,
      defaultAvatar,
      platformOS: Platform.OS,
      webApi
    }
  },
  computed: {
    screenTitle() {
      if (this.navigation) {
        return routeConfig.routeNames[this.navigation.state.routeName] === undefined ? '' : routeConfig.routeNames[this.navigation.state.routeName]
      } else {
        return ''
      }
    },
    isIOS8 () {
      return (IOS && RNDatePicker.sysVersion.startsWith('8'))
    }
  },
  methods: {
    date2Str(date) {
      if (date) {
        let years = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        return [years, month, day].map(formatNumber).join('/')
      } else {
        return ''
      }
    },
    datetime2Str(date) {
      if (date) {
        let years = date.getFullYear()
        let month = date.getMonth() + 1
        let day = date.getDate()
        let hours = date.getHours()
        let mins = date.getMinutes()
        let secds = date.getSeconds()
        let dateStr = [years, month, day].map(formatNumber).join('/')
        return dateStr + ' ' + [hours, mins, secds].map(formatNumber).join(':')
      } else {
        return ''
      }
    },
    time2Str(date) {
      if (date) {
        let hours = date.getHours()
        let mins = date.getMinutes()
        let secds = date.getSeconds()
        return [hours, mins, secds].map(formatNumber).join(':')
      } else {
        return ''
      }
    },
    back(parpams) {
      if (this.navigation) {
        if (parpams) {
          this.navigation.state.params.callBack(parpams)
        }
        this.navigation.goBack()
      }
    },
    navigate(pageName, params) {
      if (!params) {
        params = {
          callBack: function(res) {}
        }
      }
      if (!params.hasOwnProperty('callBack')) {
        params.callBack = function(res) {}
      }
      // params = Object.assign({}, data.currentUser)
      if (this.navigation) this.navigation.navigate(pageName, params)
    },
    jump(pageName, params) {
      if (!params) {
        params = {
          callBack: function(res) {}
        }
      }
      if (!params.hasOwnProperty('callBack')) {
        params.callBack = function(res) {}
      }
      if (this.navigation) this.navigation.navigate(pageName, params)
      // if (this.navigation) this.navigation.push(pageName, params === undefined ? {} : params)
    },
    mobileReg (mobile) {
      var reg = /^1[3|4|5|8|7|9][0-9]\d{4,8}$/
      return reg.test(mobile)
    },
    reqPost: httpUtil.post,
    ifIphoneX: screenUtil.ifIphoneX,
    isIphoneX: screenUtil.isIphoneX,
    scaleHeight: screenUtil.scaleHeight,
    scaleWidth: screenUtil.scaleSize,
    phoneCall: communicationUtil.phoneCall,
    sms: communicationUtil.sms,
    msgShow: compUtil.msgShow,
    pageShow: compUtil.pageShow,
    pageHide: compUtil.pageHide,
    alert: compUtil.alert,
    confirm: compUtil.confirm,
    showPicker: compUtil.showPicker,
    hidePicker: compUtil.hidePicker
  }
}