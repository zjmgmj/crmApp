<template lang="pug">
nb-container
  app-header(:headTitle="screenTitle", :hasLeft="true", :backFunc="back")
    touchable-opacity(slot="rightBtns", :onPress="updatePwdBtn")
      nb-text(:style="{color: stylVal.whiteColor}") 确定
  view(:style="[styl.bgColorF2, {flex: 1}]")
    nb-form(:style="styl.bgWhite")
      nb-item(:fixedLabel="true", v-for="(itm,idx) in pwdCompts")
        nb-label(:style="[styl.ft14, styl.color33]") {{itm.label}}
        nb-input(:autoFocus="itm.autoFocus",:style="styl.ft14", v-model="itm[keys[idx]]", :placeholder="itm.placeholder", :secureTextEntry="true", textAlign="right")
      //- nb-item(:fixedLabel="true")
      //-   nb-label(:style="styl.ft14") 输入用户名
      //-   nb-input(v-model="name")
      //- nb-item(:fixedLabel="true")
      //-   nb-label(:style="styl.ft14") 输入密码
      //-   nb-input(returnKeyType="done", :secureTextEntry="true")
      //- nb-item
      //-   nb-textarea(:rowSpan="6", :bordered="true", placeholder="写点什么", v-model="remark", :onChangeText="changeTxt")
</template>

<script>
  import sha1 from 'sha1'
  import { mapState, mapActions } from 'vuex'
  export default {
    props: {
      navigation: {
        type: Object
      }
    },
    data () {
      return {
        keys: ['oldPwd', 'newPwd', 'confirmPwd'],
        pwdCompts: [{
          label: '旧密码',
          oldPwd: '',
          autoFocus: true,
          placeholder: '请输入旧密码'
        }, {
          label: '新密码',
          newPwd: '',
          placeholder: '请输入新密码'
        }, {
          label: '确认密码',
          confirmPwd: '',
          placeholder: '请输入确认密码'
        }]
      }
    },
    computed: {
      ...mapState({
        serverUrl: state => state.serverUrl,
        currentUser: state => state.currentUser
      })
    },
    methods: {
      ...mapActions([
        'exitUser'
      ]),
      async updatePwdBtn () {
        console.log('up up up 抬起头')
        console.log(this.pwdCompts[0].oldPwd)
        if (this.validateNull()) {
          if (this.pwdCompts[1].newPwd.trim().length < 6 || this.pwdCompts[1].newPwd.trim().length > 12) {
            this.msgShow('请设置6-12位密码')
            return
          }
          if(this.pwdCompts[1].newPwd !== this.pwdCompts[2].confirmPwd) {
            this.msgShow('两次密码输入不一致')
            return
          }
          let newPwdEncypt = sha1(this.pwdCompts[1].newPwd.trim())
          let oldPwdEncypt = sha1(this.pwdCompts[0].oldPwd.trim())
          try {
            this.pageShow()
            let data = await this.reqPost(this.serverUrl + this.webApi.crmUpdatePwdAPI, {newPwd: newPwdEncypt, uid: this.currentUser.id, oldPwd: oldPwdEncypt}, 'post')
            if (data.returnCode === 0) {
              this.pageHide()
              this.alert({content: '密码更新成功，需要重新登录'}).then(() => {
                this.exitUser()
                this.navigation.replace('login')
              })
            } else {
              this.pageHide()
              this.msgShow(data.errMsg || '网络异常')
            }
          } catch (e) {
            console.warn(e)
            this.pageHide()
          }
        }
      },
      validateNull () {
        let result = true
        for (let i in this.keys) {
          console.log(i)
          if ((!this.pwdCompts[i][this.keys[i]]) || (this.pwdCompts[i][this.keys[i]].toString().trim().length === 0)) {
            this.msgShow(this.pwdCompts[i].label + '不能为空')
            result = false
            break
          }
        }
        return result
      }
    }
  }
</script>