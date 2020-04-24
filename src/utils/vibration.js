import {
  Vibration,
  Platform
} from 'react-native'

function defaultPatter() {
  (Platform.OS === 'ios') ? [0, 1000, 2000, 3000] : [0, 1000, 200, 1000]
}

const RNVibration = {
  vibrate(pattern) {
    Vibration.vibrate(pattern === undefined ? defaultPatter() : pattern)
  },
  infinate(pattern) {
    Vibration.vibrate(pattern === undefined ? defaultPatter() : pattern, true)
  },
  stop() {
    Vibration.cancel()
  }
}

export default RNVibration