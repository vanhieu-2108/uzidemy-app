import { config } from 'dotenv'
import fs from 'fs'
import path from 'path'
export const env = process.env.NODE_ENV
const envFilename = `.env.${env}`
if (!env) {
  console.log('Bạn chưa cung cấp biến môi trường NODE_ENV (dev, prod)')
  console.log(`Phát hiện NODE_ENV = ${env}`)
  process.exit(1)
}
console.log(`Phát hiện NODE_ENV = ${env}, vì thế app sẽ dùng file ${env === 'dev' ? '.env' : envFilename}`)
if (!fs.existsSync(path.resolve(env === 'dev' ? '.env' : envFilename))) {
  console.log('Không tìm thấy file môi trường')
  console.log('Lưu ý: Môi trường dev thì phải có file .env, prod thì phải có file .env.prod')
  console.log(`Vui lòng tạo file ${envFilename} và cung cấp các biến môi trường`)
  process.exit(1)
}
config({
  path: env === 'dev' ? `.env` : envFilename
})
const envConfig = {
  host: process.env.HOST,
  port: process.env.PORT || 4000,
  dbName: process.env.DB_NAME,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbCollectionRefreshToken: process.env.DB_COLLECTION_REFRESH_TOKENS as string,
  dbCollectionUsers: process.env.DB_COLLECTION_USERS as string,
  dbCollectionCourses: process.env.DB_COLLECTION_COURSES as string,
  dbCollectionLectures: process.env.DB_COLLECTION_LECTURES as string,
  dbCollectionChapters: process.env.DB_COLLECTION_CHAPTERS as string,
  dbCollectionOrders: process.env.DB_COLLECTION_ORDERS as string,
  dbCollectionQuizzes: process.env.DB_COLLECTION_QUIZZES as string,
  dbCollectionComments: process.env.DB_COLLECTION_COMMENTS as string,
  dbCollectionPosts: process.env.DB_COLLECTION_POSTS as string,
  emailSecret: process.env.EMAIL_SECRET as string,
  emailExpiresIn: process.env.EMAIL_EXPIRESIN as string,
  accessTokenSecret: process.env.ACCESSTOKEN_SECRET as string,
  accessTokenExpiresIn: process.env.ACCESSTOKEN_EXPIRESIN as string,
  refreshTokenSecret: process.env.REFRESHTOKEN_SECRET as string,
  refreshTokenExpiresIn: process.env.REFRESHTOKEN_EXPIRESIN as string,
  forgotPasswordSecret: process.env.FORGOT_PASSWORD_SECRET as string,
  forgotPasswordExpiresIn: process.env.FORGOT_PASSWORD_EXPIRESIN as string,
  aws_access_key_id: process.env.AWS_ACCESS_KEY_ID,
  aws_secret_access_key: process.env.AWS_SECRET_ACCESS_KEY,
  aws_region: process.env.AWS_REGION,
  ses_from_address: process.env.SES_FROM_ADDRESS,
  payosCLientId: process.env.PAYOS_CLIENT_ID as string,
  payosApiKey: process.env.PAYOS_API_KEY as string,
  payosChecksumKey: process.env.PAYOS_CHECKSUM_KEY as string
}

export default envConfig
