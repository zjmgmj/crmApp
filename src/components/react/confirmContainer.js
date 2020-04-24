import React, {
  Component
} from 'react'
import PropTypes from 'prop-types'
import {
  // ViewPropTypes,
  StyleSheet,
  View,
  Text,
  Modal,
  TouchableHighlight,
  Dimensions
} from 'react-native'

const styles = StyleSheet.create({
  maskStyle: {
    backgroundColor: 'black',
    opacity: 0.7,
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0
  },
  modalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'transparent',
  },
  modalContent: {
    backgroundColor: '#fff',
    paddingTop: 20,
    paddingHorizontal: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 18,
    borderColor: 'rgba(0, 0, 0, 0.1)',
    zIndex: 20
  },
  modalTitle: {
    fontSize: 18,
    color: 'black',
    marginBottom: 30
  },
  content: {
    fontSize: 16,
    color: '#888',
    marginBottom: 20
  },
  modalLine: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    height: 0.5,
    backgroundColor: '#ddd'
  }
})

class ConfirmContainer extends Component {
  static propTypes = {
    visible: PropTypes.bool,
    title: PropTypes.string,
    content: PropTypes.string,
    confirm: PropTypes.func,
    confirmText: PropTypes.string,
    confirmColor: PropTypes.string,
    cancel: PropTypes.func,
    cancelText: PropTypes.string,
    cancelColor: PropTypes.string
  }
  static defaultProps = {
    visible: false,
    confirmText: '确定',
    confirmColor: '#4ebdff',
    title: '友情提示',
    cancelText: '取消',
    cancelColor: '#888'
  }
  constructor() {
    super(...arguments)
    this.state = {
      visible: this.props.visible,
      deviceWidth: Dimensions.get('window').width
    }
  }
  closeModal (type) {
    type === 'confirm' ? this.props.confirm() : this.props.cancel()
    this.setState({
      visible: false
    })
    this.props.parentClose()
  }
  render() {
    return (this.state.visible) ? (
      <Modal visible={this.state.visible} animationType={"slide"} transparent={true} onRequestClose={() => {}}>
        <View style={styles.maskStyle}/>
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, {width: (this.state.deviceWidth - 50)}]}>
            <View style={styles.modalLine} />
            <Text style={styles.modalTitle}> {this.props.title} </Text>
            <Text numberOfLines={3} style={styles.content}>{this.props.content}</Text>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <TouchableHighlight onPress={this.closeModal.bind(this, 'cancel')} style={{paddingTop: 15, paddingBottom: 15, alignItems: 'center', borderBottomLeftRadius: 18, borderRightColor: '#ddd', borderRightWidth: 1, flex: 1}} underlayColor={'#ddd'}>
                <Text style={{color: this.props.cancelColor, fontSize: 18, letterSpacing: 2}}>{this.props.cancelText}</Text>
              </TouchableHighlight>
              <TouchableHighlight onPress={this.closeModal.bind(this, 'confirm')} style={{paddingTop: 15, paddingBottom: 15, alignItems: 'center', borderBottomRightRadius: 18, flex: 1}} underlayColor={'#ddd'}>
                <Text style={{color: this.props.confirmColor, fontSize: 18, letterSpacing: 2}}>{this.props.confirmText}</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </Modal>
    ): null
  }
}

export default ConfirmContainer