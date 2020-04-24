const prefix = '/crmserver/mobile'
// const prefix = '/mobile'
export default {
  // 登录
  crmLoginAPI: `${prefix}/login`,
  // 注册
  crmAcctCreateAPI: `${prefix}/acct/create`,
  // 验证码
  crmSmsCreateAPI: `${prefix}/smsCreate`,
  // 下拉获取部门
  crmDptQueryComboAPI: `${prefix}/dpt/queryCombo`,
  // 修改密码
  crmUpdatePwdAPI: `${prefix}/acct/updatePwd`,
  // 新增/更新设备信息
  crmUpdateDeviceInfoAPI: `${prefix}/mobileInfo/create`,
  // 设备登出
  crmLogoutAPI: `${prefix}/mobileInfo/logOut`,
  // 查询所有拜访信息
  crmQueryCallAPI: `${prefix}/cstmCall`,
  // 新增拜访信息
  crmCreateCallAPI: `${prefix}/cstmCall/callCreate`,
  // 查询单个拜访信息
  crmQuerySingleCallAPI: `${prefix}/cstmCall`,
  // 更新客户拜访状态(签到)
  crmCallCheckAPI: `${prefix}/cstmCall/update`,
  // 查询任务完成情况
  crmQueryTaskAPI: `${prefix}/home`,
  // 查询任务情况详情(前7天)
  crmQueryTaskDetailAPI: `${prefix}/home/taskCompletion`,
  // 查询单个客户
  crmQuerySingleCstmAPI: `${prefix}/customer`,
  // 查询所有客户
  crmQueryCstmAPI: `${prefix}/customer`,
  // 查询单个业务员
  crmQuerySingleAcctAPI: `${prefix}/acct`,
  // 查询消息提醒
  crmQueryMsgAPI: `${prefix}/message`,
  // 消息标位已读
  crmReadMsgAPI: `${prefix}/msgUpdate`,
  // 查询所有商机
  crmQueryBusiOptsAPI: `${prefix}/busiOppty`,
  // 新增商机
  crmCreateBusiOptAPI: `${prefix}/busiOppty/create`,
  // 查询对应客户的拜访信息
  crmCstmCallListAPI: `${prefix}/cstmCallList`
}