import React from 'react'
import LoadContainer from './loadingContainer'
import RootSiblings from 'react-native-root-siblings'

export default class Load extends React.Component {
  static show ({ ...config }) {
    return new RootSiblings(
      <LoadContainer visible={true}/>
    )
  }
  static hide = load => {
    (load instanceof RootSiblings) ? load.destroy() : console.error('load instance not exist')
  }
  render () {
    return null
  }
}
