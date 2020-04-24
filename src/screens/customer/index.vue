<template lang="pug">
nb-container
  app-header(:hasTab="true", :tabs="tabs", :tabChange="headerHandler")
  view(:style="[styl.bgWhite, styl.row, styl.pt10, styl.pb10, styl.borderB1, {height: 40}]", :hasTab="true")
    TouchableOpacity(:onPress="headBoxHandler.bind(this, 0)", :style="[styl.col, styl.headSearch]")
      view
        text(:style="[styl.textC, styl.ft12, (headBoxArrow == 0) ? styl.colorBlue : styl.color66]") {{sortTitle}}
          iconfont(name="arrowdown1", :size="12", :color="(headBoxArrow == 0) ? iconfontBlueColor : iconfontColor" v-if="queryObject.orderType == '0' || queryObject.orderType == '2' || queryObject.orderType == '4' || queryObject.orderType == '6'")
          iconfont(name="shangjiantou", :size="12", :color="(headBoxArrow == 0) ? iconfontBlueColor : iconfontColor" v-else)
          iconfont(name="arrowup", :size="12", :color="iconfontBlueColor", v-if="headBoxArrow == 0")
          iconfont(name="arrowdown", :size="12", :color="iconfontColor", v-else)
    TouchableOpacity(:onPress="headBoxHandler.bind(this, 1)", :style="[styl.col, styl.headSearch]")
      view
        text(:style="[styl.textC, styl.ft13,styl.color66]")
          text(:style="[styl.pr5, (filterCstm) ? styl.colorBlue : styl.color66]") 筛选
          iconfont(name="arrowup", :size="12", :color="iconfontBlueColor", v-if="filterCstm")
          iconfont(name="arrowdown", :size="12", :color="iconfontColor", v-else)
    TouchableOpacity(:onPress="headBoxHandler.bind(this, 2)", :style="styl.col")
      view
        text(:style="[styl.textC, styl.ft13]")
         iconfont(name="search", :size="12", :color="iconfontColor")
         text(:style="[styl.pl5,styl.color66]") 搜索
  //- flat-list(:data="dataList", :style="styl.bgColorF2", :onEndReachedThreshold="0.1", :onEndReached="_onEndReached", :refreshing="refreshing", :onRefresh="_onRefresh", :keyExtractor="keyItems")
  flat-list(:data="dataList", :style="styl.bgColorF2", :onEndReachedThreshold="0.1", :onEndReached="_onEndReached.bind(this, queryObject.currentPage)", :refreshing="refreshing", :onRefresh="_onRefresh", :keyExtractor="keyItems", :automaticallyAdjustContentInsets="false", :pageSize="4")
    view(render-prop-fn="renderItem")
      view(:style="[styl.bgWhite, styl.pad10, styl.mt10]")
        touchable-opacity(:onPress="jumpFixScreen.bind(this, args.item)")
          view(:style="styl.row")
            nb-text(:numberOfLines="1", :style="[styl.col, styl.ft15]") {{args.item.compName}}
            text(:style="[{flex: 0.4}, styl.ft12, styl.textR, args.item.color]") {{args.item.billDateDays}} 天未交易
          view(:style="styl.rowStart, styl.mt10", v-if="args.item.compAddr !== null && args.item.compAddr.trim() !== ''")
            iconfont(name="dingwei", :size="15")
            text(:numberOfLines="1", :style="[styl.pl5, styl.ft13, styl.color66, {paddingRight: 10}]") {{args.item.compAddr}}
          view(:style="styl.row")
            view(:style=" styl.col")
              view(:style="styl.rowStart, styl.mt10")
                iconfont(name="user1", :size="15")
                text(:style="[styl.pl5,  styl.ft13, styl.color66]") {{args.item.linkerName}}
              view(:style="[styl.rowStart,styl.mt10]")
                iconfont(name="phone", :size="15")
                text(:style="[styl.pl5,  styl.ft13, styl.color66]") {{args.item.linkerPhone}}
            view(:style="[styl.rowEnd, {flex: 0.3}]")
              TouchableOpacity(:onPress="linkHandler.bind(this, {num: args.item.linkerPhone, type: 'tel'})", :activeOpacity="0.5", :style="[styl.bgPrimary,styl.cardListIconBorder, styl.pad8]")
                iconfont(name="dianhua", :size="15", color="#fff", :style="[styl.textR]")
              TouchableOpacity(:onPress="linkHandler.bind(this, {num: args.item.linkerPhone, type: 'smsto'})", :activeOpacity="0.5", :style="[styl.bgGreen,styl.cardListIconBorder, styl.pad8, styl.ml10]")
                iconfont(name="huifu", :size="15", color="#fff", :style="[styl.textR]")
          view(:style="[styl.borderT1, styl.mt10, styl.pt10]")
            view(:style="styl.row")
              text(:style="[styl.col, styl.ft12, styl.color66]") {{args.item.dptName}} {{args.item.acctName}}
              text(:style="[styl.col, styl.textR, styl.ft12, styl.color66]") 创建日期： {{args.item.createTimeStr}}
    view(render-prop="ListFooterComponent", :style="{paddingVertical: 20}")
      text(:style="styl.textC, styl.ft12, styl.color333", v-if="dataList.length > 0") {{endReachedMsg}}
      no-data(v-if="nodataShow")
  view.sort-box(v-if="headBoxShow")
    TouchableOpacity(:onPress="sortHandler.bind(this, '')", :activeOpacity="1")
      view.sort-content
        view(:style="[styl.bgWhite, styl.pl10]")
          TouchableOpacity(:onPress="sortHandler.bind(this, '创建时间')", :activeOpacity="0.5")
            text.sort-list(:style="[styl.borderB1, styl.ft14, styl.color33]") 按创建时间排序
          TouchableOpacity(:onPress="sortHandler.bind(this, '拜访时间')", :activeOpacity="0.5")
            text.sort-list(:style="[styl.borderB1, styl.ft14, styl.color33]") 按拜访时间排序
          TouchableOpacity(:onPress="sortHandler.bind(this, '名称a-z')", :activeOpacity="0.5")
            text.sort-list(:style="[styl.borderB1, styl.ft14, styl.color33]") 按名称a-z排序
          TouchableOpacity(:onPress="sortHandler.bind(this, '得分')", :activeOpacity="0.5")
            text.sort-list(:style="[styl.borderB1, styl.ft14, styl.color33]") 按得分排序
