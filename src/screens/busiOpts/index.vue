<template lang="pug">
nb-container
  app-header(:headTitle="screenTitle", :hasLeft="true", :backFunc="backToMeScreen")
    touchable-opacity(:on-press="clickIcon.bind(this,'busiOptCreate')", slot="rightBtns")
      iconfont(name="add", :size="20", color="#fff")
  view(:style="[styl.bgWhite, styl.row, styl.pad10, styl.borderB1, {height: 50}]", :hasTab="true")
    TouchableOpacity(:onPress="headBoxHandler.bind(this, 0)", :style="[styl.col, styl.headSearch]")
      text(:style="[styl.textC, styl.ft12, (headBoxArrow == 0) ? styl.colorBlue : styl.color66]") {{sortTitle}}
        //- iconfont(name="arrowdown1", :size="12", :color="(headBoxArrow == 0) ? iconfontBlueColor : iconfontColor")
        iconfont(name="arrowdown1", :size="12", :color="(headBoxArrow == 0) ? iconfontBlueColor : iconfontColor" v-if="queryObject.orderType == '0' || queryObject.orderType == '2'")
        iconfont(name="shangjiantou", :size="12", :color="(headBoxArrow == 0) ? iconfontBlueColor : iconfontColor" v-else)
        iconfont(name="arrowup", :size="12", :color="iconfontBlueColor", v-if="headBoxArrow == 0")
        iconfont(name="arrowdown", :size="12", :color="iconfontColor", v-else)
    TouchableOpacity(:onPress="headBoxHandler.bind(this, 1)", :style="[styl.col, styl.headSearch]")
      text(:style="[styl.textC, styl.ft13]")
        //- text(:style="styl.pr5") 筛选
        //- iconfont(name="arrowdown", :size="12", :color="iconfontColor")
        text(:style="[styl.pr5, (filterCstm) ? styl.colorBlue : styl.color66]") 筛选
        iconfont(name="arrowup", :size="12", :color="iconfontBlueColor", v-if="filterCstm")
        iconfont(name="arrowdown", :size="12", :color="iconfontColor", v-else)
    TouchableOpacity(:onPress="headBoxHandler.bind(this, 2)", :style="styl.col")
      text(:style="[styl.textC, styl.ft13]")
       iconfont(name="search", :size="12", :color="iconfontColor")
       text(:style="[styl.pl5,styl.color66]") 搜索
  view(:style="[{height: 45, backgroundColor: '#FFF'}, styl.borderB1, styl.rowStart]", v-if="searchShow")
    iconfont(name="search",:style="[styl.ml10,styl.mr10]")
    nb-input(v-model="searchKey", placeholder="请输入关键词查询", :onChangeText="searchChanege" ,:style="[styl.ft14]")
  flat-list(:data="dataList", :style="styl.bgColorF2", :onEndReachedThreshold="0.5", :onEndReached="_onEndReached.bind(this, queryObject.currentPage)", :refreshing="refreshing", :onRefresh="_onRefresh", :keyExtractor="keyItems", :automaticallyAdjustContentInsets="false", :pageSize="10")
    //- view(render-prop="ListHeaderComponent", :style="styl.mb5")
    //-   text 123
    view(render-prop-fn="renderItem")
      view(:style="[styl.bgWhite, styl.pad10, styl.mt5]")
        touchable-opacity(:onPress="jumpBusiDetail.bind(this, args.item)")
          view
            nb-text(:style="[styl.colorBlue]") {{args.item.opptyName}}
          view(:style="[styl.row, styl.mt5]")
            nb-text(:style="[styl.col, styl.ft14, styl.pb5, styl.pt5]") {{args.item.cstmName}}
            //- text(:style="[{flex: 0.3}, styl.ft12, styl.colorBlue, styl.textR]") {{args.item.billDate}}
          //- view(:style="[styl.rowStart, styl.mt5]", v-if="args.item.opptyAddr")
          //-   iconfont(name="dingwei", :size="15")
          //-   text(:style="styl.pl5") {{args.item.opptyAddr}}
          //- view(:style="styl.rowStart, styl.mt5", v-if="args.item.linkerName")
          //-   iconfont(name="user1", :size="15")
          //-   text(:style="styl.pl5") {{args.item.linkerName}}
          //-   //- iconfont(name="idcard1e", :style="styl.pl10", :size="15")
          //-   //- text(:style="styl.pl5") {{args.item.position}}
          //- view(:style="styl.row, styl.mt5")
          //-   view(:style="[styl.rowStart, styl.col]")
          //-     iconfont(name="phone", :size="15")
          //-     text(:style="styl.pl5") {{args.item.linkerPhone}}
          //-   view(:style="[styl.rowStart, {flex: 0.2}]")
          //-     TouchableOpacity(:onPress="linkHandler.bind(this, {num: args.item.linkerPhone, type: 'tel'})", :activeOpacity="0.5")
          //-       iconfont(name="dianhua", :size="15", color="#fff", :style="[styl.bgPrimary, styl.textR, styl.pad5, styl.cardListIconBorder]")
          //-     TouchableOpacity(:onPress="linkHandler.bind(this, {num: args.item.linkerPhone, type: 'smsto'})", :activeOpacity="0.5")
          //-       iconfont(name="huifu", :size="15", color="#fff", :style="[styl.bgGreen, styl.textR, styl.pad5, styl.cardListIconBorder, styl.ml10]")
          //- view(:style="styl.rowStart, styl.mt5")
          //-   iconfont(name="dingwei", :size="15")
          //-   text(:style="styl.pl5") 商机描述： {{args.item.remark}}
          view(:style="[styl.borderT1, styl.mt5, styl.pt10]")
            view(:style="styl.row")
              text(:style="[styl.col, styl.ft12, styl.color66]") {{args.item.creator.fkDpt.name}} {{args.item.creator.name}}
              text(:style="[styl.col, styl.textR, styl.ft12, styl.color66]") {{args.item.createAt}}
    view(render-prop="ListFooterComponent", :style="{paddingVertical: 20}")
      text(:style="[styl.textC, styl.ft12, styl.color333]", v-if="dataList.length > 0") {{endReachedMsg}}
      no-data(v-if="nodataShow")
  view.sortBox(v-if="headBoxShow")
    TouchableOpacity(:onPress="sortHandler.bind(this, '')", :activeOpacity="1")
      view.sort-content
        view(:style="[styl.bgWhite, styl.pl10]")
          TouchableOpacity(:onPress="sortHandler.bind(this, '创建时间排序')", :activeOpacity="0.5")
            text.sort-list(:style="[styl.borderB1, styl.ft14, styl.color33]") 创建时间排序
          TouchableOpacity(:onPress="sortHandler.bind(this, '名称排序')", :activeOpacity="0.5")
            text.sort-list(:style="[styl.borderB1, styl.ft14, styl.color33]") 名称排序
      //- TouchableOpacity(:onPress="sortHandler.bind(this, '2')", :activeOpacity="0.5")
      //-   text.sort-list(:style="[styl.borderB1, styl.ft12]") 得分从高到低
  //- Drawer(ref="refEvent", :onClose="closeDrawer", :openDrawerOffset="100", :open="true", type="static")
  //-   view(render-prop="content", :style="{backgroundColor: 'red'}")
  //-     nb-text 123
