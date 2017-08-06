const fs = require('fs');

fs.readFile('./data.json', 'utf8',(err, data) => {
  // console.log(data)
  newData = JSON.parse(data)
  let itemIndex = 0
  newData.goods.forEach((item) => {
    item.foods.forEach((item) => {
      item.itemNum = itemIndex++
    })
  })
  fs.writeFileSync('newData.json', JSON.stringify(newData))
})