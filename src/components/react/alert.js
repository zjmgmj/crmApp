import React from 'react'
import AlertContainer from './alertContainer'
import RootSiblings from 'react-native-root-siblings'

export default class AlertModal extends React.Component {
  static instance = null
  static show ({ ...config }) {
    AlertModal.instance = new RootSiblings(
      <AlertContainer visible={true} {...config} parentClose = {AlertModal.parentClose}/>
    )
    return AlertModal.instance
  }
  static parentClose () {
    if (AlertModal.instance instanceof RootSiblings) {
      AlertModal.instance.destroy()
      AlertModal.instance = null
    } else {
      console.error('type error')
    }
  }
  render () {
    return null
  }
}
