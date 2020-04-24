import {
  Toast
} from 'native-base'
import AlertModal from '../components/react/alert'
import ConfirmModal from '../components/react/confirm'
import pickerUtil from './pickerUtil'
import Loading from '../components/react/loading'
let loadPage = null

function toastShow(content, type, bottomText, duration, position) {
  Toast.show({
    text: content,
    duration: duration,
    position: position,
    type: type,
    buttonText: bottomText
  })
}

function pageHide () {
  if (loadPage) Loading.hide(loadPage)
}

export default {
  systemNotice(content, duration = 3000, type = 'warning') {
    toastShow(content, type, '消息通知', duration, 'top')
  },
  msgShow(content, type = 'danger', position = 'top', duration = 3000) {
    toastShow(content, type, '系统提醒', duration, position)
  },
  pageShow() {
    pageHide()
    loadPage = Loading.show()
  },
  pageHide: pageHide,
  alert({ ...config }) {
    return new Promise((resolve, reject) => {
      if (config.confirm) delete config.confirm
      AlertModal.show({
        ...config,
        confirm() {
          resolve()
        }
      })
    })
  },
  confirm({ ...config }) {
    return new Promise((resolve, reject) => {
      if (config.confirm) delete config.confirm
      if (config.cancel) delete config.cancel
      ConfirmModal.show({
        ...config,
        confirm() {
          resolve()
        },
        cancel() {
          reject()
        }
      })
    })
  },
  showPicker ({ ...config }) {
    let type = config.pickerType || 'date'
    return new Promise((resolve, reject) => {
      if (config.confirm) delete config.confirm
      if (config.cancel) delete config.cancel
      if (type === 'date') {
        pickerUtil.showDatePicker({
          ...config,
          confirm(val, idx) {
            resolve(val, idx)
          },
          cancel() {
            reject()
          }
        })
      } else {
        pickerUtil.showDateTimePicker({
          ...config,
          confirm(val, idx) {
            resolve(val)
          },
          cancel() {
            reject()
          }
        })
      }
    })
  },
  hidePicker: pickerUtil.hide
}