<template lang="pug">
nb-container(:style="styl.bgColorF2")
  app-header(headTitle="消息")
  //- nb-content
  flat-list(:data="msgList", :style="styl.bgColorF2", :onEndReachedThreshold="0.1", :refreshing="refreshing", :onRefresh="_onRefresh", :keyExtractor="keyItems")
    view(render-prop-fn="renderItem", :style="[{backgroundColor: '#fff', borderBottomWidth:1, borderStyle: 'solid', borderBottomColor:'#eee'}, styl.pad10]")
      //- view.item(v-for="(item, index) in msgList")
      touchable-opacity(:on-press="jumpFixScreen.bind(this, args.item)")
        view(:style="styl.row")
          view(:style="styl.pr10")
            image(:source="xiaoxiIcon", :style="{width: 40, height: 40}")
          view(:style="{flex:3}")
            text(:style="[styl.color33, styl.ft15]") 系统消息
              iconfont(name="dian", :style="[styl.colorRed, styl.ml5]", v-if="args.item.status == 0")
            text(:style="styl.ft12, styl.color99, styl.mt5") {{args.item.msgInfo}}
          view(:style="{flex:1.3}")
            text(:style="[styl.ft12, styl.textR, styl.color99]") {{args.item.createAtStr}}
    view(render-prop="ListFooterComponent")
      view(:style="{paddingTop: 50}", v-if="nodataShow")
        no-data
</template>

<script>
  import xiaoxiImg from '../../assets/img/xiaoxi.png'
  import { mapState, mapActions } from 'vuex'
  import * as fileUtil from '../utils/fileUtil'
  import SplashScreen from 'react-native-splash-screen'
  export default {
    props: {
      navigation: {
        type: Object
      }
    },
    data () {
      return {
        routeListener: null,
        xiaoxiIcon: xiaoxiImg,
        refreshing: false,
        keyItems: (item, index) => index.toString(),
        msgList: [],
        nodataShow: true
      }
    },
    beforeMount () {
      let me = this
      this.$nextTick(() => {
        if (!this.isLogin) {
          fileUtil.getAsyncStorage('currentUser').then(resp => {
            if (resp && JSON.stringify(resp) !== '{}') {
              console.log('set user')
              me.setUser(resp)
            } else {
              me.exitUser()
            }
            me.userLogin()
          }).catch(err => {
            me.exitUser()
            me.userLogin()
          })
        } else {
          me.loadData()
        }       
        this.routeListener = this.navigation.addListener('willFocus', (prepload) => {
          if (me.isLogin) {
            me.loadData()
          }
        })
      })
    },
    destroyed () {
      if (this.routeListener) this.routeListener.remove()
    },
    computed: {
      ...mapState({
        currentUser: state => state.currentUser,
        isLogin: state => state.isLogin
      })
    },
    methods: {
      ...mapActions([
        'exitUser',
        'setUser'
      ]),
      userLogin () {
        if (!this.isLogin) {
          this.alert({content: '用户未登录，请先登录'}).then(() => {
            this.navigate('login')
          })
          return
        }
      },
      async loadData () {
        try {
          // this.refreshing = true
          this.pageShow()
          let data = await this.reqPost(this.currentUser.serverUrl + this.webApi.crmQueryMsgAPI + '/' + this.currentUser.id, {})
          if (data.returnCode === 0) {
            console.log('---msg----')
            console.log(data)
            let arr = []
            data.list.map(item => {
              let obj = item
              obj.createAtStr = this.date2Str(new Date(obj.createAt))
              arr.push(obj)
            })
            this.msgList = arr
            console.log('++++++++++++++msgList')
            console.log(this.msgList)
            this.$forceUpdate()
            this.nodataShow = (this.msgList.length === 0) ? true : false
          } else {
            console.warn(data)
            this.msgShow(data.errMsg)
          }
          this.pageHide()
        } catch (e) {
          console.warn(e)
          // alert(e)
        }
      },
      async msgUpdate (msgId) {
        try {
          let data = await this.reqPost(this.currentUser.serverUrl + this.webApi.crmReadMsgAPI + '/' + msgId, {})
          if (data.returnCode === 0) {
            console.log('-----11--')
            console.log(data)
            this.msgList.map(item => {
              if (item.id == msgId) item.status = 1
            })
            this.$forceUpdate()
          } else {
            console.warn(data)
            this.msgShow(data.errMsg)
          }
        } catch (e) {
          console.warn(e)
          // alert(e)
        }
      },
      _onRefresh: function () {
        this.loadData()
      },
      jumpFixScreen: function (item) {
        let itemTimeStr = item.createAtStr.replace(/\//g,'')
        let nowTimeStr = this.date2Str(new Date()).replace(/\//g,'')
        this.msgUpdate(item.id)
        if (Number(nowTimeStr) > Number(itemTimeStr)) {
          this.msgShow('信息超时')
          return
        }        
        this.navigate('visitList', item)
      }
    }
  }
</script>
<style type="stylus">
  .item {
    backgroundColor: #fff;
    padding: 15px 2px;
    borderBottomWidth:1;
    borderStyle:solid;
    borderBottomColor:#eee;
  }
  .item-left{
    flex:0.5
  }
  .item-center{
    flex:3
  }
  .item-right{
    flex:1.3;
  }
</style>