</template>

<script>
import { Linking, DeviceEventEmitter } from "react-native"
import { mapState } from 'vuex'
  export default {
    props: {
      navigation: {
        type: Object
      }
    },
    components: {
    },
    computed: {
      ...mapState({
        currentUser: state => state.currentUser,
        cstmArr: state => state.cstmArr
      })
    },
    data () {
      return {
        filterListener: null,
        filterBlurListener: null,
        tabs: [{name: '正式客户'}, {name: '潜在客户'}, {name: '公共客户'}],
        iconfontColor: '#6666',
        iconfontBlueColor: '#4ebdff',
        headBoxShow: false,
        headBoxArrow: null,
        dataList: [],
        refreshing: false,
        sortTitle: '创建时间排序',
        keyItems: (item, index) => index.toString(),
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
          pageSize: 4,
          orderType: 0,
          mark: '2',
          uid: '',
        },
        endReachedMsg: '加载中...',
        isEndReached: false,
        nodataShow: false,
        filterCstm: false,
        isWatch: false,
        pageTimeout: null
      }
    },
    beforeMount () {
      this.routeListener = this.navigation.addListener('willFocus', (prepload) => {
        if (this.isWatch) {
          this.dataList = []
          this.queryObject= {
            currentPage: 0,
            pageSize: 4,
            orderType: 0,
            mark: this.queryObject.mark,
            uid: this.currentUser.id
          }
          this.loadData()
          this.isWatch = false          
        }
      })
      this.filterBlurListener = this.navigation.addListener('didBlur', (prepload) => {
        console.log('didBlur')
        this.headBoxShow = false
      })
    },
    watch: {
      currentUser (curVal,oldVal) {
        this.isWatch = true
      }
    },
    mounted () {      
      this.filterListener = DeviceEventEmitter.addListener('filterBackCstm', resp => {
        console.log('接收到的参数')
        console.log(resp)
        for(key in resp) {
          this.queryObject[key] = resp[key]
          this.filterCstm = (typeof(resp[key]) == 'number') ? true : false
        }
        this.queryObject.currentPage = 0
        this.dataList = []
        this.loadData()
      })
    },
    beforeDestroy () {
      console.log('客户页面消失')
      if (this.filterListener) this.filterListener.remove()
      if (this.filterBlurListener) this.filterBlurListener.remove()
    },
    methods: {
      async loadData () {
        try {
          if (this.dataList.length == 0) {
            this.pageShow()
            this.endReachedMsg = ''
          } else {
            this.endReachedMsg = '加载中...'
          }
          this.nodataShow = false
          this.queryObject.uid = this.currentUser.id
          let url = this.currentUser.serverUrl + this.webApi.crmQueryCstmAPI
          let data = await this.reqPost(url, this.queryObject, 'post')
          if (data.returnCode === 0) {
            let arrList = this.cstmArr
            let endDate = new Date(this.date2Str(new Date()) + ' 02:00:00')
            // alert(this.date2Str(new Date()) + ' 02:00:00')
            // alert(new Date('2018/09/19 02:00'))
            let arr = this.dataList
            data.list.map(itm => {
              let obj = {}
              for(let i=0; i<arrList.length; i++){
                let startDate = new Date(this.date2Str(new Date(itm[11])) + ' 02:00:00')
                let date = endDate.getTime() - startDate.getTime()
                let days = Math.floor(date / (24*3600*1000))
                obj.billDateDays = (days < 0)? 0 : days // 未开单时间
                obj.color = {
                  color: (obj.billDateDays <= 30) ? '#4ebdff' : (obj.billDateDays > 30 && obj.billDateDays <= 60) ? '#f5b84e' : '#f66c6c'
                }
                obj.createTimeStr = this.date2Str(new Date(itm[8]))
                let compProv = (itm[3]) ? itm[3] : ''
                let compCity = (itm[4])? itm[4] :''
                let compArea = (itm[5])? itm[5] :''
                let compAddr = (itm[2])? itm[2]: ''
                obj.compAddr = compProv + compCity + compArea + compAddr
                obj[arrList[i]] = itm[i]
              }
              arr.push(obj)
            })
            this.dataList = arr
            // this.dataList = this.dataList.concat(data.list)
            this.refreshing = false
            this.pageHide()
            // this.queryObject.currentPage = this.queryObject.currentPage + 1
            this.isEndReached = (data.list.length < this.queryObject.pageSize ) ? true : false
            // this.endReachedMsg = '加载完成'
            this.endReachedMsg = (data.list.length == 0) ? '已到底，没有更多' : '加载完成'
            this.nodataShow = (this.dataList.length === 0) ? true : false
          } else {
            this.msgShow(data.errMsg)
          }
          // this.pageHide()
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
          DeviceEventEmitter.emit('cstmSendFilter', {})
          console.log(this.navigation)
          this.navigation.navigate('DrawerOpen')
        } else if (type == 2) {
          this.navigate('search')
        }
      },
      // _onEndReached: function () {
      //   if (this.isEndReached) {
      //     this.endReachedMsg = '已到底，没有更多'
      //   } else {
      //     this.loadData()
      //   }
      // },
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
        this.dataList = []
        this.queryObject.currentPage = 0
        this.loadData()
      },
      linkHandler: function (obj) {
        obj.type === 'tel' ? this.phoneCall(obj.num) : this.sms(obj.num)
      },
      sortHandler: function (type) {
        if (type == '创建时间') {
          this.queryObject.orderType = (this.queryObject.orderType == '0') ? '1' : '0'
        } else if (type == '拜访时间') {
          this.queryObject.orderType = (this.queryObject.orderType == '2') ? '3' : '2'
        } else if (type == '名称a-z') {
          this.queryObject.orderType = (this.queryObject.orderType == '4') ? '5' : '4'
        } else if (type == '得分') {
          this.queryObject.orderType = (this.queryObject.orderType == '6') ? '7' : '6'
        } else {
          this.headBoxShow = false
          return
        }
        this.sortTitle = type
        this.headBoxShow = false
        this.queryObject.currentPage = 0
        this.dataList = []
        this.loadData()
        console.log(type)
      },
      jumpFixScreen: function (obj) {
        console.log('--------')
        this.navigate('cstmDetail', {id: obj.cstmId})
      },
      headerHandler: function (type) {
        console.log('--headerHandler---')
        console.log(type)
        this.queryObject.mark = (type == '潜在客户') ? 1 : (type == '正式客户') ? 2 : 3
        this.dataList = []
        this.queryObject.currentPage = 0
        this.loadData()
      }
    }
  }
</script>
<style lang="stylus">
  .sort-box {
    width: 100%;
    height: 100%;
    z-index: 999;
    top: 96;
    position: absolute;
    backgroundColor: rgba(0,0,0,.5);
  }
  .sort-content {
    width: 100%;
    height: 100%;
  }
  .sort-list{
    height: 40;
    line-height: 40;
  }
</style>
