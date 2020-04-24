<template lang="pug">
view(:style="{flex: 1, backgroundColor: 'white'}")
  scroll-view(:contentContainerStyle="{width: (screenWidth * 4), height: screenHeight}", :pagingEnabled="true", :horizontal="true", :bounces="true", else)
    image(:source="{uri: 'intro1'}", :style="introStyle")
    image(:source="{uri: 'intro2'}", :style="introStyle")
    image(:source="{uri: 'intro3'}", :style="introStyle")
    view(:style="[introStyle]")
      image(:source="{uri: 'intro4'}", :style="introStyle")
      nb-button(:style="{position: 'absolute', bottom: 20, left: 20, right: 20, backgroundColor: '#4ebdff'}", :block="true", :onPress="hideIntro")
        nb-text 立即体验
</template>

<script>
  import { saveAsyncStorage } from '../utils/fileUtil'
  import { Platform } from 'react-native'
  let extract = Platform.OS === 'android' ? require('react-native-extra-dimensions-android') : null
  export default {
    props: {
      navigation: {
        type: Object
      }
    },
    data () {
      return {
        introStyle: {}
      }
    },
    beforeMount () {
      this.introStyle = {
        width: this.screenWidth,
        height: this.screenHeight
      }
      if (Platform.OS === 'android' && extract) this.introStyle.height = this.introStyle.height - extract.get('SOFT_MENU_BAR_HEIGHT') - extract.get('STATUS_BAR_HEIGHT')
    },
    methods: {
      hideIntro () {
        saveAsyncStorage('introPage', {result: true})
        this.navigation.replace('tab')
      }
    }
  }
</script>