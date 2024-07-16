import { config } from 'dotenv'
config()
const envConfig = {
  port: process.env.PORT || 4000,
  dbName: process.env.DB_NAME,
  dbUsername: process.env.DB_USERNAME,
  dbPassword: process.env.DB_PASSWORD,
  dbRefreshToken: process.env.DB_COLLECTION_REFRESH_TOKENS as string,
  dbCollectionUsers: process.env.DB_COLLECTION_USERS as string,
  accessTokenSecret: process.env.ACCESSTOKEN_SECRET as string,
  accessTokenExpiresIn: process.env.ACCESSTOKEN_EXPIRESIN as string,
  refreshTokenSecret: process.env.REFRESHTOKEN_SECRET as string,
  refreshTokenExpiresIn: process.env.REFRESHTOKEN_EXPIRESIN as string
}

export default envConfig
