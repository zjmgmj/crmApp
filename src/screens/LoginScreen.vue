<template lang="pug">
nb-container
  app-header(:headTitle="screenTitle", :hasLeft="true", :backFunc="back")    
    touchable-opacity(:on-press="jumpReg", slot="rightBtns")
      nb-text(:style="{color: '#fff'}") 注册
  view(:style="[styl.bgColorF2, {flex: 1}]")
    nb-form.login-container
      //- nb-item(:fixedLabel="true")
      //-   iconfont(name="dizhi", :style="[styl.color88, styl.mr10]")
      //-   nb-input(:autoFocus="true", v-model="email", placeholder="输入服务器名", :style="styl.ft15")
      nb-item(:fixedLabel="true")
        iconfont(name="user1", :style="[styl.color88, styl.mr10]")
        nb-input(v-model="username", placeholder="输入用户名", :style="styl.ft15")
      nb-item(:fixedLabel="true")
        iconfont(name="password", :style="[styl.color88, styl.mr10]")
        nb-input(returnKeyType="done", :secureTextEntry="true", v-model="pwd", placeholder="输入密码", :style="styl.ft15")
    view(:style="[styl.pt30, styl.pl15, styl.pr15]")
      nb-button(:block="true", :style="styl.bgPrimary",:onPress="loginSubmit")
        nb-text(:style="styl.ft18") 登录
</template>

<script>
  import { mapActions } from 'vuex'
  import sha1 from 'sha1'
  import { getAsyncStorage } from '../utils/fileUtil'
  export default {
    props: {
      navigation: {
        type: Object
      }
    },
    components: {
    },
    data () {
      return {
        // email: 'http://192.168.80.200:8080',
        email: 'http://crmadmin.xingyun361.com',
        username: '',
        pwd: '',        
//      username: 'mql',
//      pwd: '888888'
      }
    },
    beforeMount() {
      // console.log(this.platformOS)
    },
    methods: {
      ...mapActions([
        'setUser'
      ]),
      inputTextChange (val) {
        this.username = val
      },
      loginSubmit () {
        // 校验
        const tempEmail = this.email.toString().trim()
        const tempName = this.username.toString().trim()
        const tempPwd = this.pwd.toString().trim()
        if (tempEmail.length === 0) {
          this.msgShow('服务器地址不能为空')
        } else if (tempName.toString().trim().length === 0) {
          this.msgShow('用户名不能为空')
        } else if (tempPwd.toString().trim().length === 0) {
          this.msgShow('密码不能为空')
        } else {
          // 用户登录
          let encryPwd = sha1(tempPwd)
          console.log('加密:>>' + encryPwd)
          this.loginApi(tempEmail, this.webApi.crmLoginAPI, tempName, encryPwd)
        }
      },
      jumpReg () {
        this.navigate('reg')
      },
      async loginApi (serverUrl, webApi, acct, pwd) {
        try {
          this.pageShow()
          let data = await this.reqPost(serverUrl + webApi, {acct: acct, pwd: pwd}, 'post')
          console.log(data)
          if (data.returnCode === 0) {
            this.pageHide()
            let temp = Object.assign({}, data.currentUser)
            temp.serverUrl = serverUrl
            this.setUser(temp)
            this.msgShow('登录成功', 'success')
            // 异步上传设备唯一标识号
            this.getDeviceToken(temp.id)
            this.back()
          } else {
            this.pageHide()
            this.msgShow(data.errMsg)
          }
        } catch (e) {
          console.warn(e)
          this.pageHide()
          this.msgShow('网络异常')
        }
      },
      async getDeviceToken (uid) {
        try {
          let data = await getAsyncStorage('deviceToken')
          console.log(data)
          if (data) {
            this.sendDeviceToken(uid, data)
          }
        } catch (e) {
          console.log('获取设备唯一标识号失败')
          console.log(e)
        }
      },
      async sendDeviceToken (uid, deviceToken) {
        try {
          let data = await this.reqPost(this.email.toString().trim() + this.webApi.crmUpdateDeviceInfoAPI, {acctId: uid, deviceNum: deviceToken, type: (this.platformOS === 'android' ? 1 : 0)}, 'post')
          console.log(data)
        } catch (e) {
          console.log('异常')
          console.log(e)
        }
      }
    }
  }
</script>

<style lang="stylus">
  .login-container
    backgroundColor #fff
    marginTop 10
</style>