<template lang="pug">
modal(:onBackdropPress="close", :isVisible="trigger")
  view.modal-content
    slot
</template>

<script>
  import modal from 'react-native-modal'
  // 解决android不能全屏问题，暂时还不知道如何使用...
  // const IOS = Platform.OS === "ios";
  // const WIDTH = Dimensions.get("window").width;
  // const HEIGHT = IOS ? Dimensions.get("window").height : require("react-native-extra-dimensions-android").get("REAL_WINDOW_HEIGHT")
  export default {
    props: {
      trigger: {
        type: Boolean,
        default: false
      },
      close: {
        type: Function,
        required: true
      }
    },
    components: {
      modal
    }
  }
</script>

<style lang="stylus">
  .modal-content
    backgroundColor white
    padding 22
    justifyContent center
    alignItems center
    borderRadius 4
    borderColor rgba(0, 0, 0, 0.1)
</style>
