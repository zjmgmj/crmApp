<template lang="pug">
  nb-container
    app-header
      touchable-opacity(:on-press="clickIcon", slot="rightBtns")
        iconfont(name="search", :size="20", color="#fff")
    nb-content(:padder="true", :style="styl.bgColorF2")
      view(:style="[styl.bgWhite, styl.borderR5]")
        nb-list
          nb-list-item(:style="styl.visitBoxList")
            nb-left
              view(:style="styl.row")
                nb-text(:style="[styl.ft14, styl.ftWeight, styl.pr5]") 拜访提醒
                iconfont(name="new", :style="[styl.colorRed, {marginTop: platformOS=='android' ? 3 : 4}]", :size="25", v-if="visitNum > 0")
              nb-right
                touchable-opacity(:on-press="jumpFixScreen.bind(this, 'visitCreate')")
                  view(:style="styl.row")
                    nb-text(:style="[styl.ft12, styl.ftColor]") 新增拜访
                    iconfont(name="add2", color="#333",:style="[styl.pr5,styl.ftWeight]")
          nb-list-item(:last="true", :style="styl.visitBoxList", v-if="visitNum > 0")
            nb-left
              nb-text(:style="[styl.ft12, styl.color88]") {{todayStr}}
              nb-right
                touchable-opacity(:on-press="jumpFixScreen.bind(this, 'visitList')")
                  view(:style="styl.row")
                    nb-text(:style="[styl.ft12, styl.color88]") 今日有{{visitNum}}名客户等待访问
                    iconfont(name="dian", :style='styl.colorRed')
                    iconfont(name="arrowright", color="#333")
          touchable-opacity(:on-press="jumpFixScreen.bind(this, 'visitCreate')", v-else)
            view(:style="[styl.pt10, styl.pb10]")
              text(:style="[styl.textC, styl.ft12, styl.pb5, styl.color88]") 客户的订单，往往只是因为你多拜访了一次。
              text(:style="[styl.textC, styl.ft12, styl.color88]") 现在就去拜访客户吧！
      view(v-for="(itm, index) in cardData", :key="index", :item="itm", :style="[styl.bgWhite, styl.mt10, styl.pt10, styl.pb10, styl.borderR5, styl.saleBlue]")
        TouchableWithoutFeedback(:onPress="saleChartHandler.bind(this, index)")
          view
            view(:style="styl.row")
              nb-text(:style="[styl.ft14, styl.pl10, {paddingRight: 2}]") {{itm.title}}
              iconfont(:name="itm.icon", :color="itm.color", :size="16")
            view(:style="styl.mt5, styl.pl10, styl.pr10")
              nb-text(:style="[styl.ft12, styl.color88, styl.ftWeight]") 月任务完成： {{itm.task}}{{itm.unit}}
            view(:style="[styl.row, styl.mt5,styl.pl10, styl.pr10]")
              view(v-for="(cardVal, idx) in itm.cardVal", :key="idx", :item="cardVal", :style="styl.col")
                text(:style="[{color: itm.color}, styl.ft20, styl.textC]") {{cardVal.val}}
                text(:style="[styl.ft12, styl.color88, styl.textC]") {{cardVal.lbl}}
            view(:style="{height: itm.height, overflow: 'hidden'}")
              echart(:option="itm.chartView", :height="200")
</template>

