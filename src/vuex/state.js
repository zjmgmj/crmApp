export default {
  currentUser: {},
  isLogin: false,
  version: '0.0.2',
  serverUrl: '',
  cstmArr: ['cstmId', 'compName', 'compAddr', 'compProv', 'compCity', 'compArea', 'mark', 'compNameInitial', 'createAt', 'updateAt', 'publicCompName', 'billDate', 'linkerId', 'linkerName', 'linkerPhone', 'linkerPosition', 'dptId', 'dptName', 'orgId', 'orgName', 'acctId', 'acctName', 'summary', 'clockTime', 'region'],
  // 我的中间图标
  meMiddleIcons: [
    [{
      title: '新建商机',
      icon: 'xinjian',
      iconColor: '#b1d35e',
      pageName: 'busiOptCreate'
    }, {
      title: '新建拜访',
      icon: 'date',
      iconColor: '#e79163',
      pageName: 'visitCreate'
    }, {
      title: '商机管理',
      icon: 'bingtu',
      iconColor: '#feb617',
      pageName: 'busiOptList'
    }, {
      title: '拜访管理',
      icon: 'fenlei',
      iconColor: '#d6a261',
      pageName: 'visitList'
    }],
    [{
      title: '快速签到',
      icon: 'dingwei',
      iconColor: '#73a4ed',
      pageName: 'visitCheck'
    }, {
      title: '需求提报',
      icon: 'wenben',
      iconColor: '#3cb98d',
      pageName: ''
    }, {
      title: '需求管理',
      icon: 'wenben',
      iconColor: '#b1d35e',
      pageName: ''
    }, {
      title: '修改密码',
      icon: 'mima',
      iconColor: '#ffa522',
      pageName: 'updatePwd'
    }]
  ]
}