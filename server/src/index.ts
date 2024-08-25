import cors from 'cors'
import express from 'express'
import { defaultErrorHandler } from '~/middlewares/error.middlewares'
import coursesRouter from '~/routes/courses.routes'
import mediasRouter from '~/routes/medias.routes'
import staticRouter from '~/routes/static.routes'
import usersRouter from '~/routes/users.routes'
import databaseService from '~/services/database.services'
import { initFolder } from '~/utils/file'
import chaptersRouter from '~/routes/chapters.routes'
import paymentRouter from '~/routes/payment.routes'
import lecturesRouter from '~/routes/lectures.routes'
import quizzesRouter from '~/routes/quizzes.routes'
import commentsRouter from '~/routes/comments.routes'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import compression from 'compression'
import envConfig from '~/utils/config'
const app = express()
const port = envConfig.port
app.use(
  cors({
    origin: '*'
  })
)
// Bảo mật ứng dụng
// Helmet giúp bảo vệ ứng dụng khỏi một số lỗ hổng bảo mật
app.use(helmet())
// Rate limit giúp giới hạn số lượng request mà một IP có thể thực hiện trong một khoảng thời gian nhất định
// Tránh tình trạng bị tấn công DDoS
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 phút
    max: 100, // Giới hạn 100 request trong 15 phút của một IP,
    message: 'Quá nhiều request từ IP của bạn, vui lòng thử lại sau 15 phút'
  })
)
// Nén dữ liệu trước khi gửi về cho client
app.use(compression())
// Sử dụng thư mục public làm static folder
app.use(express.static('public'))
// Chuyển json từ body sang object
app.use(express.json())
// Kết nối với database
databaseService.connect().catch(console.dir)
// Tạo thư mục uploads
initFolder()
// Các route của ứng dụng
app.use('/users', usersRouter)
app.use('/courses', coursesRouter)
app.use('/chapters', chaptersRouter)
app.use('/lectures', lecturesRouter)
app.use('/medias', mediasRouter)
app.use('/static', staticRouter)
app.use('/payment', paymentRouter)
app.use('/quizzes', quizzesRouter)
app.use('/comments', commentsRouter)
// Error handler xử lý tất cả các lỗi trong ứng dụng
app.use(defaultErrorHandler)
// Khởi động server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
