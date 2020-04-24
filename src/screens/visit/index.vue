<template lang="pug">
nb-container
  app-header(:headTitle="screenTitle", :hasLeft="true", :backFunc="back")
    touchable-opacity(:on-press="clickIcon.bind(this,'visitCreate')", slot="rightBtns")
      iconfont(name="add", :size="20", color="#fff")
  view(:hasTab="true", :style="{height: 40}")
    app-tab(:tabs="tabsVal", :onChange="tabHandler")
  //- flat-list(:data="dataList", :style="styl.bgColorF2", :onEndReachedThreshold="0.1", :onEndReached="_onEndReached", :refreshing="refreshing", :onRefresh="_onRefresh", :keyExtractor="keyItems")
  flat-list(:data="dataList", :style="styl.bgColorF2", :onEndReachedThreshold="0.5", :onEndReached="_onEndReached.bind(this, queryObject.currentPage)", :refreshing="refreshing", :onRefresh="_onRefresh", :keyExtractor="keyItems", :automaticallyAdjustContentInsets="false", :pageSize="10")
    view(render-prop-fn="renderItem")
      view(:style="[styl.bgWhite, styl.pad10, styl.mt10]")
        //- touchable-opacity(:onPress="jumpFixScreen.bind(this, 'cstmDetail')")
        view(:style="styl.row")
          nb-text(:numberOfLines="1", :style="[styl.col,  styl.ft15]") {{args.item.customer.compName}}
          //- view(v-if="queryObject.type !== 0")
          //-   TouchableOpacity(:onPress="punchHandler.bind(this, args.item)", :activeOpacity="0.5")
          //-     text(:style="[{flex: 0.3}, styl.ft12, styl.colorBlue, styl.textR]")
          //-       iconfont(name="dingwei1", color="#4ebdff", :size="20")
          view(v-if="queryObject.type == 0")
            text(:style="[styl.colorRed,styl.ft13]", v-if="args.item.status == 1") 成功
            text(:style="styl.ft13", v-else) 失败
        view(:style="styl.rowStart, styl.mt10", v-if="args.item.customer.compAddr")
          iconfont(name="dingwei", :size="15")
          text(:numberOfLines="1", :style="[styl.pl5, styl.pr10, styl.color66,  styl.ft13]") {{args.item.customer.compAddr}}
        view(:style="styl.rowStart, styl.mt10", v-if="args.item.locateAddr")
          iconfont(name="dingwei1", :size="15")
          text(:numberOfLines="1", :style="[styl.pl5, styl.pr10, styl.color66,  styl.ft13]") (打卡点) {{args.item.locateAddr}}
        view(:style="styl.row")
          view(:style=" styl.col")
            view(:style="styl.rowStart, styl.mt10")
              iconfont(name="user1", :size="15")
              text(:style="[styl.pl5, styl.color66,  styl.ft13]") {{args.item.link.name}}
            view(:style="[styl.col, styl.mt10]")
              touchable-opacity(:on-press="linkPhoneHandler.bind(this, args.item.link.phone)")
                view(:style="styl.rowStart")
                  iconfont(name="phone", :size="15")
                  text(:style="[styl.pl5, styl.colorBlue,  styl.ft13]") {{args.item.link.phone}}
          //- iconfont(name="idcard1e", :style="styl.pl10", :size="15")
          //- text(:style="styl.pl5") {{args.item.position}}
          view(:style="[styl.rowEnd, {flex: 0.3}]", v-if="args.item.status == 1 || args.item.status == 2")
            TouchableOpacity(:onPress="linkHandler.bind(this, {num: args.item.link.phone, type: 'tel'})", :activeOpacity="0.5", :style="[styl.bgPrimary,styl.cardListIconBorder, styl.pad8]")
              iconfont(name="dianhua", :size="15", color="#fff", :style="[styl.textR]")
            TouchableOpacity(:onPress="linkHandler.bind(this, {num: args.item.link.phone, type: 'smsto'})", :activeOpacity="0.5", :style="[styl.bgGreen,styl.cardListIconBorder, styl.pad8, styl.ml10]")
              iconfont(name="huifu", :size="15", color="#fff", :style="[styl.textR]")
          view(:style="[{alignItems: 'center'}]", v-else)
            nb-button(:style="[styl.bgPrimary, qdBtn]", :onPress="punchHandler.bind(this, args.item)")
              text(:style="[styl.colorWhite, styl.ft12, styl.textC]") 签 到
        view(:style="[styl.mt10]", v-if="args.item.remark")
            text(:style="[styl.ft12, styl.color66, {lineHeight: 23}]") 备注： {{args.item.remark}}
        view(:style="[styl.borderT1, styl.mt10, styl.pt10]")
          view(:style="styl.row")
            text(:style="[styl.ft12, styl.color66]") {{args.item.creator.fkDpt.name}} {{args.item.creator.name}}
            text(:style="[styl.col, styl.textR, styl.ft12, styl.color66]" v-if="args.item.status == 1") 拜访日期： {{args.item.updateAt}}
            text(:style="[styl.col, styl.textR, styl.ft12, styl.color66]" v-else) 拜访日期： {{args.item.planVisitTime}}

    view(render-prop="ListFooterComponent", :style="{paddingVertical: 20}")
      text(:style="styl.textC, styl.ft12, styl.color333", v-if="dataList.length > 0") {{endReachedMsg}}
      no-data(v-if="nodataShow", btnText="新建拜访计划", btnUrl="visitCreate", :btnHandler="noDataBtn", msg="您还没有拜访计划")
