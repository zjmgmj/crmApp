<template lang="pug">
nb-container
  app-header(:headTitle="screenTitle", :hasLeft="true", :backFunc="back")
  view(:style="[{flex: 1},styl.bgColorF2]")
    view(:style="styl.bgWhite")
      nb-list-item
        nb-left
          nb-text 声音设置
        nb-right
          nb-switch(:value="voiceStatus", :on-value-change = "voiceChange")
      nb-list-item
        nb-left
          nb-text 震动提醒
        nb-right
          nb-switch(:value="shakeStatus", :on-value-change = "shakeChange")
      //- nb-list-item
        nb-left
          nb-text 清空缓存
        nb-right
          iconfont(name="arrowright", :size="24")
    view(:style="[styl.pt30, styl.pl15, styl.pr15]")
      nb-button(:danger="true", :block="true", :onPress="exitBtn")
        nb-text(:style="styl.ft18") 退出登录
</template>

<script>
  import { mapActions, mapState } from 'vuex'
  import { getAsyncStorage, saveAsyncStorage } from '../../utils/fileUtil'
  export default {
    props: {
      navigation: {
        type: Object
      }
    },
    data () {
      return {
        shakeStatus: true,
        voiceStatus: true
      }
    },
    computed: {
      ...mapState({
        serverUrl: state => state.serverUrl
      })
    },
    beforeMount () {
      const me = this
      getAsyncStorage('soundSet').then(resp => {
        me.voiceStatus = resp
      })
      getAsyncStorage('vibrateSet').then(res => {
        me.shakeStatus = res
      })
    },
    methods: {
      ...mapActions([
        'exitUser'
      ]),
      exitBtn () {
        this.confirm({
          content: '您确定要退出吗？'
        }).then(() => {
          console.log('确定')
          this.getDeviceToken()
          this.exitUser()
          this.navigation.replace('login')
        }, () => {
          console.log('取消')
        })
      },
      voiceChange (val) {
        this.voiceStatus = val
        saveAsyncStorage('soundSet', this.voiceStatus)
      },
      shakeChange (val) {
        this.shakeStatus = val
        saveAsyncStorage('vibrateSet', this.shakeStatus)
      },
      async getDeviceToken () {
        try {
          let data = await getAsyncStorage('deviceToken')
          if (data) {
            this.deviceLogout(data)
          }
        } catch (e) {
          console.log(e)
        }
      },
      async deviceLogout (token) {
        try {
          let data = await this.reqPost(this.serverUrl + this.webApi.crmLogoutAPI, {deviceNum: token, type: (this.platformOS === 'android' ? 1 : 0)}, 'post')
          console.log('logout')
          console.log(data)
        } catch (e) {
          console.log(e)
          console.log('设备退出异常')
        }
      }
    }
  }
</script>