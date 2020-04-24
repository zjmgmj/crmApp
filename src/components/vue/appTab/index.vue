<template lang="pug">
view.app-tab(:style="{backgroundColor: backgroundColor}")
  view.app-tab-item(v-for="(itm, idx) in localTabs", :style="{height: 40}")
    touchable-opacity(:onPress="tabClick.bind(this, idx)")
      iconfont(:name="itm.icon", v-if="itm.icon", :color="tabIndex == idx ? activeTintColor : inactiveTintColor")
      nb-text(:style="[{color: tabIndex == idx ? activeTintColor: inactiveTintColor}, styl.ft15]") {{itm.name}}
    view.app-tab-bottom-line(v-if="tabIndex == idx", :style="{backgroundColor: tabIndex == idx ? activeTintColor : inactiveTintColor}")
</template>

<script>
  export default {
    props: {
      tabs: {
        type: Array,
        required: true
      },
      tabIndex: {
        type: Number,
        default: 0
      },
      onChange: {
        default: null
      },
      inactiveTintColor: {
        type: String,
        default: '#444'
      },
      activeTintColor: {
        type: String,
        default: '#4ebcff'
      },
      backgroundColor: {
        type: String,
        default: 'white'
      }
    },
    data () {
      return {
        localTabs: []
      }
    },
    beforeMount () {
      this.localTabs = this.tabs
    },
    methods: {
      tabClick (idx) {
        this.tabIndex = idx
        if (this.onChange) this.onChange(this.localTabs[idx].name)
      }
    }
  }
</script>

<style lang="stylus">
.app-tab
  height 40
  backgroundColor white
  flexDirection row
  alignItems center
  display flex
  flex 1
.app-tab-item
  flex 1
  alignItems center
  alignSelf center
  justifyContent center
  display flex
  position relative
.app-tab-bottom-line
  position absolute
  bottom 0
  left 0
  right 0
  height 2
  zIndex 10

</style>