</template>

<script>
import { Linking } from "react-native"
import { ActionSheet } from 'native-base'
import appTab from '../../components/vue/appTab/index'
import { mapState } from 'vuex'
  export default {
    props: {
      navigation: {
        type: Object
      }
    },
    components: {
      appTab
    },
    computed: {
      ...mapState({
        currentUser: state => state.currentUser
      })
    },
    data () {
      return {
        btnOptions: [
          { text: "打电话", icon: "call", iconColor: "#4ebdff", type:"tel" },
          { text: "发消息", icon: "chatboxes", iconColor: "green", type:"smsto" }
        ],
        optionCancelIndex: 2,
        optionDestructiveIndex: 1,
        clicked: 0,
        phoneNum: 0,
        qdBtn:{ borderRadius: 30, height: 30, paddingLeft: 15, paddingRight: 15},
        routeListener: null,
        tabsVal: [{name: '今日待拜访'}, {name: '拜访中'}, {name: '拜访历史'}],
        iconfontColor: '#333',
        iconfontBlueColor: '#4ebdff',
        dataList: [],
        refreshing: false,
        styl: {
          headSearch: {
            borderStyle: 'solid',
            borderRightColor: '#ccc',
            borderRightWidth: 0.5
          },
          cardListIconBorder: {
            borderRadius: 100
          }
        },
        queryObject: {
          currentPage:0,
          pageSize: 10,
          type: 2,
          uid: ''
        },
        keyItems: (item, index) => index.toString(),
        endReachedMsg: '加载中...',
        isEndReached: false,
        nodataShow: false,
        pageTimeout: null
      }
    },
    beforeMount () {
      this.routeListener = this.navigation.addListener('willFocus', (prepload) => {
        this.queryObject.currentPage = 0
        this.dataList = []
        this.loadData()
      })
    },
    beforeDestroy () {
      if (this.routeListener) this.routeListener.remove()
    },
    methods: {
      async loadData () {
        try {
          // if (this.dataList.length == 0) this.refreshing = true
          if (this.dataList.length == 0) {
            this.pageShow()
            this.endReachedMsg = ''
          } else {
            this.endReachedMsg = '加载中...'
          }
          this.queryObject.uid = this.currentUser.id
          let data = await this.reqPost(this.currentUser.serverUrl + this.webApi.crmQueryCallAPI, this.queryObject, 'post')
          if (data.returnCode === 0) {
            console.log('------------visit')
            console.log(data)
            data.list.map(itm => {
              itm[0].planVisitTime = this.datetime2Str(new Date(itm[0].planVisitTime))
              itm[0].updateAt = this.datetime2Str(new Date(itm[0].updateAt))
              let compProv = (itm[0].customer.compProv)? itm[0].customer.compProv : ''
              let compCity = (itm[0].customer.compCity)? itm[0].customer.compCity : ''
              let compArea = (itm[0].customer.compArea)? itm[0].customer.compArea : ''
              let compAddr = (itm[0].customer.compAddr)? itm[0].customer.compAddr : ''
              itm[0].customer.compAddr = compProv + compCity + compArea + compAddr
              itm[0].link = itm[1]
              this.dataList.push(itm[0])
            })
            console.log(this.dataList)
            // this.queryObject.currentPage = this.queryObject.currentPage + 1
            this.refreshing = false
            this.pageHide()
            this.isEndReached = (data.list.length < this.queryObject.pageSize ) ? true : false
            this.endReachedMsg = (data.list.length == 0) ? '已到底，没有更多' : '加载完成'
            this.nodataShow = (this.dataList.length === 0) ? true : false
          } else {
            this.msgShow(this, data.errMsg)
          }
        } catch (e) {
          console.warn(e)
          alert(e)
        }
      },
      clearTime () {
        if (this.pageTimeout) clearTimeout(this.pageTimeout)
      },
      _onEndReached: function (pageNum) {
        console.log('pageNum:>>' + pageNum)
        const me = this
        me.clearTime()
        me.pageTimeout = setTimeout(function() {
          me.queryObject.currentPage = me.queryObject.currentPage + 1
          if (me.isEndReached) {
            me.endReachedMsg = '已到底，没有更多'
          } else if (pageNum !== me.queryObject.currentPage) {
              console.log('加载数据:>>>>' + me.queryObject.currentPage)
              me.loadData()
          }
        }, 200)
      },
      // _onEndReached: function () {
      //   if (this.isEndReached) {
      //     this.endReachedMsg = '已到底，没有更多'
      //   } else {
      //     this.loadData()
      //   }
      // },
      _onRefresh: function () {
        this.queryObject.currentPage = 0
        this.dataList = []
        this.loadData()
      },
      linkHandler: function (obj) {
        obj.type === 'tel' ? this.phoneCall(obj.num) : this.sms(obj.num)
      },
      jumpFixScreen: function (pageName) {
        console.log('--------')
        this.navigate(pageName)
      },
      clickIcon: function (pageName) {
        this.navigate(pageName)
      },
      tabHandler: function (type) {
        this.dataList = []
        this.queryObject.type = (type == '今日待拜访') ? 2 : (type == '拜访中') ? 1 : 0
        this.queryObject.currentPage = 0
        this.loadData()
      },
      punchHandler: function (item) {
        console.log(item)
        let cstmCall = Object.assign({}, item)
        cstmCall.isFromVisitList = true
        this.navigate('visitCheck', cstmCall)
      },
      noDataBtn: function () {
        this.navigate('visitCreate')
      },
      linkPhoneHandler: function (num) {
        this.phoneNum = num
        ActionSheet.show({
          options: this.btnOptions,
          cancelButtonIndex: this.optionCancelIndex,
          destructiveButtonIndex: this.optionDestructiveIndex
          // title: "Select An Option"
        },
        buttonIndex => {
          this.clicked = this.btnOptions[buttonIndex]
          if (this.clicked) {
            let url = this.clicked.type + ':' + this.phoneNum
            Linking.canOpenURL(url).then(supported => {
             if (!supported) {
                 console.log('Can\'t handle url: ' + url);
             } else {
                 return Linking.openURL(url);
             }
           }).catch(err => console.warn('An error occurred', err))
          }
        }
      )}
    }
  }
</script>