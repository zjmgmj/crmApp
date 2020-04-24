<template lang="pug">
nb-header(:style="{backgroundColor: headBgColor, borderBottomWidth: 0}", iosBarStyle="light-content", :androidStatusBarColor="headBgColor")
  view(:style="{flexDirection: 'row', alignItems: 'center', display: 'flex', flex: 1}")
    view(:style="{flexBasis: 50}")
      slot(name="leftBtns", v-if="hasLeft")
        nb-button(:transparent="true", :onPress="headBack")
          iconfont(name="arrowleft", :color="textColor", :size="24")
    view(:style="{flex: 1, alignItems: 'center', display: 'flex'}")
      app-tab(:tabs="tabs", backgroundColor="transparent", v-if="hasTab", inactiveTintColor="white", activeTintColor="white", :onChange="tabChange")
      nb-text(:style="{fontSize: 18, color: textColor}", v-else) {{headTitle}}
    view(:style="{flexBasis: 50, alignItems: 'flex-end'}")
      slot(name="rightBtns")
</template>

<script>
  export default {
    props: {
      hasLeft: {
        type: Boolean,
        default: false
      },
      backFunc: {
        default: null
      },
      headTitle: {
        type: String,
        default: '首页'
      },
      headBgColor: {
        type: String,
        default: '#4ebcff'
      },
      textColor: {
        type: String,
        default: 'white'
      },
      hasTab: {
        type: Boolean,
        default: false
      },
      tabs: {
        default: null
      },
      tabChange: {
        default: null
      }
    },
    methods: {
      headBack () {
        if (this.backFunc) this.backFunc()
      }
    }
  }
</script>