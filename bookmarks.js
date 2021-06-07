makeHyperlink = (obj) => {
  let domain = "default"
  try { domain = new URL(obj.url).host } 
  catch { }
  return `
  <div class="itembox">
    <img height="16" width="16" src='https://icons.duckduckgo.com/ip3/${domain}.ico' />
    <a href="${obj.url}"><span>${obj.title}</span></a>
  </div>
  `
}

makeFolder = (obj) => {
  return `
  <div class="itembox">
    <img height="16" width="16" src='https://icons.duckduckgo.com/ip3/default.ico' />
    <a href="chrome://bookmarks/?id=${obj.id}"><span>${obj.title}</span></a> 
  </div>
  `
}

makeTitle = (title) => {
  return `
    <h1>${title}</h1>
  `
}

makeTable = (title,rows) => {
  html = `<table><tr><th>${title}</th></tr>`
  rows.forEach(row => {
    html += "<tr>"
    row.forEach(item => {
      if (item.url != undefined){html += `<td> ${makeHyperlink(item)} </td>`} 
      else if (item.children != undefined){html += `<td> ${makeFolder(item)} </td>`}
    })
    html += "</tr>"
  })
  return html
}

chunks = (array,number) => {
  result = Array()
  for (i=0,j=array.length; i<j; i+=number) {
    result.push(array.slice(i,i+number))
  }
  return result
}

chrome.bookmarks.getTree(function(results){
  let colNumber = 3
  let html = String()
  let bookmarks = results[0].children[0].children
  // let otherBookmarks = results[0].children[1].children

  files = []
  foldersHTML = String()
  bookmarks.forEach( item => {
    isFile = (item.url != undefined)
    isFolder = ((item.children != undefined) && (item.children.length > 0))
    if (isFolder){
      table = chunks(item.children,colNumber)
      foldersHTML += makeTable(item.title,table)
    }
    else if (isFile){
      files.push(item)
    }
  })

  let itemsTable = chunks(files,colNumber)
  let itemsHTML = makeTable("",itemsTable)

  html += makeTitle("Bookmarks")
  html += itemsHTML
  html += foldersHTML
  
  let tag_id = document.getElementById('bookmarks')
  tag_id.innerHTML = html
})
