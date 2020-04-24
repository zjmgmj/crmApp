<template lang="pug">
nb-container
  app-header(:headTitle="screenTitle", :hasLeft="true", :backFunc="back")
    touchable-opacity(:on-press="submit", slot="rightBtns")
      text(:style="styl.colorWhite") 确认
  nb-content(:style="styl.bgColorF2")
    view
      view.list-item.border-top(:style="[styl.row, {marginTop:10}]")
        text(:style="[styl.ft13, styl.color33, {flex: 0.3}]") 商机名称
          text(:style="styl.colorRed") *
        nb-input(v-model="busiOptsData.opptyName", :style="[styl.textR, styl.ft13, styl.color99]", placeholder="请输入商机名称")
      view.list-item.border-top(:style="[styl.row, {marginTop:10}]")
        text(:style="[styl.ft13, styl.color33]") 提交人
        text(:style="[styl.col, styl.textR, styl.ft13, styl.ftWeight, styl.color99]") {{currentUser.name}}
      view.list-item(:style="[styl.row, {paddingLeft: 10, paddingRight: 10}]")
        text(:style="[styl.ft13, styl.color33]") 归属部门
        text(:style="[styl.col, styl.textR, styl.ft13, styl.ftWeight, styl.color99]") {{currentUser.fkDpt.name}}
      view.list-item.border-top(:style="[styl.row, {marginTop:10}]")
        text(:style="[styl.ft13, styl.color33]") 关联客户
        touchable-opacity(:on-press="jumpFixScreen.bind(this, 'cstmChoose')", :style="styl.col")
          text(:numberOfLines="1", :style="[styl.ft13, styl.textR, styl.color99]") {{(busiOptsData.compName === '') ? '请选择关联客户' : busiOptsData.compName}}
            iconfont(name="arrowright", :size="15")
      view.list-item(:style="[styl.row, {paddingLeft: 10, paddingRight: 10}]")
        text(:style="[styl.ft13, styl.color33]") 联系人
        nb-input(v-model="busiOptsData.linkerName", :style="[styl.textR, styl.ft13, styl.color99]", placeholder="请输入联系人")
      view.list-item(:style="[styl.row, {paddingLeft: 10, paddingRight: 10}]")
        text(:style="[styl.ft13, styl.color33]") 联系方式
        nb-input(v-model="busiOptsData.linkerPhone", :style="[styl.textR, styl.ft13, styl.color99]", placeholder="请输入联系方式")
      view.list-item(:style="[styl.row]")
        text(:style="[styl.ft13, styl.color33]") 商机地址
        nb-input(v-model="busiOptsData.compAddr", :style="[styl.textR, styl.ft13, styl.color99]", placeholder="请输入商机地址")
      nb-textarea.border-top(v-model="busiOptsData.remark", :style="[styl.ft13, styl.color99,styl.bgWhite, {marginTop:10}]", :rowSpan="5", :bordered="true", placeholder="商机描述")
</template>
<script>
import { mapState } from 'vuex'
  export default {
    props: {
      navigation: {
        type: Object
      }
    },
    data () {
      return {
        busiOptsData: {
          opptyName: '',
          linkerName: '',
          linkerPhone: '',
          compAddr: '',
          remark: '',
          compName: ''
        }
      }
    },
    computed: {
      ...mapState({
        currentUser: state => state.currentUser
      })
    },
    methods: {
      onPressButton: function () {},
      async busiOpptyCreate (params) {
        try {
          let url = this.currentUser.serverUrl + this.webApi.crmCreateBusiOptAPI
          let data = await this.reqPost(url, params, 'post')
          if (data.returnCode == 0) {
            this.msgShow('新增成功', 'success')
            this.back('success')
          }
        } catch (e) {
          console.warn(e)
          alert(e)
        }
      },
      submit: function () {
        console.log(this.busiOptsData.opptyName)
        let reg = /^\s*$/
        if (reg.test(this.busiOptsData.opptyName)) {
          this.msgShow('请输入商机名称！')
          return
        }
        if (reg.test(this.busiOptsData.remark)) {
          this.msgShow('请输入商机描述！')
          return
        }
        let params = {
          opptyName: this.busiOptsData.opptyName,
          cstmCode: this.busiOptsData.cstmId,
          cstmName: this.busiOptsData.compName,
          linkerName: this.busiOptsData.linkerName,
          linkerPhone: this.busiOptsData.linkerPhone,
          uid: this.currentUser.id,
          opptyAddr: this.busiOptsData.compAddr,
          remark: this.busiOptsData.remark
        }
        for (let key in params) {
          if (!params[key]) {
            delete params[key]
          }
        }
        this.busiOpptyCreate(params)
      },
      jumpFixScreen: function (pageName) {
        let me = this
        this.busiOptsData.callBack = function (obj) {
          console.log('busiOpts--obj--')
          console.log(obj)
          me.busiOptsData = Object.assign(me.busiOptsData, obj)
          console.log(me.busiOptsData.linkerPhone)
          console.log(me.busiOptsData.linkerName)
          me.$forceUpdate()
        }
        this.navigate(pageName, this.busiOptsData)
      }
    }
  }
</script>
<style lang="stylus">
  .list-item{
    height: 50;
    borderBottomWidth: 0.5;
    borderColor: #ddd;
    backgroundColor:#fff;
    paddingLeft: 10;
    paddingRight: 10
  }
  .border-top{
    borderTopWidth: 0.5;
    borderColor: #ddd;
  }
</style>

