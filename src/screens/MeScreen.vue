<template lang="pug">
nb-container(:style="[styl.bgColorF2]")
  nb-header(:style="[styl.bgPrimary, {borderBottomWidth: 0}]", iosBarStyle="light-content", :androidStatusBarColor="stylVal.mainColor")
    view(:style="{flexDirection: 'row', alignItems: 'center', display: 'flex', flex: 1, height: 50}")
      view(:style="{flexBasis: 50}")
      view(:style="{flex: 1, alignItems: 'center', display: 'flex'}")
        nb-text(:style="{fontSize: 18, color: stylVal.whiteColor}") 个人中心
      view(:style="{flexBasis: 50, alignItems: 'flex-end'}")
        touchable-opacity(:onPress="jump.bind(this, 'setting')")
          iconfont(name="set", :color="stylVal.whiteColor")
  nb-content
    view.card-bg(:style="ifIphoneX({height:140}, {height:145}, {height: 160})")
      view.card-blue
      nb-card.profile-card(:style="{width: (screenWidth - 30)}")
        nb-thumbnail.profile-avatar(:source="currentUser.avatar == null ? defaultAvatar : {uri: currentUser.avatar}")
        nb-card-item(:style="{borderTopLeftRadius:10, borderTopRightRadius: 10,borderBottomRightRadius: 0, paddingTop: 15}")
          nb-text(:style="[styl.ft16, styl.color33]") {{currentUser.name}}
        nb-card-item(:style="[styl.pt0]")
          iconfont(name="card",:size="14")
          nb-text(:style="[styl.ft13, styl.color66, styl.ml15]") {{currentUser.fkDpt == undefined ? '平台部' : currentUser.fkDpt.name}}
          nb-text(:style="[styl.ft13, styl.color66, styl.ml15]") {{currentUser.dataLevel}}
        nb-card-item(:style="[styl.pt0]")
          iconfont(name="gongsi", :size="14")
          nb-text(:style="[styl.ft13, styl.color66, styl.ml15]") {{currentUser.fkDpt == undefined ? '江苏智恒达型云网络科技有限公司' : currentUser.fkDpt.fkOrg.name}}
        nb-card-item(:style="{borderBottomLeftRadius:8, borderBottomRightRadius: 8, paddingTop: 0, paddingBottom: 15}")
          iconfont(name="phone", :size="16")
          nb-text(:style="[styl.ft13, styl.color66, {marginLeft: 13}]") {{currentUser.phone}}
    view(:style="[{flex: 1}]")
      view(:style="[styl.bgWhite, styl.pb30]")
        view(:style="[styl.row, styl.pt10]", v-for="item in meMiddleIcons")
          view(:style="[styl.col]", v-for="subItem in item")
            touchable-opacity(:onPress="jumpFixScreen.bind(this, subItem.pageName)", :style="{alignItems: 'center'}")
              iconfont(:name="subItem.icon", :size="26", :color="subItem.iconColor")
              view(:style="styl.pt10")
                nb-text(:style="[styl.ft13, styl.color44]") {{subItem.title}}
      view(:style="[styl.mt10, styl.bgWhite]")
        //- nb-list-item(icon, :onPress="jumpFixScreen.bind(this, 'aboutUs')")
        //-   nb-left
        //-     iconfont(name="about")
        //-     nb-text(:style="[styl.ml15, styl.ft14, styl.color33]") 关于我们
        //-   view
        //-     iconfont(name="arrowright")
        nb-list-item(icon, :onPress="jumpFixScreen.bind(this, 'linkUs')")
          nb-left
            iconfont(name="lianxi")
            nb-text(:style="[styl.ml15, styl.ft14, styl.color33]") 联系我们
          view
            nb-text(:style="styl.color66") 400-8788-361
          view
            iconfont(name="arrowright")
        nb-list-item(icon)
          nb-left
            iconfont(name="banben")
            nb-text(:style="[styl.ml15, styl.ft14, styl.color33]") 版本信息
          view
            nb-text(:style="styl.color66") {{version}}
          view
            iconfont(name="arrowright")
</template>

<script>
  import { mapState } from 'vuex'
  export default {
    props: {
      navigation: {
        type: Object
      }
    },
    components: {
    },
    computed: {
      ...mapState({
        meMiddleIcons: state => state.meMiddleIcons,
        version: state => state.version,
        isLogin: state => state.isLogin,
        currentUser: state => state.currentUser
      })
    },
    data () {
      return {
        routeListener: null
      }
    },
    beforeMount () {
      const me = this
      console.log(this.currentUser.avatar)
      this.routeListener = this.navigation.addListener('willFocus', (prepload) => {
        me.userLogin()
      })
    },
    beforeDestroy () {
      if (this.routeListener) this.routeListener.remove()
    },
    methods: {
      jumpFixScreen (title) {
        if (title === 'linkUs') {
          this.phoneCall('4008788361')
        } else {
          // 页面跳转
          if (title != '')
            this.jump(title)
          else
            this.msgShow('正在开发中...', 'warning')
        }
      },
      userLogin () {
        if (!this.isLogin) {
          this.alert({content: '用户未登录,请先登录'}).then(() => this.navigate('login'))
          return
        }
      },
    }
  }
</script>

<style lang="stylus">
  .card-bg
    backgroundColor #f2f2f2
    height 160
  .card-blue
    height 80
    backgroundColor #4ebdff
  .profile-avatar
    height 50
    width 50
    position absolute
    top 13
    right 15
    borderRadius 20
    borderWidth 0
    zIndex 10
  .profile-card
    position absolute
    top 0
    left 15
    right 15
    zIndex 20
    borderRadius 10
    borderWidth 0
</style>