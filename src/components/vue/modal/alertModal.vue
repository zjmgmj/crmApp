<template lang="pug">
modal(:isVisible="toggle", :onBackdropPress="cb.bind(this, 'close')")
  view.modal-content
    view.modal-line
    view
      nb-text(:style="[styl.ft20]") {{title}}
    view(v-if="content.length > 0", :style="[styl.pt30, styl.pb30]")
      nb-text(:style="[styl.color66]") {{content}}
    view(:style="[styl.row, {alignItems: 'center', paddingTop: 20, paddingBottom: 20, display: 'flex'}]")
      template(v-if="type == 'alert'")
        touchable-opacity(:onPress="cb.bind(this, 'confirm')")
          nb-text(:style="[styl.colorPrimary]") {{confirmText}}
      template(v-else)
        view(:style="styl.row")
          view(:style="[styl.col]")
            view.modal-right-line
            touchable-opacity.text-center(:onPress="cb.bind(this, 'close')")
              nb-text(:style="[styl.color88]") {{cancelText}}
          view(:style="[styl.col]")
            touchable-opacity.text-center(:onPress="cb.bind(this, 'confirm')")
              nb-text(:style="[styl.colorPrimary]") {{confirmText}}
</template>

<script>
  import modal from 'react-native-modal'
  export default {
    props: {
      toggle: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: '友情提示'
      },
      content: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: 'alert'
      },
      confirmText: {
        type: String,
        default: '确定'
      },
      cancelText: {
        type: String,
        default: '取消'
      },
      cb: {
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
  paddingTop 25
  paddingBottom 0
  justifyContent center
  alignItems center
  borderRadius 18
  borderColor rgba(0, 0, 0, 0.1)
.text-center
  alignItems center
.modal-line
  height 1
  position absolute
  left 0
  right 0
  bottom 60
  backgroundColor #ddd
.modal-right-line
  position absolute
  right 0
  width 1
  bottom -20
  top -24
  backgroundColor #ddd
  zIndex 20
</style>