</template>

<script>
import { Linking, DeviceEventEmitter } from "react-native";
import { mapState } from 'vuex'
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
        filterListener: null,
        iconfontColor: '#333',
        iconfontBlueColor: '#4ebdff',
        headBoxShow: false,
        headBoxArrow: null,
        dataList: [],
        refreshing: true,
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
        switch: false,
        queryObject: {
          currentPage:0,
          pageSize: 10,
          dataLevel: '3',
          orderType: '1'
        },
        keyItems: (item, index) => index.toString(),
        endReachedMsg: '加载中...',
        isEndReached: false,
        searchKey: '',
        searchShow: false,
        nodataShow: false,
        sortTitle: '创建时间排序',
        filterCstm: false,
        pageTimeout: null
      }
    },
    computed: {
      ...mapState({
        currentUser: state => state.currentUser
      })
    },
    beforeDestroy () {
      console.log('商机页面消失')
      if (this.filterListener) this.filterListener.remove()
    },
    mounted () {
      this.$nextTick(() => {
        console.log('--------------dataList')
        console.log(this.dataList)
        this.dataList = []
        this.loadData()
      })
      this.filterListener = DeviceEventEmitter.addListener('filterBackBusiOpt', resp => {
        console.log('接收到的参数')
        console.log(resp)
        this.queryObject.dataLevel = resp.dataLevel
        this.filterCstm = (resp.dataLevel == '') ? false : true
        this.queryObject.currentPage = 0
        this.dataList = []
        this.loadData()
      })
    },
    methods: {
      backToMeScreen () {
        this.navigation.popToTop()
      },
      async loadData () {
        try {
          this.queryObject.uid = this.currentUser.id
          if (this.dataList.length == 0) this.refreshing = true
          this.endReachedMsg = '加载中...'
          let data = await this.reqPost(this.currentUser.serverUrl + this.webApi.crmQueryBusiOptsAPI, this.queryObject, 'post')
          if (data.returnCode === 0) {
            console.log('--商机--')
            console.log(data)
            data.list.map(item => {
              item.createAt = this.datetime2Str(new Date(item.createAt))
              this.dataList.push(item)
            })
            // this.queryObject.currentPage = this.queryObject.currentPage + 1
            this.refreshing = false
            this.isEndReached = (data.list.length < this.queryObject.pageSize ) ? true : false
            console.log('----isEndReached---')
            console.log(this.isEndReached)
            this.endReachedMsg = (data.list.length == 0) ? '已到底，没有更多' : '加载完成'
            this.nodataShow = (this.dataList.length === 0) ? true : false
          } else {
            this.refreshing = false
            this.dataList = []
            this.endReachedMsg = '暂无数据'
          }
        } catch (e) {
          console.warn(e)
          alert(e)
        }
      },
      headBoxHandler: function (type) {
        // console.log(type)
        if (type == 0) {
          this.headBoxShow = !this.headBoxShow
          this.headBoxArrow = (this.headBoxShow) ? type : null
        } else if (type == 1) {
          console.log('--------DeviceEventEmitter')
          DeviceEventEmitter.emit('busiOptSendFilter', {test: '一条测试数据'})
          console.log(this.navigation)
          this.navigation.navigate('DrawerOpen')
        } else if (type == 2) {
          // this.navigate('search')
          this.searchShow= !this.searchShow
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
      _onRefresh: function () {
        // this.refreshing = true
        this.queryObject.currentPage = 0
        this.dataList = []
        this.loadData()
      },
      linkHandler: function (obj) {
        obj.type === 'tel' ? this.phoneCall(obj.num) : this.sms(obj.num)
      },
      sortHandler: function (type) {
        // this.refreshing = false
        if (type == '创建时间排序') {
          this.queryObject.orderType = (this.queryObject.orderType == '0') ? '1' : '0'
        } else if (type == '名称排序') {
          this.queryObject.orderType = (this.queryObject.orderType == '2') ? '3' : '2'
        } else {
          this.headBoxShow = false
          return
        }
        this.sortTitle = type
        this.headBoxShow = false
        console.log('--queryObject--')
        console.log(this.queryObject)
        this.queryObject.currentPage = 0
        this.dataList = []
        this.loadData()
      },
      jumpBusiDetail: function (obj) {
        console.log('-------------busiOptDetail')
        this.navigate('busiOptDetail', obj)
      },
      clickIcon: function (pageName) {
        let me = this
        this.navigate(pageName, {callBack:function () {
          this.dataList = []
          me.loadData()
        }})
      },
      searchChanege: function () {
        this.queryObject.currentPage = 0
        this.dataList = []
        this.queryObject.opptyName = this.searchKey
        // this.searchKey
        this.loadData()
      }
    }
  }
</script>
<style lang="stylus">
  .sortBox {
    width: 100%;
    height: 100%;
    z-index: 999;
    top: 106;
    position: absolute;
    backgroundColor: rgba(0,0,0,.5);
  }
  .sort-content {
    width: 100%;
    height: 100%;
  }
  .sort-list{
    height: 40;
    lineHeight: 40;
  }
</style>
