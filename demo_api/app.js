var express = require('express')
var path = require('path')
var fs = require('fs')
var bodyParser = require('body-parser') // 对post请求的请求体进行解析模块
var app = express()
app.use(bodyParser.urlencoded({
  extended: false,
  'Content-Type': 'application/json'
})) // bodyParser.urlencoded 用来解析request中body的 urlencoded字符，只支持utf-8的编码的字符，也支持自动的解析gzip和 zlib。返回的对象是一个键值对，当extended为false的时候，键值对中的值就为'String'或'Array'形式，为true的时候，则可为任何数据类型。
app.use(bodyParser.json())
var hostName = '127.0.0.1' // ip
var port = 8081 // 端口
// 设置允许跨域请求
app.all('*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  res.header('Access-Control-Allow-Metheds', 'PUT, POST, GET, DELETE, OPTIONS')
  res.header('Content-Type', 'application/json;charset=utf-8')
  next()
})
// 创建get接口
app.post('/iv-es/api/getSummaryList', (req, res) => {
  console.log('查询参数：', req.body) // 获取请求参数
  const { year, department, category, state, zero } = req.body
  const file = path.join(__dirname, 'dataList/data.json') // 文件路径，__dirname为当前运行js文件的目录
  // 读取json文件
  fs.readFile(file, 'utf-8', function(err, data1) {
    if (err) {
      console.log('文件读取失败')
      res.send({
        summaryList: [],
        code: 0,
        mes: '程序运行错误'
      })
    } else {
      // eslint-disable-next-line no-undef
      data = JSON.parse(data1)

      // eslint-disable-next-line no-undef
      const { summaryList } = data
      let list = [...summaryList]
      // 条件查询
      if (year) {
        list = list.filter(item => item.year === year)
      }
      if (department) {
        list = list.filter(item => item.department === department)
      }
      if (category) {
        list = list.filter(item => item.category === category)
      }
      if (state) {
        // console.log()
        list = list.filter(item => item.state === state)
      }
      if (zero && zero === 2) {
        list = list.filter(item => {
          if (!item.valueList.every(value => value.value === 0)) {
            // console.log('我进来了')
            return item
          }
        })
      }
      // 计算总合
      const countList = []
      list.forEach(item => {
        item.valueList.forEach((v, i) => {
          countList[i] = countList[i] || {}
          countList[i].title = v.title
          countList[i].value = countList[i].value ? countList[i].value + v.value : v.value
        })
      })
      console.log(countList)
      setTimeout(() => {
        res.send({ summaryList: list, countList })
      }, 200)
    }
  })
})
// 0. 共同 业务字典取得
app.post('/iv-es/api/base/getDictEntriesByTypeId', (req, res) => {
  const { dictTypeId } = req.body
  // 读取json文件并送信
  const file = path.join(__dirname, 'dataList/dict.json') // 文件路径，__dirname为当前运行js文件的目录
  // 读取json文件
  fs.readFile(file, 'utf-8', function(err, data1) {
    if (err) {
      console.log('文件读取失败')
      res.send({
        code: 0,
        mes: '程序运行错误'
      })
    } else {
      // eslint-disable-next-line no-undef
      data = JSON.parse(data1)

      // eslint-disable-next-line no-undef
      const json = data[dictTypeId]
      console.log(json)
      setTimeout(() => {
        res.send(json)
      }, 200)
    }
  })
})
// 1. loginApi
app.post('/iv-es/api/auth/ajaxLogin', (req, res) => {
  console.log('查询参数：', req.body) // 获取请求参数
  // 读取json文件并送信
  sentResByJson('dataList/logininfo.json', res)
})
app.get('/iv-es/api/auth/loginInfo', (req, res) => {
  console.log('查询参数：', req.body) // 获取请求参数
  // 读取json文件并送信
  sentResByJson('dataList/logininfo.json', res)
})

