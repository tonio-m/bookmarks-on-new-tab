const makeHyperlink = (obj) => {
  // create div element
  let div = document.createElement("div")
  let class_ = document.createAttribute("class")
  class_.value = 'itembox'
  div.setAttributeNode(class_)

  // create image element
  let domain = "default"
  try { domain = new URL(obj.url).host } catch { }
  let img = document.createElement('img')
  img.src = `https://icons.duckduckgo.com/ip3/${domain}.ico`
  img.height = 16
  img.width = 16


  // create link element
  var link = document.createElement('a');
  link.textContent = obj.title
  link.href = obj.url


  // set both as children of div
  div.appendChild(img)
  div.appendChild(link)

  return div
}

const createTable = (itemList, tableTitle, columnNumber) => {
  const table = document.createElement('table')

  // make title
  let tableRow = table.insertRow()
  const tableHeading = document.createElement('th')
  tableHeading.textContent = tableTitle
  tableRow.appendChild(tableHeading)

  // insert Cells
  itemList.forEach( (item,index) => {
    if (index % columnNumber == 0){
      tableRow = table.insertRow();
    }
    let tableCell = tableRow.insertCell();
    let child = makeHyperlink(item)
    tableCell.appendChild(child)
  })

  return table
}

const getAllNestedFolders = (itemList,prefix,arrayToStore) => {
  itemList.forEach(item => {
    if ('children' in item){
      item.title = `${prefix}/${item.title}`
      arrayToStore.push(item)
      getAllNestedFolders(item.children,item.title,arrayToStore)
    }
  })
}

chrome.bookmarks.getTree((results) => {
  let div = document.getElementById('bookmarks')
  const bookmarksMenu = results[0].children[0].children
  const otherBookmarks = results[0].children[2].children
  const bookmarksToolbar = results[0].children[1].children

  if (bookmarksToolbar.length > 0){
    div.appendChild(createTable(bookmarksToolbar,'Bookmarks Toolbar',3))
  }

  let nestedFolders = []
  getAllNestedFolders(bookmarksToolbar,'Bookmarks Toolbar', nestedFolders)
  nestedFolders.forEach( folder => {
    if (folder.children.length > 0){
      div.appendChild(createTable(folder.children,folder.title,3))
    }
  })
})
