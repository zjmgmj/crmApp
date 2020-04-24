<template lang="pug">
view(:style="[styl.pad10, {flex: 1, alignItems: 'center', justifyContent: 'center'}]")
  view
    iconfont(name="wushuju", color="#999", :style="styl.textC", :size="60")
    text(:style="[styl.pt10, styl.textC, styl.ft13,styl.color99]") {{msg}}
    nb-button(:block="true", :style="[styl.bgPrimary, styl.mt20, {width: 200}]", v-if="btnText !== ''", :onPress="btnHandler")
      nb-text {{btnText}}
</template>

<script>
  export default {
    props: {
      navigation: {
        type: Object
      },
      msg: {
        type: String,
        default: '暂无数据'
      },
      btnText: {
        type: String,
        default: ''
      },
      btnUrl: {
        type: String,
        default: ''
      },
      btnHandler: {
        type: Function,
        default: null
      }
    }
  }
</script>