app.get('/iv-es/api/auth/logout', (req, res) => {
  console.log('查询参数：', req.body) // 获取请求参数
  // 读取json文件并送信
  const data = { 'messages': [], 'warnings': [], 'message': null, 'arguments': null, 'success': true, 'datas': {}}
  setTimeout(() => {
    res.send(data)
  }, 200)
})

// 2. home画面取得用户tasks
app.post('/iv-es/api/home/task', (req, res) => {
  console.log('查询参数：', req.body) // 获取请求参数
  // 读取json文件并送信
  sentResByJson('dataList/approve/tasks.json', res)
})

// 3. home画面取得用户runningaprove/
app.post('/iv-es/api/home/todolist', (req, res) => {
  console.log('查询参数：', req.body) // 获取请求参数
  // 读取json文件并送信
  sentResByJson('dataList/approve/todoList.json', res)
})

// 3. home画面取得用户running
app.post('/iv-es/api/workflow/user/finished', (req, res) => {
  console.log('查询参数：', req.body) // 获取请求参数
  // 读取json文件并送信
  sentResByJson('dataList/approve/finished.json', res)
})

// 4. home画面取得用户组织预算实绩
app.get('/iv-es/api/home/getHomeBafInfo', (req, res) => {
  console.log('查询参数：', req.body) // 获取请求参数
  // 读取json文件并送信
  sentResByJson('dataList/dashboard/homeBafInfo.json', res)
})

// 4. 预算模板的取得api/wfdemo/list
app.post('/iv-es/api/wfdemo/list', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/demodata/wfdemo.json', res)
})

// 5 admin组织取得/listOrgs
app.post('/iv-es/api/org/listOrgs', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/listOrgs.json', res)
})

// 6 admin组织及人员取得/listOrgs
app.post('/iv-es/api/org/getAllOrgAndUserTree/:test', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/allOrgAndUserTree.json', res)
})

// 7. home画面取得用户进行中审批
app.post('/iv-es/api/home/running', (req, res) => {
  console.log('查询参数：', req.body) // 获取请求参数
  // 读取json文件并送信
  sentResByJson('dataList/approve/runnings.json', res)
})

app.post('/iv-es/api/org/getAllOrgTree', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/allOrgTree.json', res)
})

app.post('/iv-es/api/org/getAllOrgTree/:year', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/org/allOrgTree.json', res)
})

app.post('/iv-es/api/org/getAllOrgYears', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/allOrgYear.json', res)
})

app.post('/iv-es/api/org/orgUserEdit/:account', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/userinfo.json', res)
})

// 取得业务信息信息
app.get('/iv-es/api/wfdemo/info', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/demodata/onedata.json', res)
})

// 取得审批的详细信息
app.post('/iv-es/api/workflow/admin/processInstInfo/:processInstId', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/approve/processdetail.json', res)
})
app.get('/iv-es/api/workflow/user/process/trace/:taskid', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/approve/trace.json', res)
})
app.get('/iv-es/api/workflow/user/process/alltrace/:taskid', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/approve/trace.json', res)
})

app.get('/iv-es/api/workflow/user/showPic/:taskid', (req, res) => {
  // 读取json文件并送信
  const filePath = path.join(__dirname, 'dataList/approve/workflow.png')

  res.sendFile(filePath)
})
app.get('/iv-es/api/workflow/user/getBackActivity', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/approve/backActivityList.json', res)
})

app.post('/iv-es/api/workflow/user/tasks', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/approve/workflowTask.json', res)
})

// 预实查看--预实一览
app.post('/iv-es/api/baf/list', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/baf/bafList.json', res)
})
app.post('/iv-es/api/budget/list', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/demodata/budgetList.json', res)
})

// --- 20200514 添加 start  add by ivision-------
// 组织树取得（预实画面，财务预设）
app.post('/iv-es/api/comm/bdmorglist', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/comm/bdmogList.json', res)
})
// 2-1 预实填写数据
app.post('/iv-es/api/baf/info', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/baf/2-1detail.json', res)
})

