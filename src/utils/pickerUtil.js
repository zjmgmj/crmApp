import Picker from 'react-native-picker'
import { NativeModules, Platform } from 'react-native'
const RNDatePicker = NativeModules.RNDatePicker

function createDate(startYear = 1950, len = 80) {
  const endYear = startYear + len
  let dateData = []
  for (let y = startYear; y <= endYear; y++) {
    let month = []
    for (let m = 1; m <= 12; m++) {
      let day = []
      if (m === 2) {
        for (let d = 1; d < 29; d++) {
          day.push((d < 10 ? '0' + d : '' + d))
        }
        if (((y % 4 === 0) && (y % 100 > 0)) || (y % 400 === 0)) day.push('29')
      } else if (([1, 3, 5, 7, 8, 10, 12].findIndex(it => it === m)) >= 0) {
        for (let d = 1; d <= 31; d++) {
          day.push((d < 10 ? '0' + d : '' + d))
        }
      } else {
        for (let d = 1; d <= 30; d++) {
          day.push((d < 10 ? '0' + d : '' + d))
        }
      }
      let _month = {}
      _month[(m < 10 ? '0' + m : '' + m)] = day
      month.push(_month)
    }
    let _year = {}
    _year['' + y] = month
    dateData.push(_year)
  }
  return dateData
}

function createDateTime(config = {}) {
  let years = [],
    months = [],
    days = [],
    hours = [],
    minutes = [];

  for (let i = 1; i < 51; i++) {
    years.push(i + 1980);
  }
  for (let i = 1; i < 13; i++) {
    months.push((i < 10) ? '0' + i : '' + i);
  }
  for (let i = 0; i < 24; i++) {
    hours.push((i < 10) ? '0' + i : '' + i)
  }
  for (let i = 1; i < 32; i++) {
    days.push((i < 10) ? '0' + i : '' + i);
  }
  for (let i = 0; i < 60; i++) {
    minutes.push((i < 10) ? '0' + i : '' + i);
  }
  let pickerData = [years, months, days, hours, minutes];
  let date = new Date();
  let tempM = date.getMonth() + 1
  let selectedValue = [
    date.getFullYear(),
    tempM < 10 ? '0' + tempM : '' + tempM,
    date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate(),
    date.getHours() < 10 ? '0' + date.getHours() : '' + date.getHours(),
    date.getMinutes() < 10 ? '0' + date.getMinutes() : '' + date.getMinutes()
  ]
  Picker.init({
    pickerData,
    selectedValue: config.selectData || selectedValue,
    pickerTitleText: config.title || '',
    pickerConfirmBtnText: config.confirmText || '确认',
    pickerCancelBtnText: config.cancelText || '取消',
    wheelFlex: [2, 1, 1, 1, 1],
    pickerToolBarBg: config.toolbarBg || [255, 255, 255, 1],
    pickerBg: config.pickerBg || [250, 250, 250, 0.8],
    onPickerConfirm: pickedValue => {
      // console.log('area', pickedValue);
      config.confirm(pickedValue)
    },
    onPickerCancel: pickedValue => {
      // console.log('area', pickedValue);
      config.cancel()
    },
    onPickerSelect: pickedValue => {
      let targetValue = [...pickedValue];
      if (parseInt(targetValue[1]) === 2) {
        if (targetValue[0] % 4 === 0 && targetValue[2] > 29) {
          targetValue[2] = 29;
        } else if (targetValue[0] % 4 !== 0 && targetValue[2] > 28) {
          targetValue[2] = 28;
        }
      } else if (targetValue[1] in {
          4: 1,
          6: 1,
          9: 1,
          11: 1
        } && targetValue[2] > 30) {
        targetValue[2] = 30;

      }
      // forbidden some value such as some 2.29, 4.31, 6.31...
      if (JSON.stringify(targetValue) !== JSON.stringify(pickedValue)) {
        // android will return String all the time，but we put Number into picker at first
        // so we need to convert them to Number again
        targetValue.map((v, k) => {
          if (k !== 3) {
            targetValue[k] = parseInt(v);
          }
        });
        Picker.select(targetValue);
        pickedValue = targetValue;
      }
    }
  });
  Picker.show()
}

const pickerDateData = null

const pickerUtil = {
  initDate(startYear = 1950, len = 80) {
    pickerDateData = createDate(startYear, len)
    return pickerDateData
  },
  getDate() {
    if (pickerDateData)
      return pickerDateData
    else
      return initDate()
  },
  showDatePicker(config = {}) {
    let defaultSelectedValue = []
    if (config.selectData) {
      defaultSelectedValue = config.selectData
    } else {
      const date = new Date()
      let month = date.getMonth() + 1
      defaultSelectedValue = [('' + date.getFullYear()), (month < 10 ? '0' + month : '' + month), (date.getDate() < 10 ? '0' + date.getDate() : '' + date.getDate())]
    }
    if ((Platform.OS === 'ios') && RNDatePicker.sysVersion.startsWith('8')) {
      let selectVal = defaultSelectedValue.join('/')
      RNDatePicker.show(config.title, selectVal, resp => {
        console.log(resp)
        config.confirm((resp.split('/')))
      })
      return
    }
    Picker.init({
      pickerData: pickerUtil.getDate(),
      pickerTitleText: config.title || '',
      selectedValue: defaultSelectedValue,
      pickerConfirmBtnText: config.confirmText || '确认',
      pickerCancelBtnText: config.cancelText || '取消',
      onPickerConfirm: config.confirm,
      onPickerCancel: pickedValue => {
        config.cancel()
      },
      pickerToolBarBg: config.toolbarBg || [255, 255, 255, 1],
      pickerBg: config.pickerBg || [250, 250, 250, 1]
    })
    Picker.show()
  },
  showDateTimePicker(config = {}) {
    createDateTime(config)
  },
  hide() {
    if ((Platform.OS === 'ios') && RNDatePicker.sysVersion.startsWith('8')) {
      RNDatePicker.isPickExist(resp => {
        if (resp) RNDatePicker.hide()
      })
      return
    }
    Picker.hide()
  }
}
export default pickerUtil