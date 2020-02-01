import {createConnection} from "typeorm"
createConnection((connection)=> {
  console.log("연결이 됬습니다.")
}).catch((error) => {
  console.log(error)
})