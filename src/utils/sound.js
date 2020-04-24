import Sound from 'react-native-sound'
import notificationSound from '../../assets/prompt.mp3'
import {
  Platform
} from 'react-native'

const soundObj = null

Sound.setCategory('Playback')

function factPay() {
  soundObj.setVolume(0.5)
  if (Platform.OS === 'ios') soundObj.setPan(0.5)
  soundObj.play((success) => {
    // console.log(success)
    // success ? RNSound.isPlaying = false : console.error('播放失败')
    RNSound.isPlaying = false
  })
}

const RNSound = {
  isPlaying: false,
  init(voiceUrl = notificationSound) {
    if (soundObj) {
      return soundObj
    } else {
      soundObj = new Sound(voiceUrl, (e) => {
        if (e) {
          console.error(e)
          soundObj = null
          return
        }
      })
      return soundObj
    }
  },
  play() {
    if (soundObj) {
      console.log('开始播放')
      if (RNSound.isPlaying) {
        soundObj.stop(() => {
          factPay()
        })
      } else {
        RNSound.isPlaying = true
        factPay()
      }
    } else {
      console.error('对象不存在')
    }
  },
  puase() {
    if (soundObj) soundObj.parse()
  },
  release() {
    if (soundObj) {
      soundObj.release()
      soundObj = null
    }
  }
}

export default RNSound