import { Collection, Db, MongoClient } from 'mongodb'
import Chapter from '~/model/schemas/Chapter.schema'
import Comment from '~/model/schemas/Comment.schema'
import Course from '~/model/schemas/Course.schema'
import Lecture from '~/model/schemas/Lecture.schema'
import Order from '~/model/schemas/Order.schema'
import Post from '~/model/schemas/Post.schema'
import Quiz from '~/model/schemas/Quiz.schema'
import RefreshToken from '~/model/schemas/RefreshToken.schema'
import User from '~/model/schemas/User.schema'
import envConfig from '~/utils/config'
const uri = `mongodb+srv://${envConfig.dbUsername}:${envConfig.dbPassword}@ucademy.h8csv5s.mongodb.net/?retryWrites=true&w=majority&appName=Ucademy`
class DatabaseService {
  client: MongoClient
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
    return this.db.collection(envConfig.dbCollectionRefreshToken)
  }

  get courses(): Collection<Course> {
    return this.db.collection(envConfig.dbCollectionCourses)
  }

  get chapters(): Collection<Chapter> {
    return this.db.collection(envConfig.dbCollectionChapters)
  }

  get lectures(): Collection<Lecture> {
    return this.db.collection(envConfig.dbCollectionLectures)
  }

  get orders(): Collection<Order> {
    return this.db.collection(envConfig.dbCollectionOrders)
  }

  get quizzes(): Collection<Quiz> {
    return this.db.collection(envConfig.dbCollectionQuizzes)
  }

  get comments(): Collection<Comment> {
    return this.db.collection(envConfig.dbCollectionComments)
  }

  get posts(): Collection<Post> {
    return this.db.collection(envConfig.dbCollectionPosts)
  }
}

const databaseService = new DatabaseService()
export default databaseService
