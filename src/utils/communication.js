import Communications from 'react-native-communications'

export default {
  phoneCall (phone) {
    Communications.phonecall(phone, false)
  },
  sms (phone, text = '') {
    Communications.text(phone, text)
  }
}