//  // 禀议查看3-1禀议一览画面
app.post('/iv-es/api/adr/list', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/adr/3-1adrList.json', res)
})
// 禀议查看3-2-1禀议详情画面(非叶子节点信息)
app.post('/iv-es/api/adr/departDetails', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/adr/3-2-1adrDepartDetails.json', res)
})
// 禀议查看3-2-2禀议详情画面(叶子节点信息)
app.post('/iv-es/api/adr/childDetails', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/adr/3-2-2adrChildDetails.json', res)
})
//  禀议查看3-3禀议详情查看.jpg
app.post('/iv-es/api/apr/detail', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/adr/3-3detail.json', res)
})
//  禀议查看3-4禀议详情查看.jpg
app.post('/iv-es/api/apr/applylist', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/adr/3-5applyList.json', res)
})
// 3-6禀议通过查看popup.jpg
app.post('/iv-es/api/apr/expenselist', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/adr/3-6List.json', res)
})

// 禀议申请画面 3-7禀议申请检索.jpg
app.post('/iv-es/api/apa/list', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/ada/3-7list.json', res)
})
// 禀议申请画面 3-7禀议申请检索.jpg
app.post('/iv-es/api/apa/info/', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/ada/3-9onedata.json', res)
})

// 7. 科目类API
// 7-1 预算科目一览的取得api/basedata/item/list
app.post('/iv-es/api/itm/list', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/itm/itemList.json', res)
})

// 7-2 获取系统所有科目组
app.post('/iv-es/api/itm/allParentItem', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/itm/allParentItem.json', res)
})

// 7-3 获取科目/科目组详细信息
app.post('/iv-es/api/itm/info/:id', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/itm/itemDetail.json', res)
})

// 7-4 科目信息保存
app.post('/iv-es/api/itm/new', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/itm/itemList.json', res)
})

// 8. 通用获取模板年度列表API
app.get('/iv-es/api/comm/tplyears', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/comm/tplYearList.json', res)
})

// 9. 分页查询模板列表API
app.post('/budgetms/api/tpl/list', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/tpl/tplList.json', res)
})

// 10. 查询模板信息API
app.get('/budgetms/api/tpl/info/:id', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/tpl/4-1.json', res)
})

// 11. 查询顶层科目信息列表API
app.get('/budgetms/api/tpl/item/toplist', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/tpl/4-2.json', res)
})

// 12. popup分页查询科目列表API
app.post('/budgetms/api/itm/items', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/tpl/4-3.json', res)
})

// 13. 查询科目树形机构信息列表API
app.get('/budgetms/api/tpl/item/treelist', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/tpl/4-5.json', res)
})

// 14. 合计项编辑popup选中数据回显API
app.get('/budgetms/api/tpl/itemtotal/list', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/tpl/4-6.json', res)
})

// 15. 财务预设右边表格数据列表API
app.post('/budgetms/api/tpl/bdmlist', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/tpl/4-9-budList.json', res)
})

// 预算申请检索画面
app.post('/budgetms/api/bdm/list', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/bdm/bdmList.json', res)
})

// 8. 通用获取模板年度列表API
app.post('/budgetms/api/comm/budorglist', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/comm/bdmogList.json', res)
})

// --- 20200514 添加 end -------

// --- 20200525 添加 start -----

app.post('/budgetms/api/tpl/save', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/tpl/4-1.json', res)
})

app.post('/budgetms/api/tpl/item/save', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/tpl/msg-ok.json', res)
})

app.post('/budgetms/api/tpl/itemtotal/save', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/tpl/msg-ok.json', res)
})

app.post('/budgetms/api/tpl/item/sortupdate', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/tpl/msg-ok.json', res)
})
// --- 20200525 添加 end -----

// --- 20200525 变更履历 添加 start -----
// 5-1更新履历.jpg
app.post('/budgetms/api/baf/updatehistory', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/baf/5-1updateHistory.json', res)
})

// 5-2更新履历.jpg
app.post('/budgetms/api/baf/itemhistory', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/baf/5-2updateHistoryOneItem.json', res)
})

