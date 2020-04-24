import React from 'react'
import PropTypes from 'prop-types'
import { Platform } from 'react-native'
import {
  Textarea,
  Input,
} from 'native-base'

export const inputSupportLanguage = (WrappedComponent) => {
  class InputSupportLanguage extends React.Component {

    constructor (props) {
      super(props)
      this.state = {
        value: props.value || '',
      }
    }

    textChange (val) {
      this.setState({
        value: val
      })
      if (this.props.onChangeText) this.props.onChangeText(val)
    }

    componentWillReceiveProps (nextProps) {
      if (nextProps.value && nextProps.value.toString().trim().length > 0) {
        this.setState({
          value: nextProps.value
        })
      }
    }

    render() {
      return <WrappedComponent {...this.props} onChangeText={this.textChange.bind(this)} value={this.state.value} />;
    }
  }

  InputSupportLanguage.propTypes = {
    value: PropTypes.string,
    defaultValue: PropTypes.string,
  };

  return InputSupportLanguage;
};

export const AppInput = inputSupportLanguage(Input)
export const AppTextarea = inputSupportLanguage(Textarea)