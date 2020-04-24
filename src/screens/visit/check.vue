<template lang="pug">
nb-container
  app-header(:headTitle="screenTitle", :hasLeft="true", :backFunc="back")
    touchable-opacity(:on-press="submit", slot="rightBtns")
      text(:style="styl.colorWhite") 签到
  nb-content(:style="styl.bgColorF2")
    view(:style="[styl.row,styl.pad10]")
      text(:style="[styl.col, styl.ft14, styl.color33]") 当前时间
      text(:style="styl.textR,styl.ft12, styl.color99") {{currentTime}}
    view(:style="[styl.bgWhite, styl.pad10]")
      view(:style="[styl.row]")
        text(:style="[{flexBasis: 80}, styl.ft14, styl.color33]") 关联客户
        touchable-opacity(:on-press="jumpFixScreen.bind(this, 'cstmChoose')", :style="styl.col")
          text(:style="[styl.ft13, styl.textR, styl.color99]") {{signIn.cstmName}}
            iconfont(name="arrowright", :size="16")
    view(:style="[styl.bgWhite,{marginTop:1}]")
      nb-textarea(v-model="signIn.remark", :style="[styl.ft13, styl.color66]", :rowSpan="3", placeholder="请输入访问备注")
    //- view(:style="[styl.mt10, styl.pad10, styl.bgWhite]")
      text(:style="[styl.ft14, styl.color33]") 请选择当前位置
    map-view(:style="[mapObj.frame, styl.mt10]", :zoom="mapObj.zoom", :center="centerCoordinate", :marker="currentMarker", v-if="mapShow")
    view(:style="[styl.bgWhite]")
      view(:style="[styl.row, styl.pad10]")
        text(:style="[styl.mr10,styl.ft14, styl.color33]") 当前位置
        iconfont(name="dizhi", :size="18", :color="stylVal.redColor")
        touchable-opacity(:onPress="resetLocation", :style="{position: 'absolute', right: 0, top: 15}")
          text(:style="[styl.mr10,styl.ft14, styl.color33, styl.textR]") 重新定位
      view(:style="[styl.row, styl.pad10, styl.pt0]")
        view(:style="[styl.col]")
          text(:style="styl.color66") {{locationObj.address}}
        //- view(:style="{flexBasis: 66, alignItems: 'center'}")
          nb-button(:transparent="true", :info="true", :small="true")
            nb-text 导航
</template>

<script>
  import { MapView, MapTypes, Geolocation } from 'react-native-baidu-map'
  import { PermissionsAndroid } from 'react-native'
  import { mapState } from 'vuex'
  export default {
    props: {
      navigation: {
        type: Object
      }
    },
    computed: {
      ...mapState({
        serverUrl: state => state.serverUrl
      }),
      currentTime () {
        return this.datetime2Str(new Date())
      }
    },
    data () {
      return {
        signIn: {
          cstmName: '请选择签到客户',
          remark: '',
          id: 0
        },
        locationObj: {},
        currentMarker: {
          latitude: 31.240398467684564,
          longitude: 121.5691848156983,
          title: '你好测试'
        },
        centerCoordinate: {
          latitude: 31.240398467684564,
          longitude: 121.5691848156983
        },
        mapShow: false,
        mapObj: {
          frame: {
            width: 375,
            height: 200
          },
          zoom: 18
        }
      }
    },
    components: {
      mapView: MapView
    },
    beforeMount () {
      if (this.navigation.state.params && this.navigation.state.params.isFromVisitList) {
        this.signIn.cstmName = this.navigation.state.params.customer.compName
        this.signIn.id = this.navigation.state.params.id
      }
      this.mapObj.frame.width = this.screenWidth
      this.mapObj.frame.height = (this.screenWidth * 200) / 375
    },
    mounted () {
      this.resetLocation()
    },
    methods: {
      resetLocation () {
        const me = this
        me.mapShow = false
        if (this.platformOS === 'android') {
          console.log('android sys')
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION).then(res => {
            console.log(res)
            if (res === 'granted') {
              me.currentGeo()
            }
          }, err => {
            // alert(err)
            console.warn(err)
          })
        } else {
          me.currentGeo()
        }
      },
      currentGeo () {
        const me = this
        Geolocation.getCurrentPosition().then(data => {
          console.log(data)
          if (data.latitude && data.longitude) {
            var temp = {
              latitude: data.latitude,
              longitude: data.longitude
            }
            me.centerCoordinate = Object.assign({}, temp)
            temp.title = data.address || ''
            me.currentMarker = Object.assign({}, temp)
          }
          me.locationObj = Object.assign({}, data)
          me.mapShow = true
        }).catch(err => {
            console.warn(err)
            me.alert({content: '请在系统设置里面允许定位，否则不能完成打卡签到'})
        })
      },
      jumpFixScreen: function (pageName) {
        if (this.navigation.state.params && (!this.navigation.state.params.isFromVisitList)) {
          const me = this
          this.navigate('chooseVisitCstm', {callBack: (resp) => {
            console.log(resp)
            me.signIn.cstmName = resp.customer.compName
            me.signIn.id = resp.id
            // me.$forceUpdate()
          }})
        } else {
          console.log('不跳转页面')
        }
      },
      submit: function () {
        if (!this.mapShow) {
          this.alert({content: '请在系统设置里面允许定位，否则不能完成打卡签到'})
          return
        }
        if (this.signIn.cstmName.toString().trim().length === 0 || this.signIn.cstmName.toString().trim() === '请选择签到客户') {
          this.msgShow('请选择签到客户')
          return
        }
        this.remoteCheck()
      },
      async remoteCheck () {
        try {
          this.pageShow()
          let params = {
                id: this.signIn.id,
                longitude: this.locationObj.longitude,
                latitude: this.locationObj.latitude,
                remark: this.signIn.remark,
                locateAddr: this.locationObj.address || ''
              }
          let data = await this.reqPost(this.serverUrl + this.webApi.crmCallCheckAPI, params, 'post')
          if (data.returnCode === 0) {
            this.pageHide()
            this.msgShow('签到成功', 'success', 'top')
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
      }
    }
  }
</script>