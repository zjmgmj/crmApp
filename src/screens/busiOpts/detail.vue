<template lang="pug">
nb-container
  app-header(:headTitle="screenTitle", :hasLeft="true", :backFunc="back")
  nb-content(:style="styl.bgColorF2")
    view
      view.list-item.border-top(:style="[styl.row, {marginTop:10}]")
        text(:style="[styl.ft13, styl.color33, {flex: 0.3}]") 商机名称
        text(:style="[styl.col, styl.textR, styl.ft13, styl.ftWeight, styl.color99]") {{busiOptsData.opptyName}}
      view.list-item.border-top(:style="[styl.row, {marginTop:10}]")
        text(:style="[styl.col, styl.ft13, styl.color33]") 提交人
        text(:style="[styl.col, styl.textR, styl.ft13, styl.ftWeight, styl.color99]") {{busiOptsData.creator.name}}
      view.list-item(:style="[styl.row, {paddingLeft: 10, paddingRight: 10}]")
        text(:style="[styl.col, styl.ft13, styl.color33]") 归属部门
        text(:style="[styl.col, styl.textR, styl.ft13, styl.ftWeight, styl.color99]") {{busiOptsData.creator.fkDpt.name}}
      view.list-item.border-top(:style="[styl.row, {marginTop:10}]")
        text(:style="[styl.col, styl.ft13, styl.color33]") 客户名称
        text(:style="[styl.col, styl.textR, styl.ft13, styl.ftWeight, styl.color99]") {{busiOptsData.cstmName}}
      view.list-item(:style="[styl.row, {paddingLeft: 10, paddingRight: 10}]")
        text(:style="[styl.col, styl.ft13, styl.color33]") 联系人
        text(:style="[styl.col, styl.textR, styl.ft13, styl.ftWeight, styl.color99]") {{busiOptsData.linkerName}}
      view.list-item(:style="[styl.row, {paddingLeft: 10, paddingRight: 10}]")
        text(:style="[styl.col, styl.ft13, styl.color33]") 联系方式
        text(:style="[styl.col, styl.textR, styl.ft13, styl.ftWeight, styl.color99]") {{busiOptsData.linkerPhone}}
      view.list-item(:style="[styl.row]")
        text(:style="[styl.col, styl.ft13, styl.color33]") 商机地址
        text(:style="[styl.col, styl.textR, styl.ft13, styl.ftWeight, styl.color99]") {{busiOptsData.opptyAddr}}
      view(:style="[styl.pl10,styl.pr10,styl.bgWhite]")
        text(:style="[styl.col, styl.ft13, styl.color33, styl.pt10]") 商机描述
        text(:style="[styl.ft13,styl.pt5,styl.pb5]") {{busiOptsData.remark}}
        //- text(:style="[styl.col, styl.ft13, styl.color33]") 商机描述
        //- text(:style="[styl.col, styl.textR, styl.ft13, styl.ftWeight, styl.color99]") {{busiOptsData.remark}}
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
        busiOptsData: {}
      }
    },
    computed: {
      ...mapState({
        currentUser: state => state.currentUser
      })
    },
    beforeMount () {
      this.busiOptsData = this.navigation.state.params
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

