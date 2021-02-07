
const tools = {
}

// 判空
tools.isBlank = function(str) {
  if (str === undefined || str === null) {
    return true
  } else if (typeof str === 'string' && str === '') {
    return true
  } else if (typeof str === 'object' && Object.keys(str).length === 0) {
    return true
  }
  return false
}

/**
 * 记录搜索count数
 * @param {*} data 搜索结果
 * @param  {...any} names 属性名
 */
tools.normalSearchCopy = function(data, ...names) {
  if (tools.isBlank(data)) { return }
  for (let j = 0; j < names.length; j++) {
    const list = data[names[j]]
    for (let index = 0; index < list.length; index++) {
      list[index].oldCount = list[index].count
    }
  }
}
/**
 * 合成新count数
 * @param {Array} list 搜索结果
 * @param {Array} addList 刷新结果
 */
tools.normalSearchMergeList = function(list, addList) {
  if (tools.isBlank(list) || tools.isBlank(addList)) { return }
  for (let index = 0; index < addList.length; index++) {
    const element = addList[index]
    element.oldCount = list[index].oldCount
  }
}

/**
 * 递归查询所有父节点集合
 * newLevel = commonUtil.getParent(info, '2021-1531')
 * @param {*} data2 数据节点
 * @param {*} nodeId2 待查询节点id
 */
tools.getParent = function(data2, nodeId2) {
  let arrRes = []
  if (data2.length === 0) {
    if (nodeId2) {
      arrRes.unshift(data2)
    }
    return arrRes
  }
  const rev = (data, nodeId) => {
    for (var i = 0, length = data.length; i < length; i++) {
      const node = data[i]
      if (node.id === nodeId) {
        arrRes.unshift(node)
        rev(data2, node.parentId)
        break
      } else {
        if (node.children) {
          rev(node.children, nodeId)
        }
      }
    }
    return arrRes
  }
  arrRes = rev(data2, nodeId2)
  return arrRes
}

/**
 * 根据[属性]获取指定节点
 * @param {*} obj root 节点
 * @param {*} fieldName 字段名
 * @param {*} fieldValue 字段值
 * @param {*} callback 回调方法
 * changeNode(root,'checked',true,(node,root)=>{
 * node.flag = '我得checked=ture'
 * })
 */
tools.changeNode = function(obj, fieldName, fieldValue, callback) {
  if (!tools.isBlank(obj) && obj.length > 0) {
    let o = obj.length
    while (o--) {
      if (obj[o][fieldName] === fieldValue) {
        callback(obj[o], obj)
      } else {
        if (obj[o].hasOwnProperty('children') && obj[o].children.length !== 0) {
          tools.changeNode(obj[o].children, fieldName, fieldValue)
        }
      }
    }
  }
}

/**
 * 合并新旧的树形结构
 * mergeDataTree(oldTree, {})
 * @param {*} oldTree 旧的树形结构
 * @param {*} newTree 新的树形结构
 */
tools.mergeDataTree = function(oldTree, newTree) {
  if (typeof oldTree !== 'object' || typeof newTree !== 'object') {
    return
  }
  oldTree.fileItemCount = newTree.fileItemCount ? newTree.fileItemCount : 0
  oldTree.totalFileItemCount = newTree.totalFileItemCount ? newTree.totalFileItemCount : 0
  const oldChilds = oldTree.children
  let newChilds = newTree.children
  if (oldChilds === undefined || oldChilds.length === 0) {
    return
  }
  if (newChilds === undefined) {
    newChilds = []
  }

  let oldChild = {}
  let newChild = {}
  for (let i = 0; i < oldChilds.length; i++) {
    let findFlg = false
    oldChild = oldChilds[i]
    if (newChilds.length > 0) {
      for (let j = 0; j < newChilds.length; j++) {
        newChild = newChilds[j]
        if (newChild.id === oldChild.id) {
          findFlg = true
          oldChild.fileItemCount = newChild.fileItemCount
          oldChild.totalFileItemCount = newChild.totalFileItemCount
          break
        }
      }
    }
    if (!findFlg) {
      oldChild.fileItemCount = 0
      oldChild.totalFileItemCount = 0
      tools.mergeDataTree(oldChild, {})
    } else {
      tools.mergeDataTree(oldChild, newChild)
    }
  }
}

/**
 * 树结构中记录首次搜索结果
 * mergeDataTree(oldTree, {})
 * @param {*} dataTree 树形结构
 */
tools.recordDataTreeFirstCount = function(dataTree) {
  if (typeof dataTree !== 'object') {
    return
  }
  dataTree.oldTotalFileItemCount = dataTree.totalFileItemCount
  const treeChilds = dataTree.children
  if (treeChilds === undefined || treeChilds.length === 0) {
    return
  }

  let treeChild = {}
  for (let i = 0; i < treeChilds.length; i++) {
    treeChild = treeChilds[i]
    treeChild.oldTotalFileItemCount = treeChild.totalFileItemCount
    tools.recordDataTreeFirstCount(treeChild)
  }
}

/**
 * 遇到相同元素级属性，以（minor）为准 // 不返还新Object，而是main改变
 * @param {*} minor 新tree
 * @param {*} main 旧tree
 */
tools.mergeTree = function(minor, main) {
  if (!tools.isBlank(minor)) {
    if (minor.id === main.id) {
      if (tools.isBlank(main.fileItemCount)) {
        main.fileItemCount = 0
      } else {
        main.fileItemCount = minor.fileItemCount
        main.totalFileItemCount = minor.totalFileItemCount
      }
    }
    if (!tools.isBlank(minor.children)) {
      for (const key in minor.children) {
        tools.mergeTree(minor.children[key], main.children[key])
      }
    }
  }
}

/**
 * 变更节点及其子阶段勾选或者取消勾选
 * @param {*} root 当前节点
 * @param {*} keysList 勾选项的id
 * @param {*} isChecked true->勾选 false->取消勾选
 */
tools.isCheckedChild = function(root, keysList, isChecked) {
  if (!tools.isBlank(root)) {
    const res = function(node) {
      if (!tools.isBlank(node)) {
        if (isChecked) {
          // 勾选节点
          keysList.push(node.id)
        } else {
          // 取消勾选
          for (let index = 0; index < keysList.length; index++) {
            if (keysList[index] === node.id) {
              keysList.splice(index, 1)
              index--
            }
          }
        }
        // 遍历子阶段
        if (!tools.isBlank(node.children)) {
          for (const iterator of node.children) {
            res(iterator)
          }
        }
      }
    }
    res(root)
  }
}

/**
 * 数组去重
 * @param {*} arr 数组
 */
tools.unique = function(arr) {
  return arr.filter(function(item, index, arr) {
    // 当前元素，在原始数组中的第一个索引==当前索引值，否则返回当前元素
    return arr.indexOf(item, 0) === index
  })
}
export default tools
