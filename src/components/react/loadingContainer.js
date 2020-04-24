import React from 'react'
import PropTypes from 'prop-types'
import {
  StyleSheet,
  View,
  Modal,
  Image,
} from 'react-native'
import loadGif from '../../../assets/img/h_d.gif'

const styles = StyleSheet.create({
  maskStyle: {
    backgroundColor: 'rgba(255,255,255,0.7)',
    // opacity: 0.7,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1
  },
  loadStyle: {
    width: 60,
    height: 24
  }
})

class LoadContainer extends React.Component {
  render() {
    return (
      <Modal visible={this.props.visible} transparent={true} onRequestClose={() => {}}>
        <View style={styles.maskStyle}>
          <Image source={loadGif} style={styles.loadStyle}/>
        </View>
      </Modal>
    )
  }
}

export default LoadContainer