import express from 'express'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import usersRouter from '~/routes/users.routes'
import databaseService from '~/services/database.services'
const app = express()
const port = process.env.PORT

// Chuyển json từ request body sang object
app.use(express.json())
// Kết nối với database
databaseService.connect().catch(console.dir)
// Các route của ứng dụng
app.use('/users', usersRouter)
app.use(defaultErrorHandler)
// Khởi động server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
