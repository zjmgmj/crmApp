<template lang="pug">
nb-container
  nb-header(:style="[{backgroundColor: '#fff'}, styl.borderB1]", iosBarStyle="light-content", androidStatusBarColor="#4ebdff")
    view(:style="{flexDirection: 'row', alignItems: 'center', display: 'flex', flex: 1}")
      view(:style="{flexBasis: 50}")
        slot(name="leftBtns")
          nb-button(:transparent="true", :onPress="headBack")
            iconfont(name="arrowleft", color="#666", :size="24")
      view(:style="{flex: 1, alignItems: 'center', display: 'flex'}")
        nb-text(:style="{fontSize: 18, color: '#666'}") 人员
      view(:style="{flexBasis: 50, alignItems: 'flex-end'}")
        slot(name="rightBtns")
          touchable-opacity(:on-press="drawPageHide.bind(this,'visitCreate')")
            text(:style="[styl.ft14, styl.colorBlue]") 确定
  nb-content(:style="styl.bgColorF2")
    touchable-opacity(:on-press="checkHandler.bind(this, 'checkMe')")
      view(:style="[styl.row, styl.bgWhite, {justifyContent: 'space-between'}, styl.mt5, styl.pad10]")
        text 仅看我的
        //- nb-radio(color='#4ebdff', selectedColor='#4ebdff', :selected="check.checkMe", :onPress="checkHandler.bind(this, 'checkMe')")
        iconfont(name="danxuan", color="#4ebdff", :size="20", v-if="check.checkMe")
        iconfont(name="danxuan1", color="#999", :size="20", v-else)
    view(:style="[styl.bgWhite, styl.mt5]")
      touchable-opacity(:on-press="checkHandler.bind(this, index)", v-for="(item, index) in check.checkTimeList")
        view(:style="[styl.borderB1, styl.row, styl.pad10]")        
          //- nb-radio(color='#666', selectedColor='#4ebdff', :selected="item.selected", :onPress="checkHandler.bind(this, index)")
          iconfont(name="danxuan", color="#4ebdff", :size="20", v-if="item.checked")
          iconfont(name="danxuan1", color="#999", :size="20", v-else)
          text(:style="[styl.pl10, styl.ft14, styl.color66]") {{item.lbl}}
</template>

<script>
  import { DeviceEventEmitter } from 'react-native'
  export default {
    props: {
      navigation: {
        type: Object
      },
      drawNav: {
        type: Object
      }
    },
    data () {
      return {
        routeListener: null,
        check: {
          checkMe: false,
          checkTimeList: [{
            lbl: '部门客户',
            checked: false
          }, {
            lbl: '机构客户',
            checked: false
          }, {
            lbl: '公司客户',
            checked: false
          }]
        },
        resObj: {
          dataLevel: ''
        }
      }
    },
    beforeMount () {
      this.$nextTick(() => {
        this.routeListener = DeviceEventEmitter.addListener('busiOptSendFilter', (resp) => {
          console.log(resp)
        })
      })
    },
    beforeDestroy () {
      console.log('filter destory')
      if (this.routeListener) this.routeListener.remove()
    },
    methods: {
      drawPageHide () {
        DeviceEventEmitter.emit('filterBackBusiOpt', this.resObj)
        this.navigation.navigate('DrawerClose')
      },
      headBack: function () {
        console.log('----back')
        this.navigation.navigate('DrawerClose')
      },
      checkHandler: function (idx) {
      	for(var i=0; i<3; i++){
          console.log(this.check['checkTimeList'][i].checked)
          this.check['checkTimeList'][i].checked = (idx == i) ? !this.check['checkTimeList'][i].checked : false
        }
        if (idx == 'checkMe') {
          console.log(this.check.checkMe)
          this.check.checkMe = !this.check.checkMe
          this.resObj.dataLevel = (this.check.checkMe) ? '0' : ''
          return
        }
        this.check.checkMe = false
        console.log(this.check['checkTimeList'][idx].checked)
        this.resObj.dataLevel = (this.check['checkTimeList'][idx].checked) ? (idx + 1).toString() : ''
      }
    }
  }
</script>