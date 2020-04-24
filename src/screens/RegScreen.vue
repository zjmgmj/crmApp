<template lang="pug">
nb-container
  app-header(:headTitle="screenTitle", :hasLeft="true", :backFunc="back")
  view(:style="[styl.bgColorF2, {flex: 1}]")
    nb-form.login-container
      nb-item(:fixedLabel="true", :success="mobileRule", :error="!mobileRule && defaultRule")
        iconfont(name="dianhua", :style="[styl.color88, styl.mr10]")
        nb-input(:autoFocus="true", v-model="mobile", placeholder="输入手机号码", :style="styl.ft15")
      nb-item(:fixedLabel="true", :style="{alignItems: 'center'}", :success="verifyCodeRule", :error="!verifyCodeRule && defaultRule")
        iconfont(name="yanzhengma", :style="[styl.color88, styl.mr10]")        
        nb-input(v-model="verifyCode", placeholder="输入验证码", :style="styl.ft15")
        touchable-opacity(:on-press="getVerifyCode", :disabled='disabledState')
          view(:style="{paddingLeft: 5, paddingRight: 5, paddingTop: 5, paddingBottom: 5, borderRadius: 3, borderWidth: 1, borderStyle: 'solid', borderColor: '#66c3fd', marginRight: 5}")
            nb-text(:style="{color: '#66c3fd', fontSize: 13}") {{verifyCodeText}}
        //- nb-button(:onPress="getVerifyCode", :style="{backgroundColor: '#4ebdff', marginTop: 2}", :disabled='disabledState')
          nb-text(:style="styl.ft12") {{verifyCodeText}}
      nb-item(:fixedLabel="true", :success="userNameRule", :error="!userNameRule && defaultRule")
        iconfont(name="user1", :style="[styl.color88, styl.mr10]")
        nb-input(v-model="userName", placeholder="输入用户名", :style="styl.ft15")
      nb-item(picker, :success="dptIdRule", :error="!dptIdRule && defaultRule", :style="{paddingRight: 5}")
        iconfont(name="gongsi", :style="[styl.color88, styl.mr10]")
        nb-picker(mode="dropdown", placeholder="请选择部门", :selectedValue="dptId", :placeholderStyle="styl.color88", :onValueChange="onValueChange")
          nb-item(:label="item.name", :value="item.id", v-for="item in dptArr", :key="item.id",  v-if="dptArr.length > 0")
      nb-item(:fixedLabel="true", :success="pwdRule", :error="!pwdRule && defaultRule")
        iconfont(name="password", :style="[styl.color88, styl.mr10]")
        nb-input(returnKeyType="done", :secureTextEntry="true", v-model="pwd", placeholder="输入密码", :style="styl.ft15")
      nb-item(:fixedLabel="true", :success="repeatPwdRule", :error="!repeatPwdRule && defaultRule")
        iconfont(name="password", :style="[styl.color88, styl.mr10]")
        nb-input(returnKeyType="done", :secureTextEntry="true", v-model="repeatPwd", placeholder="输入确认密码", :style="styl.ft15")
    view(:style="[styl.pt30, styl.pl15, styl.pr15]")
      nb-button(:block="true", :style="styl.bgPrimary",:onPress="regSubmit")
        nb-text(:style="styl.ft18") 注册
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
    components: {},
    data () {
      return {
        // email: 'http://192.168.80.91:8080',
        // email: 'http://172.16.120.250:7786',
        // email: 'http://192.168.80.200:8080',
        email: 'http://crmadmin.xingyun361.com',
        defaultRule: false,
        mobileRule: false,
        verifyCodeRule: false,
        userNameRule: false,
        pwdRule: false,
        repeatPwdRule: false,
        dptIdRule: false,
        mobile: '',
        verifyCode: '',
        userName: '',
        pwd: '',
        repeatPwd: '',
        dptId: '',
        dptArr: [],
        verifyCodeText: '获取验证码',
        disabledState: false
      }
    },
    beforeMount () {
      this.getDpt()
    },
    methods: {
      // inputBlur (key) {
      //   console.log('-----inputBlur')
      //   if (key  == 'mobile') {
      //     this.mobileRule = this.mobileReg(this.mobile)
      //   }
      // },
      getVerifyCode() {
        // console.log('mobile:'+this.mobileReg(this.mobile))
        if (this.mobileReg(this.mobile)) {
          this.verifyCodeAsync()
        } else {
          this.msgShow('请输正确入手机号码')
          return          
        }
      },
      async verifyCodeAsync () {        
        try {
          let me = this
          this.disabledState = true
          let m = 59
          me.verifyCodeText = m + 's'
          let st = setInterval(() => {
            m--
            me.verifyCodeText = m + 's'
            if (m == 0) {
              clearInterval(st)
              me.verifyCodeText = '重新获取'
              me.disabledState = false
            }
          }, 1000)
          let data = await this.reqPost(this.email + this.webApi.crmSmsCreateAPI, {mobile: this.mobile}, 'post')
          // console.log('---------')
          // console.log(data)
          if (data.returnCode !== 0) {
            this.msgShow('获取失败，请重新获取')
            this.verifyCodeText = '重新获取'
            clearInterval(st)
            this.disabledState = false
          }
        } catch (e) {
          console.log('异常')
          console.log(e)
        }
      },
      async getDpt () {
        try {
          let data = await this.reqPost(this.email + this.webApi.crmDptQueryComboAPI, {pageSize: 10}, 'post')
          if (data.returnCode == 0) {
            this.dptArr = data.list.content
            this.dptId = (this.platformOS === 'ios') ? '' : this.dptArr[0].id
          }          
        } catch (e) {
          console.log('异常')
          console.log(e)
        }
      },      
      async acctCreate (params) {
        try {
          let data = await this.reqPost(this.email + this.webApi.crmAcctCreateAPI, params, 'post')
          if (data.returnCode == 0) {
            this.msgShow('注册成功', 'success')
            this.back()
          } else {
            this.msgShow(data.errMsg)
          }    
        } catch (e) {
          console.log('异常')
          console.log(e)
        }
      },
      regSubmit () {
        this.defaultRule = true
        this.mobileRule =  this.mobileReg(this.mobile)        
        this.verifyCodeRule = (this.verifyCode.toString().trim()) ? true : false
        this.userNameRule = (this.userName.toString().trim()) ? true : false
        this.pwdRule = (this.pwd.toString().trim()) ? true : false
        this.repeatPwdRule = (this.repeatPwd.toString().trim() && (this.repeatPwd == this.pwd)) ? true : false
        this.dptIdRule = (this.dptId.toString().trim()) ? true : false
        if (!this.mobileRule) {
          this.msgShow('请输入正确手机号码')
          return
        }
        if (!this.verifyCodeRule) {
          this.msgShow('请输入验证码')
          return
        }
        if (!this.userNameRule) {
          this.msgShow('请输入用户名')
          return
        }
        if (this.pwd.toString().trim().length < 6) {
          this.pwdRule = false          
          this.msgShow('密码不能少于6位')
          return
        }
        if (this.repeatPwd !== this.pwd) {
          this.msgShow('两次密码不一致')
          this.pwdRule = false
          this.repeatPwdRule = false
          return
        }
        if (this.mobileRule && this.verifyCodeRule && this.userNameRule && this.pwdRule && this.repeatPwdRule && this.dptIdRule) {
          let params = {
            mobile: this.mobile,
            verifyCode: this.verifyCode,
            userName: this.userName,
            pwd: sha1(this.pwd),
            repeatPwd: sha1(this.repeatPwd),
            dptId: this.dptId
          }
          this.acctCreate(params)
        }
      },
      onValueChange (val) {
        this.dptId = val
      }
    }
  }
</script>

<style lang="stylus">
  .login-container
    backgroundColor #fff
    marginTop 10
</style>