<script>
  import Echarts from 'native-echarts'
  import Iconfont from '../components/vue/iconfont/index'
  import { mapState, mapActions } from 'vuex'
  import * as fileUtil from '../utils/fileUtil'
  import SplashScreen from 'react-native-splash-screen'
  import chartLoad from '../../assets/img/h_d.gif'
  export default {
    props: {
      navigation: {
        type: Object
      }
    },
    data () {
      return {
        homeTimeout: null,
        routeListener: null,
        storageResp: false,
        // chartBarViewShow: false,
        resp: '暂无',
        chartLoadImg: chartLoad,
        todayStr: '',
        visitNum: '',
        cardData: [{
          title: '全部销量',
          icon: 'tubiao',
          task: '0',
          unit: '吨',
          color: '#4ebdff',
          height: 0,
          cardVal: [{
            lbl: '昨日销量(吨)',
            val: '0'
          }, {
            lbl: '月累计(吨)',
            val: '0'
          }, {
            lbl: '完成率',
            val: '0%'
          }],
          chartView: {},
          saleChart: false
        }, {
          title: '线上销量',
          icon: 'tubiao',
          task: '0',
          unit: '吨',
          color: '#80c269',
          height: 0,
          cardVal: [{
            lbl: '昨日销量(吨)',
            val: '0'
          }, {
            lbl: '月累计(吨)',
            val: '0'
          }, {
            lbl: '完成率',
            val: '0%'
          }],
          chartView: {},
          saleChart: false
        }, {
          title: '线下销量',
          icon: 'tubiao',
          task: '30',
          unit: '吨',
          color: '#f8b551',
          cardVal: [{
            lbl: '昨日销量(吨)',
            val: '0'
          }, {
            lbl: '月累计(吨)',
            val: '0'
          }, {
            lbl: '完成率',
            val: '0%'
          }],
          chartView: {},
          height: 0,
          saleChart: false
        }, {
          title: '板材销量',
          icon: 'tubiao',
          task: '0',
          unit: '吨',
          color: '#88abda',
          cardVal: [{
            lbl: '昨日销量(吨)',
            val: '0'
          }, {
            lbl: '月累计(吨)',
            val: '0'
          }, {
            lbl: '完成率',
            val: '0%'
          }],
          chartView: {},
          height: 0,
          saleChart: false
        }, {
          title: '高卖金额',
          icon: 'tubiao',
          task: '0',
          unit: '元',
          color: '#00c1de',
          cardVal: [{
            lbl: '昨日销量(元)',
            val: '0'
          }, {
            lbl: '月累计(元)',
            val: '0'
          }, {
            lbl: '完成率',
            val: '0%'
          }],
          chartView: {},
          height: 0,
          saleChart: false
        }, {
          title: '新增客户',
          icon: 'tubiao',
          task: '0',
          unit: '人',
          color: '#a6937c',
          cardVal: [{
            lbl: '昨日新增(人)',
            val: '0'
          }, {
            lbl: '月累计(人)',
            val: '0'
          }, {
            lbl: '完成率',
            val: '0%'
          }],
          chartView: {},
          height: 0,
          saleChart: false
        }, {
          title: '二次开发',
          icon: 'tubiao',
          task: '0',
          unit: '人',
          color: '#ffb3b3',
          cardVal: [{
            lbl: '昨日新增(人)',
            val: '0'
          }, {
            lbl: '月累计(人)',
            val: '0'
          }, {
            lbl: '完成率',
            val: '0%'
          }],
          chartView: {},
          height: 0,
          saleChart: false
        }],
        chartView: {
          tooltip: {},
          color: ['#4ebdff'],
          grid: {
            x: 18,
            y: 30,
            x2: 27,
            bottom: '3%',
            containLabel:true
          },
          xAxis: {
            data: ['8/12', '8/13', '8/14', '8/15', '8/16', '8/17', '8/18'],
            splitLine:{
              show: true,
              lineStyle: {
                color: '#f4f4f4'
              }
            },
            axisLabel: {
              show: true,
              textStyle: {
                color: '#888',
                fontSize: 12
              }
            },
            axisLine: {
              lineStyle: {
                color: '#f4f4f4',
                width: 1,
                }
            },
            boundaryGap: false
          },
          yAxis: {
            type: 'value',
            show: true,
            axisLabel: {
              show: false,
              formatter: ''
            },
            axisLine: {
              show: true,
              lineStyle: {
                color: '#f4f4f4',
                width: 1,
                }
            },
            axisTick: {
              show:false,
            },
            splitArea:{show:false},
            splitLine:{
              show: true,
              lineStyle: {
                color: '#eee'
                }
            }
          },
          series: [{
            animation: false,
            smooth: true,
            type: 'line',
            symbolSize: 5,
            lineStyle: {
              width: 1
            },
            data: [],
            label:{
              normal:{
                show:true,            //显示数字
                position: 'top'        //这里可以自己选择位置
              }
            },
            areaStyle: {
              normal: {
                show: true,
                opacity: 0.2
              }
            }
          }]
        },
        queryObj: {
          uid: null,
          type: 0
        }
      }
    },
    components: {
      echart:Echarts,
      iconfont: Iconfont
    },
    computed: {
      ...mapState({
        isLogin: state => state.isLogin,
        currentUser: state => state.currentUser
      })
    },
    beforeMount () {
      const me = this
      this.$nextTick(() => {
        console.log('home beforeMount')
        this.routeListener = this.navigation.addListener('willFocus', (prepload) => {
          console.log('home willFocus')
          me.userLogin()
        })
        fileUtil.getAsyncStorage('introPage').then(res => {
          console.log('intropage')
          console.log(res)
          SplashScreen.hide()
          fileUtil.getAsyncStorage('currentUser').then(resp => {
            me.storageResp = true
            if (resp && JSON.stringify(resp) !== '{}') {
              console.log('set user')
              me.setUser(resp)
            } else {
              me.exitUser()
            }
            console.log(me.isLogin)
            me.userLogin()
          }).catch(err => {
            me.storageResp = true
            me.exitUser()
            me.userLogin()
          })

          if (me.homeTimeout) clearTimeout(me.homeTimeout)
          me.homeTimeout = setTimeout(() => {
            if (!me.storageResp) {
              me.pageHide()
              me.userLogin()
            }
          }, 1000)

        }).catch(e => {
          console.warn(e)
        })
      })
    },
    destroyed () {
      if (this.routeListener) this.routeListener.remove()
    },
    methods: {
      ...mapActions([
        'setUser',
        'exitUser'
      ]),
      async visiWarn (params) {
        try {
          let data = await this.reqPost(this.currentUser.serverUrl + this.webApi.crmQueryCallAPI, params, 'post')
          if (data.returnCode === 0) {
            console.log('-----------------visiWarn')
            console.log(data.list)
            this.visitNum = data.list.length
          } else {}
        } catch (e) {
          console.warn(e)
          // alert(e)
        }
      },
      userLogin () {
        if (!this.isLogin) {
          this.alert({content: '用户未登录，请先登录'}).then(() => {
            this.navigate('login')
          })
          return
        }
        let todayArr = this.date2Str(new Date()).split('/')
        this.todayStr = todayArr[0] + '年' + todayArr[1] + '月' + todayArr[2] + '日'
        this.queryObj.uid = this.currentUser.id
        console.log(this.cardData.chartView)
        // this.cardData.chartView.series[0]['data'] = []
        // this.chartBarViewShow = false
        this.queryObj.type = 0
        this.loadData().then(() => {
          // this.chartBarViewShow = true
          this.queryObj.type = 1
          this.loadData()
        })
        let params = {
          currentPage: 0,
          pageSize: 100,
          uid: this.currentUser.id,
          type: 2
        }
        this.visiWarn(params)
      },
      getTimeList () {
        let dateArr = []
        let keyDate = []
        let nowTime = new Date().getTime()
        for (let i=1; i<8; i++) {
          let dateTimeStr = this.date2Str(new Date(nowTime - 86000000 * i))
          dateArr.push(dateTimeStr)
        }
        dateArr.reverse()
        dateArr.map(key => {
          let keyArr = key.split('/')
          // chartView.xAxis.data.push(keyArr[1] + '/' + keyArr[2])
          keyDate.push(keyArr[1] + '/' + keyArr[2])
        })
        console.log(keyDate)
        return keyDate
        // console.log(dateArr)
      },
      async loadData (params) {
        try {
          let data = await this.reqPost(this.currentUser.serverUrl + this.webApi.crmQueryTaskDetailAPI, this.queryObj, 'post')
          if (data.returnCode === 0) {
            console.log('----crmTaskDetail-----')
            console.log(data)
            let resData = data.list
            console.log('------resData')
            console.log(resData)
            if (resData.length === 0) {
              return
            }
            if (this.queryObj.type == 0) {
              let monthNo = 28
              let monthTaskNo = 32
              let n = 0
              for (let i=0; i<4; i++) {
                this.dataPro(i, n, monthNo, monthTaskNo, resData)
                let s = n
                let seriesArr = []
                for (let m=0; m<7; m++) {
                  console.log(s)
                  seriesArr.push(resData[s].toFixed(2))
                  s+=4
                }
                this.cardData[i].chartView.series[0].data = seriesArr.reverse()
                console.log('-------seriesData')
                console.log(this.cardData[i].chartView.series[0].data)
                n += 1
                monthNo++
                monthTaskNo++
              }
              // this.cardData[0].saleChart = true
              // this.cardData[0].height = 200
            } else {
              let n = 0
              let monthNo = 7
              let monthTaskNo = 8
              for (let i=4; i<7; i++) {
                this.dataPro(i, n, monthNo, monthTaskNo, resData)
                let s = n
                let seriesArr = []
                for (let m=0; m<7; m++) {
                  seriesArr.push(resData[s].toFixed(2))
                  s++
                }
                this.cardData[i].chartView.series[0].data = seriesArr.reverse()
                n += 9
                monthNo += 9
                monthTaskNo += 9
              }
            }
          } else {
            console.log('error')
          }
        } catch (e) {
          console.warn(e)
        }
      },
      dataPro: function (i, n, monthNo, monthTaskNo, resData) {
        this.cardData[i].cardVal[0].val = Number(resData[n].toFixed(2))
        this.cardData[i].cardVal[1].val = Number(resData[monthNo].toFixed(2))
        this.cardData[i].cardVal[2].val = (resData[monthTaskNo] == 0) ? '--' : ((Number(resData[monthNo]) / resData[monthTaskNo]) * 100).toFixed(2) + '%'
        this.cardData[i].task = Number(resData[monthTaskNo].toFixed(2))
        this.cardData[i].chartView = JSON.parse(JSON.stringify(this.chartView))
        this.cardData[i].chartView.color[0] = this.cardData[i].color
        this.cardData[i].chartView.xAxis.data = this.getTimeList()
      },
      saleChartHandler: function (idx) {
        // let arr = ['#4ebdff', '#80c269', '#f8b551', '#88abda', '#00c1de', '#a6937c', '#ffb3b3']
        // this.cardData[idx].saleChart = !this.cardData[idx].saleChart
        this.cardData[idx].height = (this.cardData[idx].height > 0) ? 0 : 200
      },
      clickIcon () {
        this.navigate('search')
      },
      jumpFixScreen (pageName) {
        this.navigate(pageName)
      }
    }
  }
</script>
<style>
  .new-tag{
    paddingTop: 1;
    paddingBottom: 1;
    paddingLeft: 6;
    paddingRight: 6;
    marginLeft: 5;
    color: #ffffff;
    fontWeight: normal;
    borderRadius: 15;
  }
</style>