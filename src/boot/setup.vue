<template lang="pug">
view.container
  //- app-loading(v-if="!isAppReady")
  text(v-if="!isAppReady") 加载资源中....
  app(v-else)
</template>


<script>
import Vue from 'vue-native-core'
import { VueNativeBase } from 'native-base'
import { YellowBox } from 'react-native'
YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader', 'Class RCTCxxModule', 'Native TextInput'])

import App from '../App.vue'
Vue.use(VueNativeBase)
// registering all native-base components to the global scope of the Vue
require('./globalConfig.js')

export default {
  components: { App },
  data () {
    return {
      isAppReady: false
    }
  },
  created () {
    this.loadFonts()
  },
  methods: {
    loadFonts: async function() {
      try {
        // await Expo.Font.loadAsync({
        //   // Ionicons: require("react-native-vector-icons/Fonts/Ionicons.ttf"),
        //   // FontAwesome: require("react-native-vector-icons/Fonts/FontAwesome.ttf"),
        //   // MaterialIcons: require("react-native-vector-icons/Fonts/MaterialIcons.ttf")
        //   // iconfont: require("react-native-vector-icons/Fonts/iconfont.ttf")
        // });
        this.isAppReady = true
      } catch (error) {
        console.log("some error occured", error)
        this.isAppReady = true
      }
    }
  }
};
</script>

<style>
.container {
  flex: 1;
}
</style>

