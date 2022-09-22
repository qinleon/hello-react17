import { enumAll } from '@/api/dic'

export function getMediaList() {
  return new Promise((resolve, reject) => {
    enumAll({ deleteFlag: 'NO', enumFlag: 'MediaType' }).then(res => {
      const arr = res.data[0].dictList
      var parentNum = arr.filter(item => {
        return !item.pname
      })
      parentNum.forEach(item => {
        arr.forEach(element => {
          if (element.pname === item.name) {
            if (!item.children) {
              item.children = []
            }
            item.children.push(element)
          }
        })
      })
      resolve(parentNum.reverse())
    })
  })
}
