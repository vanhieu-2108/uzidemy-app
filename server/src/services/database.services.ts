import { Collection, Db, MongoClient } from 'mongodb'
import RefreshToken from '~/model/schemas/RefreshToken.schema'
import User from '~/model/schemas/User.schema'
import envConfig from '~/utils/config'
const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@ucademy.h8csv5s.mongodb.net/?retryWrites=true&w=majority&appName=Ucademy`
class DatabaseService {
  private client: MongoClient
  private db: Db
  constructor() {
    this.client = new MongoClient(uri)
    this.db = this.client.db(envConfig.dbName)
  }
  async connect() {
    await this.db.command({ ping: 1 })
    console.log('Pinged your deployment. You successfully connected to MongoDB!')
  }
  get users(): Collection<User> {
    return this.db.collection(envConfig.dbCollectionUsers)
  }

  get refreshTokens(): Collection<RefreshToken> {
    return this.db.collection(envConfig.dbRefreshToken)
  }
}

const databaseService = new DatabaseService()
export default databaseService
