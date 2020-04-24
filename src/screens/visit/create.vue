<template lang="pug">
nb-container
  app-header(:headTitle="screenTitle", :hasLeft="true", :backFunc="back")
    touchable-opacity(:on-press="submit", slot="rightBtns")
      text(:style="styl.colorWhite") 确认
  nb-content( :style="styl.bgColorF2")
    view
      view.list-item.border-top(:style="[styl.row, { marginTop:10}]")
        text(:style="[styl.ft13, styl.color33]") 被拜访的客户
          text(:style="styl.colorRed") *
        view(:style="styl.col", v-if="navigation.state.params.from == 'cstmDetail'")
          text.textR(:numberOfLines="1", :style="[styl.ft13, styl.color99]") {{visiData.cstmName}}
        view(:style="styl.col", v-else)
          touchable-opacity(:on-press="jumpFixScreen.bind(this, 'cstmChoose')")
            text.textR(:numberOfLines="1", :style="[styl.ft13, styl.color99]") {{(visiData.cstmName === '') ? '请选择拜访客户' : visiData.cstmName}}
              iconfont(name="arrowright", :size="15")
      view.list-item.border-top(:style="[styl.row, { marginTop:10}]")
        text(:style="[styl.ft13, styl.color33]") 业务部门
        text.textR(:style="[styl.col, styl.ft13, styl.ftWeight,styl.color99]") {{currentUser.fkDpt.name}}
      view.list-item(:style="styl.row")
        text(:style="[styl.ft13, styl.color33]") 业务员
        text.textR(:style="[styl.col, styl.ft13, styl.ftWeight, styl.color99]") {{currentUser.name}}
      view.list-item.border-top(:style="[styl.row, { marginTop:10}]")
        text(:style="[styl.col, styl.ft13, styl.color33]") 计划拜访时间
        touchable-opacity(:style="[styl.col]", :onPress="planVisitTimePicker")
          text.textR {{visiData.planVisitTime}}
      //- view.list-item(:style="[styl.row]")
      //-   text(:style="[styl.col, styl.ft13, styl.color33]") 计划开单日期
      //-   touchable-opacity(:style="[styl.col]", :onPress="planDatePicker")
      //-     text.textR {{visiData.planDate}}
      //- view.list-item
      //-   touchable-opacity(:style="[styl.col]", :onPress="xx")
      //-     text.textR 原生组件ios
</template>

<script>
import { NativeModules } from 'react-native'
import { mapState } from 'vuex'
const RNDatePicker = NativeModules.RNDatePicker
  export default {
    props: {
      navigation: {
        type: Object
      }
    },
    components: {
      // datePicker: DatePicker
    },
    computed: {
      ...mapState({
        currentUser: state => state.currentUser
      })
    },
    data () {
      return {
        visiData: {
          cstmName: ''
        },
        customStyles: {
          dateIcon: {
            width: 20,
            height: 20
          },
          dateInput: {
            borderWidth: 0,
            marginLeft: 55
          }
        }
        // alertShow: false
      }
    },
    mounted() {
      let date = new Date()
      console.log('---------' + this.navigation.state.params.from)
      this.visiData = {
        uid: this.currentUser.id,
        planVisitTime: this.datetime2Str(date)
        // planDate: this.date2Str(new Date(date.getTime() + 86400000 * 7))
      }
      // this.visiData.cstmName= ''
      let navigateParams = this.navigation.state.params
      if (navigateParams.from) {
        this.visiData.cstmName = navigateParams.compName
        this.visiData.cstmId = navigateParams.id
      } else {
        this.visiData.cstmName= ''
      }
    },
    beforeDestroy () {
      this.hidePicker()
    },
    methods: {
      xx () {
        console.log(RNDatePicker.sysVersion)
        console.log(typeof RNDatePicker.sysVersion)
        RNDatePicker.show('1233', resp => {
          console.log(resp)
        })
      },
      planVisitTimePicker () {
        let initDateArr = this.visiData.planVisitTime.replace(/\/| |:/g, ',').split(',')
        console.log('--initDateArr--')
        console.log(initDateArr)
        this.showPicker({pickerType: 'datetime', title: '选择计划拜访时间', selectData: initDateArr}).then((val) => {
          console.log('---planVisitTimePicker---')
          console.log(val)
          this.visiData.planVisitTime = val[0] + '/' + val[1] + '/' + val[2] + ' ' + val[3] + ':' + val[4] + ':' + '00'
          console.log(this.visiData.planVisitTime)
          this.$forceUpdate()
        }, () => {
          console.log('cancel')
        })
      },
      // planDatePicker () {
      //   let initDateArr = this.visiData.planDate.replace(/\/| |:/g, ',').split(',')
      //   console.log('--initDateArr1--')
      //   console.log(initDateArr)
      //   this.showPicker({pickerType: 'date', title: '选择计划开单日期', selectData: initDateArr}).then((val) => {
      //     console.log('---planDatePicker---')
      //     console.log(val)
      //     this.visiData.planDate = val[0] + '/' + val[1] + '/' + val[2]
      //     this.$forceUpdate()
      //   }, () => {
      //     console.log('cancel')
      //   })
      // },
      submit: function () {
        if (this.visiData.cstmName.trim() == '') {
          this.msgShow('请选择拜访客户')
          return
        }
        if(new Date(this.visiData.planVisitTime).getTime() < new Date().getTime()){
          this.msgShow('拜访时间不能小于当前时间')
          return
        }
        console.log(this.visiData)
        let params = {
          cstmId: this.visiData.cstmId,
          uid: this.currentUser.id,
          // planDate: this.date2Str(new Date(this.visiData.planDate)).replace(/\//g, '-'),
          planVisitTime: this.datetime2Str(new Date(this.visiData.planVisitTime)).replace(/\//g, '-'),
          callType: (this.platformOS === 'ios') ? 'ios' : 'and'
        }
        console.log(params)
        this.callCreateCreate(params)
      },
      async callCreateCreate (params) {
        try {
          let url = this.currentUser.serverUrl + this.webApi.crmCreateCallAPI
          let data = await this.reqPost(url, params, 'post')
          if (data.returnCode == 0) {
            // this.alertShow = true
            this.msgShow('新增成功', 'success')
            // this.navigate('visitList')
            // this.navigation.state.params.callBack('success')
            this.back('success')
          } else {
            // console.log(data)
            // alert(data.errMsg)
            this.msgShow(data.errMsg)
          }
        } catch (e) {
          console.warn(e)
          alert(e)
        }
      },
      jumpFixScreen: function (pageName) {
        let me = this
        this.navigate(pageName, {callBack: function (obj) {
          console.log('--------')
          me.visiData.cstmName = obj.compName
          me.visiData.cstmId = obj.cstmId
          me.$forceUpdate()
        }})
      },
      // setPlanDate: function (val) {
      //   this.visiData.planDate = val
      // },
      setPlanVisitTime: function (val) {
        this.visiData.planVisitTime = val
      }
      // alertCb (type) {
      //   this.alertShow = false
      //   this.navigate('visitList')
      // }
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
  .textR {
    textAlign: right
  }
</style>