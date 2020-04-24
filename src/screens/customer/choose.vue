<template lang="pug">
nb-container
  app-header(:headTitle="screenTitle", :hasLeft="true", :backFunc="back")
  view(:style="[{height: 45, backgroundColor: '#FFF'}, styl.borderB1, styl.rowStart]")
    iconfont(name="search",:style="[styl.ml10,styl.mr10]")
    nb-input(v-model="searchKey", placeholder="请输入关键词查询", :onChangeText="searchChanege" ,:style="[styl.ft14]")
  //- view
    nb-fab(direction="up", position="bottomRight") 
  flat-list(:data="dataList", :style="[styl.bgColorF2]", :onEndReachedThreshold="0.1", :onEndReached="_onEndReached", :refreshing="refreshing", :onRefresh="_onRefresh", :keyExtractor="keyItems")
    view(render-prop-fn="renderItem")
      view(:style="[styl.bgWhite, styl.pad10, {marginTop:5}]")
        touchable-opacity(:on-press="choose.bind(this, args.item)", :style="styl.col")
          view(:style="styl.row")
            nb-text(:style="[styl.col, styl.ft15]") {{args.item.compName}}
            text(:style="[styl.ft12, styl.colorWhite, {borderRadius: 10, paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3, backgroundColor: (args.item.markStr == '正式客户')? '#8fc320' : '#f5b84e'}]") {{args.item.markStr}}
          view(:style="[styl.rowStart, styl.mt5]", v-if="args.item.compAddr")
            iconfont(name="dingwei", :size="15")
            text(:style="[styl.pl5,styl.ft12, styl.color88]") {{args.item.compAddr}}
          view(:style="[styl.row, styl.mt5]")
            text(:style="[styl.col, styl.ft12, styl.color88]") {{args.item.dptName}} {{args.item.acctName}}
            text(:style="[styl.col, styl.textR, styl.ft12, styl.colorRed]") {{args.item.visitDay}}天未拜访
    view(render-prop="ListFooterComponent", :style="{paddingVertical: 20}")
      text(:style="styl.textC, styl.ft12, styl.color333", v-if="dataList.length > 0") {{endReachedMsg}}
      no-data(v-if="nodataShow")
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
        dataList: [],
        refreshing: true,
        queryObject: {
          currentPage:0,
          pageSize: 10,
          orderType: 0,
          uid: ''
        },
        searchKey: '',
        isFabIconActive1: true,
        keyItems: (item, index) => index.toString(),
        endReachedMsg: '加载中...',
        isEndReached: false,
        nodataShow: false
      }
    },
    computed: {
      ...mapState({
        currentUser: state => state.currentUser,
        cstmArr: state => state.cstmArr
      })
    },
    mounted () {
      console.log(this.navigation.state.params)
      this.searchKey = ''
    },
    methods: {
      async loadData () {
        try {
          if (this.dataList.length == 0) this.refreshing = true
          this.endReachedMsg = '加载中...'
          this.queryObject.uid = this.currentUser.id
          let url = this.currentUser.serverUrl + this.webApi.crmQueryCstmAPI
          let data = await this.reqPost(url, this.queryObject, 'post')
          let arrList = this.cstmArr
          data.list.map(itm => {
            let obj = {}
            for(let i=0; i<arrList.length; i++){
              obj[arrList[i]] = itm[i]
              if (arrList[i] == 'mark'){
                obj['markStr'] = (itm[i] == 1) ? '潜在客户' : (itm[i] == 2) ? '正式客户' : '公共客户'
              }
              if (arrList[i] == 'clockTime') {
                let endDate = new Date(this.date2Str(new Date()) + ' 02:00:00')
                let startDate = new Date(this.date2Str(new Date(itm[i])) + ' 02:00:00')
                let date = endDate.getTime() - startDate.getTime()
                obj['visitDay'] = Math.floor(date / (24*3600*1000))
              }                            
              if (arrList[i] == 'compAddr') {
                let compProv = (itm[3]) ? itm[3] : ''
                let compCity = (itm[4])? itm[4] :''
                let compArea = (itm[5])? itm[5] :''
                let compAddr = (itm[2])? itm[2]: ''
                obj['compAddr'] = compProv + compCity + compArea + compAddr
              }              
            }
            this.dataList.push(obj)
          })
          this.refreshing = false
          this.queryObject.currentPage = this.queryObject.currentPage + 1
          this.isEndReached = (data.list.length < this.queryObject.pageSize ) ? true : false
          // this.endReachedMsg = '加载完成'
          this.endReachedMsg = (data.list.length == 0) ? '已到底，没有更多' : '加载完成'
          this.nodataShow = (this.dataList.length === 0) ? true : false
        } catch (e) {
          console.warn(e)
          alert(e)
        }
      },
      _onEndReached: function () {
        if (this.isEndReached) {
          this.endReachedMsg = '已到底，没有更多'
        } else {
          this.loadData()
        } 
      },
      _onRefresh: function () {
        this.dataList = []
        this.queryObject.currentPage = 0
        this.loadData()      
      },
      choose: function (item) {
        // this.navigation.state.params.callBack(item)
        this.back(item)
      },
      searchChanege: function (val) {
        this.queryObject.currentPage = 0
        this.queryObject.compName = this.searchKey
        this.dataList = []
        this.loadData()
      },
      isFabIconActive: function () {}
    }
  }
</script>
<style lang="stylus">
  .tag{
    /*borderRadiusRight: 5;
    borderRadiusLeft: 5;*/
    borderRadius: 10;
    color: #fff;
  }
</style>