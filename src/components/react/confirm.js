import React from 'react'
import PropTypes from 'prop-types'
import ConfirmContainer from './confirmContainer'
import RootSiblings from 'react-native-root-siblings'

export default class ConfirmModal extends React.Component {
  static instance = null
  static show ({ ...config }) {
    ConfirmModal.instance = new RootSiblings(
      <ConfirmContainer visible={true} {...config} parentClose = {ConfirmModal.parentClose}/>
    )
    return ConfirmModal.instance
  }
  static parentClose () {
    if (ConfirmModal.instance instanceof RootSiblings) {
      console.log('类型正确')
      ConfirmModal.instance.destroy()
      ConfirmModal.instance = null
    } else {
      console.log('类型不对')
    }
  }
  render () {
    return null
  }
}