// --- 20200525 变更履历 添加 end -----

app.post('/budgetms/api/tpl/reset', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/tpl/msg-ok.json', res)
})

app.post('/budgetms/api/comm/bdminfo', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/bud/bdm/2-1detail.json', res)
})

// 【ES-API-004】基本检索API
app.post('/iv-es/api/es/normalsearch', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/es/es-004.json', res)
})

// 【ES-API-005】基本检索过滤API.xlsx
app.post('/iv-es/api/es/filtersearch', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/es/es-005.json', res)
})
app.post('/iv-es/api/es/list', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/es/searchresult.json', res)
})

// 联想词  【ES-API-001】联想词API.xlsx
app.get('/iv-es/api/es/terms', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/es/terms.json', res)
})

// 热词  // 【ES-API-002】热词取得API.xlsx
app.get('/iv-es/api/es/hotwords', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/es/hotWords.json', res)
})

// 搜索履历  【ES-API-003】搜索履历列表取得API.xlsx
app.get('/iv-es/api/log/keywords', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/es/keywords.json', res)
})

// 【ES-API-006】文件树访问角色取得API
app.get('/iv-es/api/folderauth/esroles', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/es/es-006.json', res)
})

// 【ES-API-006】文件树访问角色取得API
app.post('/iv-es/api/folderauth/esroles', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/es/es-006.json', res)
})

// 【ES-API-007】文件访问权限树取得API
app.post('/iv-es/api/folderauth/foldertreeDemo', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/es/es-007.json', res)
})
app.get('/iv-es/api/folderauth/foldertree', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/es/es-007-2.json', res)
})

// 组织画面，拉去人员信息
app.post('/iv-es/api/org/orgUserInfo/:userId/:year', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/org/getUserInfo.json', res)
})
// 组织画面，拉去人员列表
app.post('/iv-es/api/org/listUsers', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/org/listUser.json', res)
})
// 组织画面，拉去人员列表
app.get('/iv-es/api/role/getAllRole', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/org/getAllRole.json', res)
})
// 组织画面，拉去人员列表
app.post('/iv-es/api/role/getRoleList', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/role/getRoleList.json', res)
})
app.post('/iv-es/api/role/editDetail/:roldId', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/role/roleDetail.json', res)
})
app.post('/iv-es/api/role/getAllResourceList', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/role/getAllResourceList.json', res)
})

app.post('/iv-es/api/dict/getDictTypeList', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/dict/getDictTypeList.json', res)
})

app.post('/iv-es/api/dict/getEntryList', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/dict/getEntryList.json', res)
})

app.post('/iv-es/api/resource/getResList', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/resource/getResList.json', res)
})

app.post('/iv-es/api/i18n/getList', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/i18n/getList.json', res)
})
app.get('/iv-es/api/online/onlineUsers', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/i18n/onlineUsers.json', res)
})

app.post('/iv-es/api/dac/getDacList', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/i18n/getDacList.json', res)
})

app.post('/iv-es/sc/scheduler/getScheduler', (req, res) => {
  // 读取json文件并送信
  sentResByJson('dataList/admin/i18n/getScheduler.json', res)
})

function sentResByJson(filePath, res) {
  const file = path.join(__dirname, filePath) // 文件路径，__dirname为当前运行js文件的目录
  fs.readFile(file, 'utf-8', function(err, data1) {
    if (err) {
      console.log('文件读取失败')
      res.send({
        code: 0,
        mes: '程序运行错误'
      })
    } else {
      // eslint-disable-next-line no-undef
      const data = JSON.parse(data1)
      // eslint-disable-next-line no-undef
      // const { jsonstr } = data
      setTimeout(() => {
        res.send(data)
      }, 200)
    }
  })
}
app.listen(port, hostName, function() {
  console.log('服务启动')
  console.log(`监听端口${port}`)
  console.log(`连接地址http://${hostName}:${port}`)
})
