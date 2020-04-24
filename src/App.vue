<template lang="pug">
root
  app-navigation(ref="topNavRef")
</template>

<script>
  import { Root } from 'native-base'
  import { TabNavigator, TabBarBottom, StackNavigator, DrawerNavigator } from 'vue-native-router'
  import HomeScreen from './screens/HomeScreen.vue'
  import CustomerScreen from './screens/customer'
  import MsgScreen from './screens/MsgScreen.vue'
  import MeScreen from './screens/MeScreen.vue'
  import CstmFilterScreen from './screens/customer/filter.vue'
  import tabicon from './components/react/tabicon'
  import routeConfig from './utils/route'
  import pickerUtil from './utils/pickerUtil'
  import AVPush from './utils/AVPush'
  import NavigationService from './utils/navigationActions'
  import SplashScreen from 'react-native-splash-screen'
  import { getAsyncStorage, saveAsyncStorage } from './utils/fileUtil'
  import RNSound from './utils/sound'
  import { Dimensions, Platform, PixelRatio } from "react-native"
  console.log('platform os:>>', Platform.OS)
  console.log('height:>>', Dimensions.get("window").height)
  console.log('pix ratio:>>', PixelRatio.get())
  const sceenHeight = Dimensions.get("window").height
  const pxRatio = PixelRatio.get()
  const isPhonXR = Platform.OS === 'ios' && sceenHeight > 811 && pxRatio === 2
  const tabItemHeight = isPhonXR ? 80 : 55
  const tabPaddingBottom = isPhonXR ? 25 : 0
  console.log('tabItem height:>>', tabItemHeight)
  console.log('tabpaddingbottom:>>', tabPaddingBottom)
  // 抽屉
  const cstmFilterDrawer = DrawerNavigator({
    Home: {
      screen: CustomerScreen
    },
  }, {
    initialRouteName: 'Home',
    drawerWidth: 300,
    drawerPosition: 'right',
    contentComponent: CstmFilterScreen
  })

  const tabNavigation = TabNavigator({
    '首页': {
      screen: HomeScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => tabicon('shouye', tintColor)
      }
    },
    '客户': {
      screen: cstmFilterDrawer,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => tabicon('renwu', tintColor)
      }
    },
    '消息': {
      screen: MsgScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => tabicon('huifu', tintColor)
      }
    },
    '我的': {
      screen: MeScreen,
      navigationOptions: {
        tabBarIcon: ({tintColor}) => tabicon('user', tintColor)
      }
    }
  }, {
    initialRouteName: '首页',
    tabBarPosition: 'bottom',
    headerMode: 'none',
    lazy: true,
    animationEnabled: true,
    swipeEnabled: true,
    tabBarComponent: TabBarBottom,
    tabBarOptions: {
      showIcon: true,
      showLabel: true,
      pressOpacity: 0.8,
      activeTintColor: '#4ebcff',
      inactiveTintColor: '#888',
      style: {
        backgroundColor: 'white',
        height: tabItemHeight,
        paddingBottom: tabPaddingBottom 
      },
      labelStyle: {
        fontSize: 13,
        marginTop: -5,
        marginBottom: 5,
      },
      iconStyle: {
        marginBottom: 5,
      },
      indicatorStyle: {
        // 安卓底部会多出一条线
        height: 0
      }
    }
  })



  let appStack = { tab: tabNavigation }
  Object.assign(appStack, routeConfig.routes)
  const AppNavigation = StackNavigator(appStack, {
    initialRouteName: 'tab',
    headerMode: 'none'
  })

  export default {
    components: {
      Root,
      AppNavigation
    },
    beforeDestroy () {
      console.log('app.vue beforeDestroy')
      RNSound.release()
    },
    beforeMount () {
      console.log('app beforeMount')
      this.$nextTick(() => {
        NavigationService.setTopLevelNavigator(this.$refs.topNavRef)
        AVPush.init()
        pickerUtil.initDate()
        RNSound.init()
        this.getSoundConfig()
        this.getVibrateConfig()
        getAsyncStorage('introPage', (resp) => {
          console.log('introPage resp app.vue')
          console.log(resp)
          SplashScreen.hide()
          if (!(resp && resp.result)) {
            NavigationService.navigate('intro')
          }
        }).catch(e => {
          console.log(e)
          SplashScreen.hide()
          NavigationService.navigate('intro')
        })
      })
    },
    methods: {
      pageChange (prevState, currentState) {
        console.log(prevState)
        console.log(currentState)
      },
      getSoundConfig () {
        getAsyncStorage('soundSet').then(resp => {}).catch(e => {
          console.log(e)
          saveAsyncStorage('soundSet', true)
        })
      },
      getVibrateConfig () {
        getAsyncStorage('vibrateSet').then(() => {}).catch(e => {
          console.log(e)
          saveAsyncStorage('vibrateSet', true)
        })
      }
    }
  }
</script>
